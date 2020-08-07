import { ToolEnum, samplePoint, addSampleMarkToScene, AbstractMeasureTool, ImeasureHandler, MeasureStateEnum } from "./measureTool";

export class LineMeasureHandler implements ImeasureHandler {
    state: MeasureStateEnum;
    options: {
        /**
         * 是否多线段
         */
        enableBrokenLine: boolean;
    };
    samplePoints: { pos: Cesium.Cartesian3; ins: Cesium.Entity; }[];
    line: Cesium.Entity;
    tag?: Cesium.Entity;
    temptEndPoint: Cesium.Cartesian3;

    result: number;
    constructor(viewer: Cesium.Viewer) {
        this.state = MeasureStateEnum.SAMPLING;
        let samplePoints: { pos: Cesium.Cartesian3; ins: Cesium.Entity; }[] = [];
        this.samplePoints = samplePoints;
        this.line = viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    let points = samplePoints.map(item => item.pos);
                    if (this.state == MeasureStateEnum.SAMPLING && points.length >= 1) {
                        points = points.concat(this.temptEndPoint);
                    }
                    return points;
                }, false),
                width: 2,
                material: Cesium.Color.DEEPPINK.withAlpha(0.7),
                depthFailMaterial: Cesium.Color.DEEPPINK.withAlpha(0.7)
            }
        })
    }

    endSample() {
        this.state = MeasureStateEnum.FINISHED;
        let pointArr = this.samplePoints.map(item => item.pos);
        this.line.polyline.positions = pointArr as any;
        this.result = pointArr.reduce((total, item, index) => total + (pointArr[index + 1] ? Cesium.Cartesian3.distance(item, pointArr[index + 1]) : 0), 0);
    }

    dispose(viewer: Cesium.Viewer): void {
        viewer.entities.remove(this.tag);
        viewer.entities.remove(this.line);
        this.samplePoints?.forEach(item => viewer.entities.remove(item.ins));
    }
}

export class LineTool extends AbstractMeasureTool<LineMeasureHandler> {
    readonly type = ToolEnum.LINE;
    measureOptions = { enableBrokenLine: false };
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
                    this.currentMeasure = new LineMeasureHandler(this.viewer);
                }
                let timeoutID = setTimeout(() => {
                    this.sample(event.position);
                }, 200);
                timeoutIDs.push(timeoutID);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction((event) => {
            clearTimeOut();
            if (this.beActived && this.measureOptions.enableBrokenLine) {
                this.sample(event.position);
                this.endSample();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        handler.setInputAction((event) => {
            if (this.beActived) {
                if (this.currentMeasure == null) return;
                let ray = this.viewer.camera.getPickRay(event.endPosition);
                let picked = this.viewer.scene.pickFromRay(ray, []);
                if (picked && picked.position != null) {
                    this.currentMeasure.temptEndPoint = picked.position;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction((event) => {
            if (this.beActived) {
                this.deleteLastSamplePoint();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    private sample(mousePoint: Cesium.Cartesian2) {
        let pointData = this.addSamplePoint(mousePoint);
        let { samplePoints } = this.currentMeasure;
        samplePoints.push(pointData);
        this.onSampleChange.raiseEvent({ ...this.currentMeasure, options: { ...this.measureOptions } });

        if (!this.measureOptions.enableBrokenLine && samplePoints.length == 2) {
            //------measure end
            this.endSample();
        }
    }

    private endSample() {
        this.currentMeasure.options = { ...this.measureOptions };
        this.currentMeasure.endSample();
        this.onEndMeasure.raiseEvent(this.currentMeasure);
    }

    private deleteLastSamplePoint() {
        if (this.currentMeasure.state != MeasureStateEnum.SAMPLING) return;
        let points = this.currentMeasure.samplePoints;
        if (points && points.length > 0) {
            let point = points.pop();
            this.viewer.entities.remove(point.ins);

            this.onSampleChange.raiseEvent({ ...this.currentMeasure, options: { ...this.measureOptions } });
        }
    }
}
