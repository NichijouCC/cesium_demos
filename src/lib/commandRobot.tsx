import { Helper } from "./helper";
import { ImodelOptions } from "./patrolRobot";
/**
 * --------------------------------------------------------------------------------
 *              传递entity实例的方式使用
 * --------------------------------------------------------------------------------
 * let robot=new CommandRobot(viewer,entityIns)
 * robot.sendTargetPos(xxpos);
 * 
 * 
 * ----------------------------------------------------------------------------
 *              传递entity gltf url的方式使用
 * ------------------------------------------------------------------------------
 * let robot=new CommandRobot(viewer,{url:xxx,pos:xxx,scale:xxx})
 * robot.sendTargetPos(xxpos);
 * 
 */
export class CommandRobot {
    readonly ins: Cesium.Entity;
    readonly adjustRot: Cesium.Quaternion;
    /**
     * 
     * @param viewer 
     * @param ins 
     * @param adjustRotAngle 角度
     */
    constructor(viewer: Cesium.Viewer, ins: Cesium.Entity | ImodelOptions, adjustRotAngle?: number) {
        if (ins instanceof Cesium.Entity) {
            this.ins = ins;
        } else {
            let modelOps = ins as ImodelOptions;
            this.ins = viewer.entities.add({
                position: modelOps.pos ? modelOps.pos : Cesium.Cartesian3.ZERO,
                model: {
                    uri: modelOps.url,
                    scale: modelOps.scale != null ? modelOps.scale : 1.0
                }
            });
        }
        this.adjustRot = adjustRotAngle != null ? Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, adjustRotAngle * Math.PI / 180) : Cesium.Quaternion.IDENTITY;
        viewer.frameUpdate.addEventListener(this.loop.bind(this));
        this.dispose = () => {
            viewer.frameUpdate.removeEventListener(this.loop.bind(this));
        };
    }
    private lastOrder: IposInfo;
    //--------------target parameters
    private beActive: boolean = false;
    private startPos: Cesium.Cartesian3;
    private targetPos: Cesium.Cartesian3;
    private duration: number; //毫秒
    private costTime: number = 0;
    private _moveToPos(targetPos: Cesium.Cartesian3, duration: number) {
        this.startPos = this.ins.position.getValue(Cesium.JulianDate.now());
        this.targetPos = targetPos;
        this.duration = duration;
        this.beActive = true;
        this.costTime = 0;
        //-----------rot
        let quat = Helper.calculateOrientation(this.targetPos, this.startPos);
        this.ins.orientation = Cesium.Quaternion.multiply(quat, this.adjustRot, new Cesium.Quaternion());
    }
    /**
     * 发送目标点给机器人
     */
    sendTargetPos(pos: Cesium.Cartesian3) {
        let newPos = {
            pos: pos,
            time: new Date(),
        };
        let duration = this.lastOrder ? newPos.time.getTime() - this.lastOrder.time.getTime() : 1000;
        this._moveToPos(Cesium.Cartesian3.clone(pos), duration);

        this.lastOrder = newPos;
    }
    private loop(deltTime: number) {
        if (this.beActive) {
            this.costTime += deltTime;
            let lerp = Math.min(this.costTime / this.duration, 1.0);
            let pos = Cesium.Cartesian3.lerp(this.startPos, this.targetPos, lerp, new Cesium.Cartesian3());
            this.ins.position = pos;
            if (lerp == 1.0) {
                this.beActive = false;
            }
        }
    }
    dispose() { }
}
interface IposInfo {
    pos: Cesium.Cartesian3;
    time: Date;
}
