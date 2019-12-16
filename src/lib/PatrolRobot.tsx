import { Helper } from "./helper";
enum LoopEnum {
    pingpong,
    restart
}
interface ImodelOptions {
    url: string;
    scale?: number;
    pos?: Cesium.Cartesian3;
}
export class PatrolModel {
    private ins: Cesium.Entity;
    private options: {
        ins: Cesium.Entity | ImodelOptions;
        speed: number;
        pointArr: Cesium.Cartesian3[];
        loopType: LoopEnum;
        initRot: Cesium.Quaternion;
    };
    constructor(viewer: Cesium.Viewer, options: {
        ins: Cesium.Entity | ImodelOptions;
        initRot?: Cesium.Quaternion;
        speed: number;
        pointArr: Cesium.Cartesian3[];
        loopType?: LoopEnum;
    }) {
        viewer.frameUpdate.addEventListener(this.loop);
        this.options = { ...options, initRot: options.initRot != null ? options.initRot : Cesium.Quaternion.IDENTITY, loopType: options.loopType != null ? options.loopType : LoopEnum.pingpong };
        if (this.options.ins instanceof Cesium.Entity) {
            this.ins = this.options.ins;
        }
        else {
            let modelOps = this.options.ins as ImodelOptions;
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
        this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.initRot, new Cesium.Quaternion());
        //------------start
        this.active();
    }
    private currentDir: Cesium.Cartesian3;
    private curPos: Cesium.Cartesian3;
    private curPointIndex: number;
    private loop = (deltalTime) => {
        if (!this.beActived)
            return;
        let { pointArr, speed } = this.options;
        let moveDelta = Cesium.Cartesian3.multiplyByScalar(this.currentDir, speed * deltalTime, new Cesium.Cartesian3());
        let newPos = Cesium.Cartesian3.add(this.curPos, moveDelta, new Cesium.Cartesian3());
        let distance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], pointArr[this.curPointIndex + 1]);
        let newdistance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], newPos);
        if (newdistance >= distance) {
            this.curPointIndex++;
            if (this.curPointIndex >= pointArr.length - 1) { //end
                this.curPointIndex = 0;
                if (this.options.loopType == LoopEnum.pingpong) {
                    pointArr.reverse();
                }
            }
            newPos = Cesium.Cartesian3.clone(pointArr[this.curPointIndex]);
            this.currentDir = this.calculateDirection(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            let quat = Helper.calculateOrientation(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.initRot, new Cesium.Quaternion());
        }
        this.ins.position = newPos;
        this.curPos = newPos;
    };
    private beActived: boolean = false;
    active() {
        this.beActived = true;
    }
    disActive() {
        this.beActived = false;
    }
    dispose() { }
    private calculateDirection(nextPosition: Cesium.Cartesian3, position: Cesium.Cartesian3) {
        let dir = Cesium.Cartesian3.subtract(nextPosition, position, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(dir, dir);
        return dir;
    }
}
