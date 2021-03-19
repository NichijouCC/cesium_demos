import { VideoFusion } from "@/lib/videoFusion";
import dat from 'dat.gui';
import { Helper } from "@/lib";

export class VideoFusionEditor {
    private readonly viewer: Cesium.Viewer;
    private videoFusion: VideoFusion;
    private gui: any;
    private _cameraOffset: number = 30;
    private beActive: boolean;
    private editorInfo: IvideoEditedInfo;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.viewer.frameUpdate.addEventListener(this.loop);
        this.guiInit();
    }
    private currentPos: Cesium.Cartesian3;
    private currentQuat: Cesium.Quaternion;
    private loop = () => {
        if (this.beActive && this.videoFusion) {
            let camera = this.viewer.camera;
            let offsetDir = Cesium.Cartesian3.multiplyByScalar(camera.directionWC, this._cameraOffset, new Cesium.Cartesian3());
            let targetPos = Cesium.Cartesian3.add(offsetDir, camera.positionWC, new Cesium.Cartesian3());
            let quat = Helper.unitxyzToRotation(camera.rightWC, camera.directionWC, camera.upWC, new Cesium.Quaternion());
            let mat = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(targetPos, quat, new Cesium.Cartesian3(this.videoFusion.aspect * 1, 1, 1)), new Cesium.Matrix4());
            this.videoFusion.modelMatrix = mat;
            this.currentPos = targetPos;
            this.currentQuat = quat;
        }
    };
    attch(videoFusion: VideoFusion) {
        this.videoFusion = videoFusion;
    }
    active() {
        this.beActive = true;
    }
    disactive() {
        this.beActive = false;
    }
    dispose() {
        if (this.gui) {
            this.gui.destroy();
        }
    }

    private guiInit() {
        let viewer = this.viewer;
        let gui = new dat.GUI();
        this.gui = gui;
        let options = new GuiOptions();
        options.fov = viewer.camera.frustum.fov * 180 / Math.PI;
        options.LogVideoInfo = () => {
            let logInfo = {} as IvideoEditedInfo;
            logInfo.aspect = options.aspect;
            // logInfo.cameraOffset = options.camerOffset;
            let pos = Cesium.Matrix4.getTranslation(this.videoFusion.modelMatrix, new Cesium.Cartesian3());
            let rotmat = Cesium.Matrix4.getRotation(this.videoFusion.modelMatrix, new Cesium.Matrix3());
            let quat = Cesium.Quaternion.fromRotationMatrix(rotmat);
            logInfo.pos = [pos.x, pos.y, pos.z];
            // logInfo.pos = getCarArr(this.currentPos);
            logInfo.quat = [quat.x, quat.y, quat.z, quat.w];
            logInfo.cameraPositon = [viewer.camera.positionWC.x, viewer.camera.positionWC.y, viewer.camera.positionWC.z];
            // logInfo.cameraPositon = getCarArr(viewer.camera.positionWC);
            logInfo.cameraHeadPithRoll = [viewer.camera.heading, viewer.camera.pitch, viewer.camera.roll];
            logInfo.cameraFov = options.fov * Math.PI / 180;
            this.editorInfo = logInfo;
            console.warn("videoInfo:", JSON.stringify(logInfo));
        };
        options.loadEditorInfo = () => {
            if (this.editorInfo) {
                viewer.camera.frustum.fov = this.editorInfo.cameraFov;
                viewer.camera.setView({
                    // destination: new Cesium.Cartesian3(this.editorInfo.cameraPositon[0], this.editorInfo.cameraPositon[1], this.editorInfo.cameraPositon[2]),
                    destination: Cesium.Cartesian3.fromRadians(this.editorInfo.cameraPositon[0], this.editorInfo.cameraPositon[1], this.editorInfo.cameraPositon[2]),
                    orientation: {
                        heading: this.editorInfo.cameraHeadPithRoll[0],
                        pitch: this.editorInfo.cameraHeadPithRoll[1],
                        roll: this.editorInfo.cameraHeadPithRoll[2],
                    }
                });
                this.videoFusion.aspect = this.editorInfo.aspect;
                // let pos = new Cesium.Cartesian3(this.editorInfo.pos[0], this.editorInfo.pos[1], this.editorInfo.pos[2]);
                let pos = Cesium.Cartesian3.fromRadians(this.editorInfo.pos[0], this.editorInfo.pos[1], this.editorInfo.pos[2]);
                let quat = new Cesium.Quaternion(this.editorInfo.quat[0], this.editorInfo.quat[1], this.editorInfo.quat[2], this.editorInfo.quat[3]);
                let mat = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(pos, quat, new Cesium.Cartesian3(this.editorInfo.aspect * 1, 1, 1)), new Cesium.Matrix4());
                this.videoFusion.modelMatrix = mat;
            }
            else {
                options.aspect = this.videoFusion.aspect;
                let worldPos = Cesium.Matrix4.getTranslation(this.videoFusion.modelMatrix, new Cesium.Cartesian3());
                let camWorldPos = this.viewer.camera.positionWC;
                options.camerOffset = Cesium.Cartesian3.distance(worldPos, camWorldPos);
                options.fov = this.viewer.camera.frustum.fov * 180 / Math.PI;
            }
        };
        gui.add(options, 'active').onChange((value) => {
            if (value) {
                this.active();
                this.videoFusion.color = Cesium.Color.fromCssColorString(options.color).withAlpha(options.opacity);
                this.videoFusion.aspect = options.aspect;
            }
            else {
                this.disactive();
            }
        });
        gui.add(options, 'opacity', 0, 1.0).onChange((value) => {
            this.videoFusion.color = Cesium.Color.fromCssColorString(options.color).withAlpha(value);
        });
        gui.add(options, 'aspect', 1.0, 3.0).onChange((value) => {
            this.videoFusion.aspect = value;
        });
        gui.addColor(options, "color").onChange(() => {
            this.videoFusion.color = Cesium.Color.fromCssColorString(options.color).withAlpha(options.opacity);
        });
        gui.add(options, 'camerOffset', 0.1, 100.0).onChange((value) => {
            this._cameraOffset = value;
        });
        gui.add(options, "fov", 30, 180).onChange(value => {
            viewer.camera.frustum.fov = value * Math.PI / 180;
        });
        gui.add(options, 'keyBoard');
        gui.add(options, 'LogVideoInfo');
        gui.add(options, 'loadEditorInfo');
        let deltarot = 0.001;
        let deltaMove = 0.01;
        document.onkeypress = (e) => {
            if (!options.keyBoard)
                return;
            // eslint-disable-next-line default-case
            switch (e.key.toLowerCase()) {
                case 'q':
                    viewer.camera.moveUp(deltaMove);
                    break;
                case 'e':
                    viewer.camera.moveDown(deltaMove);
                    break;
                case 'a':
                    viewer.camera.moveLeft(deltaMove);
                    break;
                case 'd':
                    viewer.camera.moveRight(deltaMove);
                    break;
                case 'w':
                    viewer.camera.moveForward(deltaMove);
                    break;
                case 's':
                    viewer.camera.moveBackward(deltaMove);
                    break;
                case "z":
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading + deltarot,
                            pitch: viewer.camera.pitch,
                            roll: viewer.camera.roll // default value
                        }
                    });
                    break;
                case 'x':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading - deltarot,
                            pitch: viewer.camera.pitch,
                            roll: viewer.camera.roll // default value
                        }
                    });
                    break;
                case 'c':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading,
                            pitch: viewer.camera.pitch + deltarot,
                            roll: viewer.camera.roll // default value
                        }
                    });
                    break;
                case 'v':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading,
                            pitch: viewer.camera.pitch - deltarot,
                            roll: viewer.camera.roll // default value
                        }
                    });
                    break;
            }
        };
    }
}

class GuiOptions {
    active: boolean = false;
    opacity: number = 0.5;
    aspect: number = 1.3;
    camerOffset: number = 0.1;
    color: string = "#ffae23";
    keyBoard: boolean = true;
    fov: number = 50;
    LogVideoInfo: () => void = null;
    loadEditorInfo: () => void = null;
}
export interface IvideoEditedInfo {
    aspect: number;
    // cameraOffset: number;
    pos: number[];
    quat: number[];
    cameraPositon: number[];
    cameraHeadPithRoll: number[];
    cameraFov: number;
}

function getCarArr(pos: Cesium.Cartesian3) {
    let poscar = Cesium.Cartographic.fromCartesian(pos);
    return [poscar.longitude, poscar.latitude, poscar.height]
}
