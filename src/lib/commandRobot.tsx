import { Helper } from "@/lib/helper";
export class CommandRobot {
    private haveInitPos: boolean;
    readonly ins: Cesium.Entity;
    readonly initrot: Cesium.Quaternion;
    constructor(viewer: Cesium.Viewer, url: string, options?: {
        initPos?: Cesium.Cartesian3;
        initRot?: number;
        scale?: number;
    }) {
        this.haveInitPos = options != null && options.initPos != null;
        options = options || {};
        let pos = options.initPos || Cesium.Cartesian3.ZERO;
        let rotAngle = options.initRot != null ? options.initRot : 0;
        let rot = Cesium.Transforms.headingPitchRollQuaternion(pos, new Cesium.HeadingPitchRoll(0, rotAngle * Math.PI / 180));
        this.initrot = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, rotAngle * Math.PI / 180);
        let scale = options.scale || 1.0;
        this.ins = viewer.entities.add({
            position: pos,
            orientation: rot,
            model: {
                uri: url,
                scale: scale
            }
        });
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
        this.ins.orientation = Cesium.Quaternion.multiply(quat, this.initrot, new Cesium.Quaternion());
    }
    /**
     * 发送目标点给机器人
     */
    sendTargetPos(pos: Cesium.Cartesian3) {
        let newPos = {
            pos: pos,
            time: new Date(),
        };
        if (this.lastOrder == null && !this.haveInitPos) {
            this.ins.position = newPos.pos;
        }
        else {
            let duration = this.lastOrder ? newPos.time.getTime() - this.lastOrder.time.getTime() : 1000;
            this._moveToPos(Cesium.Cartesian3.clone(pos), duration);
        }
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
