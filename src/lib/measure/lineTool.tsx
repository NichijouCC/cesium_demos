import { ImeasureTool, ToolEnum, samplePoint } from "./measureTool";

export class LineTool implements ImeasureTool {
    handler: Cesium.ScreenSpaceEventHandler;
    viewer: Cesium.Viewer;
    beActived: boolean;
    readonly type = ToolEnum.LINE;
    private enableBrokenLine: boolean = false;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
    }
    private endPos: Cesium.Cartesian3;
    private points: {
        pos: Cesium.Cartesian3;
        ins: Cesium.Entity;
    }[] = [];
    private currentLine: Cesium.Entity;
    setBrokenLine(active: boolean) {
        this.enableBrokenLine = active;
    }
    private addSamplePoint(clampPos: Cesium.Cartesian3) {
        if (this.points.length == 0) {
            if (this.onMeasureStart)
                this.onMeasureStart();
            this.endPos = clampPos.clone();
            this.currentLine = this.viewer.entities.add({
                polyline: {
                    positions: new Cesium.CallbackProperty(() => {
                        let points = this.points.map(item => item.pos);
                        if (this.enableBrokenLine) {
                            return [...points, this.endPos];
                        }
                        else {
                            if (this.points.length == 1) {
                                return [...points, this.endPos];
                            }
                            else {
                                return [...points];
                            }
                        }
                    }, false),
                    width: 2,
                    material: Cesium.Color.DEEPPINK.withAlpha(0.7),
                    depthFailMaterial: Cesium.Color.DEEPPINK.withAlpha(0.7)
                }
            });
        }
        let linePoint = this.viewer.entities.add({
            position: clampPos,
            point: {
                pixelSize: 5,
                color: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.DEEPPINK,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        if (this.onCreatePoint) {
            this.onCreatePoint(linePoint);
        }
        this.points.push({ pos: clampPos, ins: linePoint });
        if (this.onPickPoint)
            this.onPickPoint(this.points.length);
        if (!this.enableBrokenLine && this.points.length == 2) {
            this.computeSample();
        }
    }
    private computeSample() {
        let pointArr = this.points;
        this.points = [];
        let lens = pointArr.reduce((total, item, index) => total + (pointArr[index + 1] ? Cesium.Cartesian3.distance(item.pos, pointArr[index + 1].pos) : 0), 0);
        // let lens = Cesium.Cartesian3.distance(pointArr[0].pos, pointArr[1].pos);
        this.currentLine.polyline.positions = pointArr.map(item => item.pos.clone()) as any;
        if (this.onMeasureEnd)
            this.onMeasureEnd(lens);
    }
    private createHandler() {
        let handler = new Cesium.ScreenSpaceEventHandler();
        this.handler = handler;
        let timeoutIDs: NodeJS.Timeout[] = [];
        handler.setInputAction((event) => {
            if (this.beActived) {
                let timeoutID = setTimeout(() => {
                    let point = samplePoint(this.viewer, event.position);
                    if (point)
                        this.addSamplePoint(point);
                }, 200);
                timeoutIDs.push(timeoutID);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction((event) => {
            timeoutIDs.forEach(item => clearTimeout(item));
            if (this.beActived && this.enableBrokenLine) {
                let point = samplePoint(this.viewer, event.position);
                if (point) {
                    this.addSamplePoint(point);
                    this.computeSample();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        handler.setInputAction((event) => {
            if (this.beActived) {
                let ray = this.viewer.camera.getPickRay(event.endPosition);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    this.endPos = picked.position;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction((event) => {
            if (this.beActived) {
                this.delectLastPoint();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    delectLastPoint() {
        if (this.points.length > 0) {
            let point = this.points.splice(this.points.length - 1, 1);
            point.forEach(item => {
                this.viewer.entities.remove(item.ins);
            });
            if (this.onPickPoint)
                this.onPickPoint(this.points.length);
        }
    }
    active() {
        if (this.handler == null) {
            this.createHandler();
        }
        if (this.onPickPoint)
            this.onPickPoint(this.points.length);
        this.beActived = true;
    }
    disActive() {
        this.beActived = false;
    }
    onCreatePoint: (clickPos: Cesium.Entity) => void;
    onMeasureEnd: (lineLength: number) => void;
    onMeasureStart: () => void;
    onPickPoint: (index: number) => void;
}
