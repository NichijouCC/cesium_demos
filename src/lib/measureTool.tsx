import { PointGoup, PointGoupTypeEnum } from "./pointEditorTool";
import { Debug } from "./debug";
export enum ToolEnum {
    POINT = "点测量",
    LINE = "线段测量",
    VOLUME = "体积测量"
}
export interface ImeasureTool {
    type: ToolEnum;
    active: () => void;
    disActive: () => void;
    onMeasureEnd: (data: any) => void;
}
export class PointTool implements ImeasureTool {
    handler: Cesium.ScreenSpaceEventHandler;
    viewer: Cesium.Viewer;
    beActived: boolean;
    readonly type = ToolEnum.POINT;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
    }
    private createHandler() {
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            if (this.beActived) {
                let ray = this.viewer.camera.getPickRay(event.position);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    let newPoint = this.viewer.entities.add({
                        position: picked.position,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 5,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                    if (this.onMeasureEnd) {
                        this.onMeasureEnd(picked.position.clone());
                    }
                    ;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler = handler;
    }
    active() {
        if (this.handler == null)
            this.createHandler();
        this.beActived = true;
    }
    disActive() {
        this.beActived = false;
    }
    onMeasureEnd: (point: Cesium.Cartesian3) => void;
}
export class LineTool implements ImeasureTool {
    handler: Cesium.ScreenSpaceEventHandler;
    viewer: Cesium.Viewer;
    beActived: boolean;
    readonly type = ToolEnum.LINE;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
    }
    private clickCount = 0;
    private starPos: Cesium.Cartesian3;
    private endPos: Cesium.Cartesian3;
    private currentLine: Cesium.Entity;
    private createHandler() {
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            if (this.beActived) {
                let ray = this.viewer.camera.getPickRay(event.position);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    let linePoint = this.viewer.entities.add({
                        position: picked.position,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 5,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                    if (this.onCreatePoint) {
                        this.onCreatePoint(linePoint);
                    }
                    if (this.clickCount == 0) {
                        this.clickCount++;
                        this.starPos = picked.position;
                        this.endPos = picked.position;
                        this.currentLine = this.viewer.entities.add({
                            polyline: {
                                positions: new Cesium.CallbackProperty(() => {
                                    return [picked.position, this.endPos];
                                }, false),
                                width: 4,
                                material: Cesium.Color.AQUA.withAlpha(0.3),
                                depthFailMaterial: Cesium.Color.AQUA.withAlpha(0.3)
                            }
                        });
                    }
                    else {
                        this.clickCount = 0;
                        let posArr = [this.starPos.clone(), picked.position.clone()];
                        this.currentLine.polyline.positions = posArr as any;
                        if (this.onMeasureEnd) {
                            this.onMeasureEnd(Cesium.Cartesian3.distance(posArr[0], posArr[1]));
                        }
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction((event) => {
            if (this.beActived && this.clickCount == 1) {
                let ray = this.viewer.camera.getPickRay(event.endPosition);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    this.endPos = picked.position;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler = handler;
    }
    active() {
        if (this.handler == null)
            this.createHandler();
        this.beActived = true;
    }
    disActive() {
        this.beActived = false;
    }
    onCreatePoint: (clickPos: Cesium.Entity) => void;
    onMeasureEnd: (lineLength: number) => void;
}
export class VolumeTool implements ImeasureTool {
    handler: Cesium.ScreenSpaceEventHandler;
    viewer: Cesium.Viewer;
    beActived: boolean;
    readonly type = ToolEnum.VOLUME;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
    }
    private points: Cesium.Cartesian3[] = [];
    private createHandler() {
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            if (this.beActived) {
                let ray = this.viewer.camera.getPickRay(event.position);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    let clampPos = this.viewer.scene.clampToHeight(picked.position);
                    if (clampPos) {
                        if (this.points.length == 0) {
                            this.viewer.entities.add({
                                polygon: {
                                    hierarchy: new Cesium.CallbackProperty(() => {
                                        return new Cesium.PolygonHierarchy(this.points);
                                    }, false),
                                    // extrudedHeight: 200,
                                    // height: height != null ? height : 0,
                                    material: Cesium.Color.AQUA.withAlpha(0.3),
                                    outline: true,
                                    // outlineColor: Cesium.Color.AQUA,
                                    outlineWidth: 20.0
                                }
                            });
                        }
                        let linePoint = this.viewer.entities.add({
                            position: picked.position,
                            point: {
                                pixelSize: 5,
                                color: Cesium.Color.WHITE,
                                outlineColor: Cesium.Color.BLUE,
                                outlineWidth: 5,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            }
                        });
                        this.points.push(clampPos.clone());
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction((event) => {
            if (this.beActived && this.points.length > 3) {
                let posArr = this.points;
                this.points = [];
                try {
                    let volume = VolumeTool.computeVolume(this.viewer, { posArr });
                    if (this.onMeasureEnd)
                        this.onMeasureEnd(volume);
                }
                catch (err) {
                }
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    active() {
        if (this.handler == null)
            this.createHandler();
        this.beActived = true;
    }
    disActive() {
        this.beActived = false;
    }
    onMeasureEnd: (volume: number) => void;
    private static computeVolume(viewer: Cesium.Viewer, options: {
        posArr: Cesium.Cartesian3[];
        basePlaneHeight?: number;
        sampleInterval?: number;
    }) {
        let { posArr, basePlaneHeight, sampleInterval = 1.0 } = options;
        if (basePlaneHeight != null) {
        }
        else {
            let minHeight = Number.POSITIVE_INFINITY;
            let carPosArr: Cesium.Cartographic[] = [];
            posArr.forEach(item => {
                let carPos = Cesium.Cartographic.fromCartesian(item);
                if (carPos.height < minHeight) {
                    minHeight = carPos.height;
                }
                carPosArr.push(carPos);
            });
            basePlaneHeight = minHeight;
        }
        //--------------------计算出中心点，以及中心点法线
        let centerPos = Cesium.BoundingSphere.fromPoints(posArr).center;
        let centerCarpos = Cesium.Cartographic.fromCartesian(centerPos);
        centerPos = Cesium.Cartesian3.fromRadians(centerCarpos.longitude, centerCarpos.latitude, basePlaneHeight);
        let centerNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(centerPos);
        //-------------------计算基准面，投影多边形点到平面上，计算出底面面积
        let basePlane = Cesium.Plane.fromPointNormal(centerPos, centerNormal);
        let projectPosArr = posArr.map(item => Cesium.Plane.projectPointOntoPlane(basePlane, item));
        // let posInPlane = projectPosArr.map(item => Cesium.Cartesian3.subtract(item, centerPos, new Cesium.Cartesian3()));
        //-----------------
        let dir_x_world = Cesium.Cartesian3.subtract(projectPosArr[1], projectPosArr[0], new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(dir_x_world, dir_x_world);
        let dir_z_world = basePlane.normal;
        let dir_y_world = Cesium.Cartesian3.cross(dir_z_world, dir_x_world, new Cesium.Cartesian3());
        let worldMat = new Cesium.Matrix4(dir_x_world.x, dir_y_world.x, dir_z_world.x, centerPos.x, dir_x_world.y, dir_y_world.y, dir_z_world.y, centerPos.y, dir_x_world.z, dir_y_world.z, dir_z_world.z, centerPos.z, 0, 0, 0, 1);
        let mat = Cesium.Matrix4.inverse(worldMat, new Cesium.Matrix4());
        let pointsInPlaneWorld: Cesium.Cartesian3[] = [];
        let max = new Cesium.Cartesian2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        let min = new Cesium.Cartesian2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        projectPosArr.forEach(item => {
            let pointInPlane = Cesium.Matrix4.multiplyByPoint(mat, item, new Cesium.Cartesian3());
            pointInPlane.z = 0;
            pointsInPlaneWorld.push(pointInPlane);
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
        let width = max.x - min.x;
        let height = max.y - min.y;
        let sampleCount_x = Math.ceil(width / sampleInterval);
        let sampleCount_y = Math.ceil(height / sampleInterval);
        let sampleHeight: number[] = [];
        for (let i = 0; i <= sampleCount_x; i++) {
            for (let j = 0; j <= sampleCount_y; j++) {
                let samplePosInPlane = new Cesium.Cartesian3(min.x + (i + 0.5) * sampleInterval, min.y + (j + 0.5) * sampleInterval, 0);
                if (this.isInPolygon(samplePosInPlane, pointsInPlaneWorld)) {
                    let samplePosInWorld = Cesium.Matrix4.multiplyByPoint(worldMat, samplePosInPlane, new Cesium.Cartesian3());
                    let clampPos = viewer.scene.clampToHeight(samplePosInWorld);
                    if (clampPos != null) {
                        let height = Cesium.Cartesian3.distance(samplePosInWorld, clampPos);
                        sampleHeight.push(height);
                        Debug.drawPoint(viewer, clampPos);
                    }
                }
            }
        }
        // let samplePos=projectPosArr.map(item=>viewer.scene.clampToHeight(item)) ;
        let basePloygonArea = this.computeArea(pointsInPlaneWorld);
        let averageHeight = sampleHeight.reduce((total, currentValue) => { return total + currentValue; }, 0) / sampleHeight.length;
        return averageHeight * basePloygonArea;
    }
    private static computeArea(posArr: Cesium.Cartesian3[]) {
        let startPos = posArr[0];
        let temptLeft = new Cesium.Cartesian3();
        let temptRight = new Cesium.Cartesian3();
        let totalArea = 0;
        for (let i = 1; i < posArr.length - 1; i++) {
            let leftDir = Cesium.Cartesian3.subtract(posArr[i], startPos, temptLeft);
            let rightDir = Cesium.Cartesian3.subtract(posArr[i + 1], startPos, temptRight);
            let crossValue = Cesium.Cartesian3.cross(leftDir, rightDir, new Cesium.Cartesian3());
            totalArea += Cesium.Cartesian3.magnitude(crossValue) / 2;
        }
        return totalArea;
    }
    private static isInPolygon = (position: Cesium.Cartesian3, positions: Cesium.Cartesian3[]) => {
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
}
