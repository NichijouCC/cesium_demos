import { Helper } from "./helper";
import { IModelOptions } from "./patrolRobot";
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
    readonly activeLerpRotation: boolean;
    private viewer: Cesium.Viewer;
    /**
     * 
     * @param viewer 
     * @param ins 
     * @param options.adjustRotAngle 模型本身旋转修正
     * @param options.activeLerpRotation 目标旋转之间是否进行旋转插值; 默认：true
     */
    constructor(viewer: Cesium.Viewer, ins: Cesium.Entity | IModelOptions,
        options: {
            adjustRotAngle?: number,
            activeLerpRotation?: boolean,
        } = {}) {
        let { adjustRotAngle, activeLerpRotation } = options;

        if (ins instanceof Cesium.Entity) {
            this.ins = ins;
        } else {
            let modelOps = ins as IModelOptions;
            this.ins = viewer.entities.add({
                position: modelOps.pos ? modelOps.pos : Cesium.Cartesian3.ZERO,
                model: {
                    uri: modelOps.url,
                    scale: modelOps.scale != null ? modelOps.scale : 1.0
                }
            });
        }
        this.activeLerpRotation = activeLerpRotation ?? true;
        this.adjustRot = adjustRotAngle != null ? Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, adjustRotAngle * Math.PI / 180) : Cesium.Quaternion.IDENTITY;
        viewer.frameUpdate.addEventListener(this.update.bind(this));
        this.dispose = () => {
            viewer.frameUpdate.removeEventListener(this.update.bind(this));
        };
        this.viewer = viewer;
    }
    private lastOrder: IPosInfo;
    //--------------target parameters
    private beActive: boolean = false;
    private startPos: Cesium.Cartesian3;
    private targetPos: Cesium.Cartesian3;
    private startRot: Cesium.Quaternion;
    private targetRot: Cesium.Quaternion;
    private duration: number; //毫秒
    private costTime: number = 0;
    private _moveToPos(options: { targetPos: Cesium.Cartesian3, headingPitchRoll?: Cesium.HeadingPitchRoll, duration: number }) {
        let { targetPos, duration, headingPitchRoll } = options;

        this.startPos = this.ins.position.getValue(Cesium.JulianDate.now());
        this.targetPos = targetPos;
        this.duration = duration;
        this.beActive = true;
        this.costTime = 0;
        //-----------rot

        let targetRot;
        if (headingPitchRoll != null) {
            let quat = Cesium.Transforms.headingPitchRollQuaternion(targetPos, headingPitchRoll);
            targetRot = Cesium.Quaternion.multiply(quat, this.adjustRot, new Cesium.Quaternion());
        } else {
            if (!Cesium.Cartesian3.equals(this.targetPos, this.startPos)) {
                let quat = Helper.calculateOrientation(this.targetPos, this.startPos);
                targetRot = Cesium.Quaternion.multiply(quat, this.adjustRot, new Cesium.Quaternion());
            }
        }

        if (this.activeLerpRotation) {
            this.targetRot = targetRot;
            if (this.ins.orientation) {
                this.startRot = ((this.ins.orientation as Cesium.Property).getValue(Cesium.JulianDate.now()) as Cesium.Quaternion).clone();
            } else {
                this.startRot = targetRot?.clone();
            }
        } else {
            if (targetRot) this.ins.orientation = targetRot;
        }
    }
    /**
     * 发送目标点给机器人
     */
    sendTargetPos(options: { pos: Cesium.Cartesian3, headingPitchRoll?: Cesium.HeadingPitchRoll }) {
        let { pos, headingPitchRoll } = options;
        let nextPos = pos;

        let newPos = {
            pos: nextPos,
            time: new Date(),
        };
        if (this.lastOrder == null) {
            this.ins.position = nextPos;
        } else {
            let duration = newPos.time.getTime() - this.lastOrder.time.getTime();
            this._moveToPos({ duration, targetPos: Cesium.Cartesian3.clone(nextPos), headingPitchRoll });
        }
        this.lastOrder = newPos;
    }

    onChangeTransform: Cesium.Event = new Cesium.Event();
    private update(deltTime: number) {
        if (this.beActive) {
            this.costTime += deltTime;
            let lerp = Math.min(this.costTime / this.duration, 1.0);
            let pos = Cesium.Cartesian3.lerp(this.startPos, this.targetPos, lerp, new Cesium.Cartesian3());
            this.ins.position = pos;
            if (this.activeLerpRotation && this.startRot && this.targetRot) {
                this.ins.orientation = Cesium.Quaternion.slerp(this.startRot, this.targetRot, lerp, new Cesium.Quaternion());
            }
            this.onChangeTransform.raiseEvent(pos);
            if (lerp == 1.0) {
                this.beActive = false;
            }
        }
    }
    dispose() { }
}
interface IPosInfo {
    pos: Cesium.Cartesian3;
    time: Date;
}
