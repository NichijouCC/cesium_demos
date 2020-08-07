import { ToolEnum, samplePoint, addSampleMarkToScene, ImeasureHandler, MeasureStateEnum, AbstractMeasureTool } from "./measureTool";

export class PointMeasureHandler implements ImeasureHandler {
    samplePoint: { pos: Cesium.Cartesian3; ins: Cesium.Entity; }
    state: MeasureStateEnum;
    tag?: Cesium.Entity;
    result: Cesium.Cartesian3;

    constructor(viewer: Cesium.Viewer) {
        this.state = MeasureStateEnum.SAMPLING;
    }

    dispose(viewer: Cesium.Viewer): void {
        viewer.entities.remove(this.tag);
        viewer.entities.remove(this.samplePoint?.ins);
    }

    endSample() {
        this.state = MeasureStateEnum.FINISHED;
        this.result = this.samplePoint.pos.clone();
    }
}


export class PointTool extends AbstractMeasureTool<PointMeasureHandler> {
    readonly type = ToolEnum.POINT;
    createEventHandler(): void {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        this.handler = handler;
        handler.setInputAction((event) => {
            if (this.beActived) {
                if (this.currentMeasure == null || this.currentMeasure.state == MeasureStateEnum.FINISHED) {
                    this.currentMeasure = new PointMeasureHandler(this.viewer);
                }
                let point = this.addSamplePoint(event.position);
                if (point) {
                    this.currentMeasure.samplePoint = point;
                    this.endSample();
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    private endSample() {
        this.currentMeasure.endSample();
        this.onEndMeasure.raiseEvent(this.currentMeasure);
    }
}
