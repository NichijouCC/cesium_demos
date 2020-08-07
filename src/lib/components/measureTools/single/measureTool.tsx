export enum ToolEnum {
    POINT = "点测量",
    LINE = "线段测量",
    VOLUME = "体积测量",
    AREA = "面积测量"
}

export enum MeasureStateEnum {
    WAITING = "等待中",
    SAMPLING = "采样中",
    COMPUING = "计算中",
    FINISHED = "测量结束"
}

export function samplePoint(viewer, position: Cesium.Cartesian2): Cesium.Cartesian3 {
    let ray = viewer.camera.getPickRay(position);
    let picked = viewer.scene.pickFromRay(ray, []);
    if (picked && picked.position != null) {
        let clampPos = viewer.scene.clampToHeight(picked.position);
        return clampPos;
    }
    return null;
}

export function addSampleMarkToScene(viewer: Cesium.Viewer, clampPos: Cesium.Cartesian3, ) {
    return viewer.entities.add({
        position: clampPos,
        point: {
            pixelSize: 5,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.DEEPPINK,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    });
}

// export function createMeasureTool(viewer: Cesium.Viewer, type: ToolEnum): ImeasureTool {
//     if (type == ToolEnum.POINT) {
//         return new PointTool(viewer);
//     } else if (type == ToolEnum.LINE) {
//         return new LineTool(viewer);
//     } else if (type == ToolEnum.VOLUME) {
//         return new VolumeTool(viewer);
//     }
// }


export interface ImeasureHandler {
    state: MeasureStateEnum;
    tag?: Cesium.Entity;
    dispose(viewer: Cesium.Viewer): void;
}

export abstract class AbstractMeasureTool<T extends ImeasureHandler> {
    readonly abstract type: ToolEnum;
    protected currentMeasure: T;
    protected handler: Cesium.ScreenSpaceEventHandler;
    protected _beActived: boolean = false;
    protected set beActived(value: boolean) { this._beActived = value; this.onStateChange.raiseEvent(value); };
    protected get beActived() { return this._beActived; };

    abstract createEventHandler(): void;
    protected viewer: Cesium.Viewer;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.createEventHandler();
    }

    protected addSamplePoint = (mousePoint: Cesium.Cartesian2) => {
        let pos = samplePoint(this.viewer, mousePoint);
        if (pos != null) {
            let ins = addSampleMarkToScene(this.viewer, pos);
            return { ins, pos }
        }
        return null
    }

    active = () => {
        this.beActived = true;
        this.onStateChange.raiseEvent(this.beActived);
    }
    disActive() {
        this.beActived = false;
        this.onStateChange.raiseEvent(this.beActived);

        if (this.currentMeasure?.state == MeasureStateEnum.SAMPLING) this.currentMeasure.dispose(this.viewer);
        this.currentMeasure = undefined;
    }

    onSampleChange = new Cesium.Event();
    onStateChange = new Cesium.Event();
    onEndMeasure = new Cesium.Event();
}


export function randomChar() {
    var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let randomChar = arr[Math.floor(arr.length * Math.random())];
    return randomChar
}