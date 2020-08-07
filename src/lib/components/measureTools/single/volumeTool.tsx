import { ToolEnum, samplePoint, AbstractMeasureTool, ImeasureHandler, MeasureStateEnum } from "./measureTool";
import { AreaTool } from "./areaTool";

export class VolumMeasureHandler implements ImeasureHandler {
    state: MeasureStateEnum;
    options: {
        basePlanHeight: number,
        adjustheight: number,
    };
    samplePoints: { pos: Cesium.Cartesian3; ins: Cesium.Entity; }[];
    volumeSamplePoints: Cesium.Entity[];
    basePloygon: Cesium.Entity;
    basePlan: Cesium.Entity;
    Wall: Cesium.Entity;
    sampleHeightToPlan: number[];
    minHeight: number;
    maxHeight: number;
    projectPosArr: Cesium.Cartesian3[];
    basePloygonArea: number;
    centerPos: Cesium.Cartesian3;
    tag?: Cesium.Entity;
    result: {
        cutVolume: number;
        fillVolume: number;
    }

    constructor(viewer: Cesium.Viewer) {
        this.state = MeasureStateEnum.SAMPLING;
        this.samplePoints = [];
        this.basePloygon = viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.CallbackProperty(() => {
                    return new Cesium.PolygonHierarchy(this.samplePoints.map(item => item.pos.clone()));
                }, false),
                material: Cesium.Color.AQUA.withAlpha(0.3),
                outline: true,
                outlineWidth: 20.0
            }
        })
    };

    dispose(viewer: Cesium.Viewer): void {
        viewer.entities.remove(this.tag);
        viewer.entities.remove(this.basePloygon);
        viewer.entities.remove(this.basePlan);
        viewer.entities.remove(this.Wall);
        this.samplePoints?.forEach(item => viewer.entities.remove(item.ins));
        this.volumeSamplePoints?.forEach(item => viewer.entities.remove(item));
    }

    endSample() {
        this.state = MeasureStateEnum.FINISHED;

        let { sampleHeightToPlan, basePloygonArea, options: { adjustheight } } = this;
        let cutSampleHeight: number[] = [];
        let fillSampleHeight: number[] = [];
        sampleHeightToPlan.forEach((item) => {
            let relativeHeight = item - adjustheight;
            if (relativeHeight < 0) {
                fillSampleHeight.push(Math.abs(relativeHeight));
            }
            else {
                cutSampleHeight.push(relativeHeight);
            }
        });
        let cutHeightGroup = cutSampleHeight.reduce((total, currentValue) => { return total + currentValue; }, 0);
        let fillHeightGroup = fillSampleHeight.reduce((total, currentValue) => { return total + currentValue; }, 0);
        let cutVolume = cutHeightGroup * basePloygonArea / sampleHeightToPlan.length;
        let fillVolume = fillHeightGroup * basePloygonArea / sampleHeightToPlan.length;
        this.result = { cutVolume, fillVolume };


        this.basePlan.polygon.hierarchy = this.projectPosArr.map(item => {
            let carpos = Cesium.Cartographic.fromCartesian(item);
            return Cesium.Cartesian3.fromRadians(carpos.longitude, carpos.latitude, carpos.height + adjustheight);
        }) as any;
    }
}


export class VolumeTool extends AbstractMeasureTool<VolumMeasureHandler> {
    readonly type = ToolEnum.VOLUME;
    measureOptions = { basePlaneHeight: undefined, adjustHegiht: 0 };
    createEventHandler(): void {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.handler = handler;
        let timeoutIDs: NodeJS.Timeout[] = [];
        let clearTimeOut = () => {
            timeoutIDs.forEach(item => clearTimeout(item));
            timeoutIDs = [];
        }
        handler.setInputAction((event) => {
            if (this.beActived) {
                if (this.currentMeasure == null || this.currentMeasure.state == MeasureStateEnum.FINISHED) {
                    this.currentMeasure = new VolumMeasureHandler(this.viewer);
                }

                if (this.currentMeasure.state == MeasureStateEnum.COMPUING) return;

                let timeoutID = setTimeout(() => {
                    this.sample(event.position);
                }, 200);
                timeoutIDs.push(timeoutID);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction((event) => {
            if (this.beActived) {
                clearTimeOut();

                if (this.currentMeasure.state == MeasureStateEnum.COMPUING) return;

                this.sample(event.position);
                if (this.beActived && this.currentMeasure.samplePoints.length >= 2) {
                    this.endSample();
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        handler.setInputAction((event) => {
            if (this.beActived) {
                this.deleteLastPoint();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }

    private sample(mousePoint: Cesium.Cartesian2) {
        let pointData = this.addSamplePoint(mousePoint);
        let { samplePoints } = this.currentMeasure;
        samplePoints.push(pointData);
        this.onSampleChange.raiseEvent({ ...this.currentMeasure, options: { ...this.measureOptions } });
    }
    private deleteLastPoint() {
        if (this.currentMeasure.state != MeasureStateEnum.SAMPLING) return;
        let points = this.currentMeasure.samplePoints;
        if (points && points.length > 0) {
            let point = points.pop();
            this.viewer.entities.remove(point.ins);

            this.onSampleChange.raiseEvent({ ...this.currentMeasure, options: { ...this.measureOptions } });
        }
    }

    private async endSample() {
        this.currentMeasure.state = MeasureStateEnum.COMPUING;
        this.onSampleChange.raiseEvent(this.currentMeasure);

        let posArr = this.currentMeasure.samplePoints;
        let sampleData = await VolumeTool.sampleVolume(this.viewer, posArr.map(item => item.pos));
        this.currentMeasure.centerPos = sampleData.sample_centerPos;
        this.currentMeasure.projectPosArr = sampleData.sample_projectPosArr;
        this.currentMeasure.basePloygonArea = sampleData.basePloygonArea;
        this.currentMeasure.volumeSamplePoints = sampleData.volumeSamplePoints;
        this.currentMeasure.sampleHeightToPlan = sampleData.sampleHeightToPlan;
        this.currentMeasure.minHeight = sampleData.minHeight;
        this.currentMeasure.maxHeight = sampleData.maxHeight;
        this.currentMeasure.options = {
            basePlanHeight: sampleData.minHeight,
            adjustheight: 0
        };

        let wallEnities = VolumeTool.drawVolumeWall(this.viewer, { points: sampleData.sample_projectPosArr, minHeight: sampleData.minHeight, maxHeight: sampleData.maxHeight });
        this.currentMeasure.Wall = wallEnities.wall;
        this.currentMeasure.basePlan = wallEnities.plan;
        this.currentMeasure.endSample();

        this.onEndMeasure.raiseEvent(this.currentMeasure);
    }



    static async sampleVolume(viewer: Cesium.Viewer, sample_points: Cesium.Cartesian3[], sample_interval = 1.0) {
        let minHeight = Number.POSITIVE_INFINITY;
        sample_points.forEach(item => {
            let carPos = Cesium.Cartographic.fromCartesian(item);
            if (carPos.height < minHeight) {
                minHeight = carPos.height;
            }
        });
        let basePlaneHeight = minHeight;
        //--------------------计算出中心点，以及中心点法线
        let sample_centerPos = Cesium.BoundingSphere.fromPoints(sample_points).center;
        let centerCarpos = Cesium.Cartographic.fromCartesian(sample_centerPos);
        let centerPos = Cesium.Cartesian3.fromRadians(centerCarpos.longitude, centerCarpos.latitude, basePlaneHeight);
        // Debug.drawPoint(viewer, centerPos, Cesium.Color.GOLD);
        let centerNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(centerPos);
        //-------------------计算基准面，投影多边形点到平面上，计算出底面面积
        let basePlane = Cesium.Plane.fromPointNormal(centerPos, centerNormal);
        let sample_projectPosArr = sample_points.map(item => Cesium.Plane.projectPointOntoPlane(basePlane, item));
        //-----------------
        let dir_x_world = Cesium.Cartesian3.subtract(sample_projectPosArr[1], sample_projectPosArr[0], new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(dir_x_world, dir_x_world);
        let dir_z_world = basePlane.normal;
        let dir_y_world = Cesium.Cartesian3.cross(dir_z_world, dir_x_world, new Cesium.Cartesian3());
        let worldMat = new Cesium.Matrix4(dir_x_world.x, dir_y_world.x, dir_z_world.x, centerPos.x, dir_x_world.y, dir_y_world.y, dir_z_world.y, centerPos.y, dir_x_world.z, dir_y_world.z, dir_z_world.z, centerPos.z, 0, 0, 0, 1);
        let mat = Cesium.Matrix4.inverse(worldMat, new Cesium.Matrix4());
        let pointsInPlane: Cesium.Cartesian3[] = [];
        let max = new Cesium.Cartesian2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        let min = new Cesium.Cartesian2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        sample_projectPosArr.forEach(item => {
            let pointInPlane = Cesium.Matrix4.multiplyByPoint(mat, item, new Cesium.Cartesian3());
            pointInPlane.z = 0;
            pointsInPlane.push(pointInPlane);
            if (pointInPlane.x < min.x)
                min.x = pointInPlane.x;
            if (pointInPlane.y < min.y)
                min.y = pointInPlane.y;
            if (pointInPlane.x > max.x)
                max.x = pointInPlane.x;
            if (pointInPlane.y > max.y)
                max.y = pointInPlane.y;
            return pointInPlane;
        });
        let tag = viewer.entities.add({
            position: Cesium.BoundingSphere.fromPoints(sample_points).center,
            label: {
                text: 'computing...',
                //pixelOffset: new Cesium.Cartesian2(0, -1 * 100),
                showBackground: true,
                backgroundPadding: new Cesium.Cartesian2(15, 5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                font: '18px monospace',
                outlineWidth: 2,
            } as any
        });
        let basePloygonArea = AreaTool.compute(pointsInPlane);
        let width = max.x - min.x;
        let height = max.y - min.y;
        let sampleCount_x = Math.ceil(width / sample_interval);
        let sampleCount_y = Math.ceil(height / sample_interval);
        //-------------------最小采样100
        let maxCount = Math.max(sampleCount_x, sampleCount_y);
        if (maxCount < 100) {
            let x_smapleInterval = width / 100;
            let y_smapleInterval = height / 100;
            sample_interval = Math.max(x_smapleInterval, y_smapleInterval);
        }
        sampleCount_x = Math.ceil(width / sample_interval);
        sampleCount_y = Math.ceil(height / sample_interval);

        let sampleHeightToPlan: number[] = [];
        let volumeSamplePoints: Cesium.Entity[] = [];
        let bathCount = 20;
        let maxHeight: number = Number.NEGATIVE_INFINITY;

        let validSamplePoints = this.filterSamplePoint(sampleCount_x, sampleCount_y, min, sample_interval, pointsInPlane);
        let samplePointsInWorld = validSamplePoints.map(item => {
            let posInworld = Cesium.Matrix4.multiplyByPoint(worldMat, item, new Cesium.Cartesian3());
            return posInworld;
        });

        for (let i = 0; i < Math.ceil(samplePointsInWorld.length / bathCount); i++) {
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    for (let k = 0; k < bathCount; k++) {
                        let realJ = i * bathCount + k;
                        if (realJ < samplePointsInWorld.length) {
                            let clampPos = viewer.scene.clampToHeight(samplePointsInWorld[realJ], viewer.entities.values);//wallEnities.wall
                            if (clampPos != null) {
                                {
                                    let clampHeight = Cesium.Cartographic.fromCartesian(clampPos).height;
                                    if (clampHeight > maxHeight) maxHeight = clampHeight;
                                }
                                let height = Cesium.Plane.getPointDistance(basePlane, clampPos);
                                sampleHeightToPlan.push(height);
                                let pointItem = addVolumeSamplePoint(viewer, clampPos.clone());
                                volumeSamplePoints.push(pointItem);
                                // Debug.drawPoint(viewer, samplePosInWorld, Cesium.Color.GREEN);
                            }
                        } else {
                            break;
                        }
                    }
                    resolve();
                });
            });
        }
        viewer.entities.remove(tag);
        return { sample_interval, sample_points, sample_centerPos, sample_projectPosArr, basePloygonArea, volumeSamplePoints, sampleHeightToPlan, minHeight, maxHeight };
    }

    private static filterSamplePoint(sampleCount_x: number, sampleCount_y: number, min: Cesium.Cartesian2, sampleInterval: number, pointsInPlane: Cesium.Cartesian3[]) {
        let validSamplePoint: Cesium.Cartesian3[] = [];
        for (let i = 0; i <= sampleCount_x; i++) {
            for (let j = 0; j <= sampleCount_y; j++) {
                let samplePosInPlane = new Cesium.Cartesian3(min.x + (i + 0.5) * sampleInterval, min.y + (j + 0.5) * sampleInterval, 0);
                if (isInPolygon(samplePosInPlane, pointsInPlane)) {
                    validSamplePoint.push(samplePosInPlane);
                }
            }
        }
        return validSamplePoint;
    }

    private static drawVolumeWall(viewer: Cesium.Viewer, info: {
        points: Cesium.Cartesian3[];
        maxHeight: number;
        minHeight: number;
    }) {
        let { points, maxHeight, minHeight } = info;
        let wallPoints = points.concat(points[0]);
        let plan = viewer.entities.add({
            polygon: {
                hierarchy: points,
                perPositionHeight: true,
                // extrudedHeight: Cesium.Cartographic.fromCartesian(sampleData.centerPos).height,
                material: new Cesium.Color(1, 203 / 255, 0).withAlpha(0.36),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 5.0
            }
        });
        let wall = viewer.entities.add({
            wall: {
                positions: wallPoints,
                minimumHeights: wallPoints.map(item => minHeight),
                maximumHeights: wallPoints.map(item => maxHeight + 2),
                material: new Cesium.Color(61 / 255, 180 / 255, 239 / 255).withAlpha(0.36),
                outline: true,
                outlineColor: new Cesium.Color(0, 79 / 255, 128 / 255)
            } as any
        });
        return { plan, wall };
    }
}

function addVolumeSamplePoint(viewer: Cesium.Viewer, point: Cesium.Cartesian3) {
    let pointItem = viewer.entities.add({
        position: point,
        point: {
            color: new Cesium.Color(126 / 255, 68 / 255, 1).withAlpha(0.86),
            pixelSize: 2,
            //disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });
    return pointItem;
}

function isInPolygon(position: Cesium.Cartesian3, positions: Cesium.Cartesian3[]) {
    var nCross = 0;
    for (var i = 0; i < positions.length; i++) {
        var p1 = positions[i];
        var p2 = positions[(i + 1) % positions.length];
        if (p1.y == p2.y)
            continue;
        if (position.y < Math.min(p1.y, p2.y))
            continue;
        if (position.y >= Math.max(p1.y, p2.y))
            continue;
        var x = (position.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
        if (x > position.x)
            nCross++;
    }
    if (nCross % 2 == 1) {
        return true;
    }
    else {
        return false;
    }
};

