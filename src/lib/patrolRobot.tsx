import { Helper } from "./helper";
export interface IModelOptions {
    url: string;
    scale?: number;
    pos?: Cesium.Cartesian3;
    rot?: Cesium.Quaternion;
}
export class PatrolModel {
    private ins: Cesium.Entity;
    private options: {
        speed: number;
        pointArr: Cesium.Cartesian3[];
        loopType: "pingpong" | "restart";
        adjustRot: Cesium.Quaternion;
    };
    constructor(viewer: Cesium.Viewer, ins: Cesium.Entity | IModelOptions, options: {
        adjustRot?: Cesium.Quaternion;
        speed: number;
        pointArr: Cesium.Cartesian3[];
        loopType?: "pingpong" | "restart";
    }) {
        viewer.frameUpdate.addEventListener(this.loop);
        this.options = { ...options, adjustRot: options.adjustRot != null ? options.adjustRot : Cesium.Quaternion.IDENTITY, loopType: options.loopType != null ? options.loopType : "pingpong" };
        if (ins instanceof Cesium.Entity) {
            this.ins = ins;
        }
        else {
            let modelOps = ins as IModelOptions;
            this.ins = viewer.entities.add({
                position: modelOps.pos ? modelOps.pos : Cesium.Cartesian3.ZERO,
                orientation: Cesium.Quaternion.IDENTITY,
                model: {
                    uri: modelOps.url,
                    scale: modelOps.scale != null ? modelOps.scale : 1.0
                }
            });
        }
        this.dispose = () => {
            viewer.frameUpdate.removeEventListener(this.loop);
        };
        //----------------init
        this.currentDir = this.calculateDirection(options.pointArr[1], options.pointArr[0]);
        this.curPointIndex = 0;
        this.curPos = Cesium.Cartesian3.clone(options.pointArr[0]);
        let quat = Helper.calculateOrientation(options.pointArr[this.curPointIndex + 1], options.pointArr[this.curPointIndex]);
        this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.adjustRot, new Cesium.Quaternion());
        //------------start
        this.active();
    }
    private currentDir: Cesium.Cartesian3;
    private curPos: Cesium.Cartesian3;
    private curPointIndex: number;
    private loop = (deltaTime) => {
        if (!this.beActive)
            return;
        let { pointArr, speed } = this.options;
        let moveDelta = Cesium.Cartesian3.multiplyByScalar(this.currentDir, speed * deltaTime, new Cesium.Cartesian3());
        let newPos = Cesium.Cartesian3.add(this.curPos, moveDelta, new Cesium.Cartesian3());
        let distance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], pointArr[this.curPointIndex + 1]);
        let newDistance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], newPos);
        if (newDistance >= distance) {
            this.curPointIndex++;
            if (this.curPointIndex >= pointArr.length - 1) { //end
                this.curPointIndex = 0;
                if (this.options.loopType == "pingpong") {
                    pointArr.reverse();
                }
            }
            newPos = Cesium.Cartesian3.clone(pointArr[this.curPointIndex]);
            this.currentDir = this.calculateDirection(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            let quat = Helper.calculateOrientation(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.adjustRot, new Cesium.Quaternion());
        }
        this.ins.position = newPos;
        this.curPos = newPos;
    };
    private beActive: boolean = false;
    active() {
        this.beActive = true;
    }
    disActive() {
        this.beActive = false;
    }
    dispose() { };
    private calculateDirection(nextPosition: Cesium.Cartesian3, position: Cesium.Cartesian3) {
        let dir = Cesium.Cartesian3.subtract(nextPosition, position, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(dir, dir);
        return dir;
    }
}
