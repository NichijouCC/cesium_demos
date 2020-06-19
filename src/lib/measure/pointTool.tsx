import { ImeasureTool, ToolEnum, samplePoint } from "./measureTool";
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
        this.handler = handler;
        handler.setInputAction((event) => {
            if (this.beActived) {
                let point = samplePoint(this.viewer, event.position);
                if (point) {
                    let cargo = Cesium.Cartographic.fromCartesian(point);
                    let gps = [cargo.longitude * 180 / Math.PI, cargo.latitude * 180 / Math.PI, cargo.height];
                    let newPoint = this.viewer.entities.add({
                        position: point,
                        point: {
                            pixelSize: 5,
                            color: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.DEEPPINK,
                            outlineWidth: 2,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        },
                    });
                    if (this.onMeasureEnd) {
                        this.onMeasureEnd(gps);
                    }
                    ;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    active() {
        if (this.handler == null)
            this.createHandler();
        this.beActived = true;
        if (this.onPickPoint)
            this.onPickPoint(0);
    }
    disActive() {
        this.beActived = false;
    }
    onMeasureEnd: (point: number[]) => void;
    onPickPoint: (index: number) => void;
}
