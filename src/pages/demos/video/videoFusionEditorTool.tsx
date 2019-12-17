import React from "react";
import { VideoFusion } from "@/lib/videoFusion";
import dat from 'dat.gui';
import { Helper, CesiumMap } from "@/lib";

export default class VideoFusionEditorToolDemo extends React.Component {
    state = {
        viewer: null,
        opacity: 0.5,
        pos: Cesium.Cartesian3.fromDegrees(121, 31, 100),
        quat: null,
    }
    componentWillMount() {
        let mat = Cesium.Transforms.headingPitchRollToFixedFrame(this.state.pos, new Cesium.HeadingPitchRoll());
        let rotMat = Cesium.Matrix4.getRotation(mat, new Cesium.Matrix3());
        let quat = Cesium.Quaternion.fromRotationMatrix(rotMat);
        this.setState({ quat });
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json",
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));
        viewer.zoomTo(tileset);

        // viewer.camera.lookAt(this.state.pos, new Cesium.HeadingPitchRange(0, 0 * Math.PI / 180, 200));
        // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

        setTimeout(() => {
            let editor = new VideoFusionEditor(viewer);
            editor.attch(this.videoFusionIns);
        }, 1000);
    }
    get videoFusionIns() {
        return this.refs.VideoFusion as VideoFusion;
    }
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ?
                        <VideoFusion ref="VideoFusion" postion={this.state.pos} quat={this.state.quat} url={"./videos/videoFusion.mp4"} viewer={this.state.viewer} /> : null
                }
                <div style={{ position: "absolute", top: "250px", right: "30px", zIndex: 99, backgroundColor: "#dd4f" }}>
                    <div>==gui介绍==</div>
                    <div>active：是否激活视频融合编辑工具</div>
                    <div>opacity：调整video透明度</div>
                    <div>apset：视屏宽高比</div>
                    <div>color：视屏染色</div>
                    <div>cameraOffset：和相机举例调整</div>
                    <div>keyboard：使用(awsd,zxcv)对摄像头位置进行微调</div>
                    <div>==操作介绍==</div>
                    <div>1.粗略调整相机视角到视频在3d场景中的视角</div>
                    <div>2.调整 opacity,color,offset等参数方便后续融合</div>
                    <div>3.再次使用cesium默认视角调整工具粗略调整视角</div>
                    <div>4.使用键盘对视角进行微调</div>
                </div>
            </React.Fragment>
        )
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
}


export class VideoFusionEditor {
    private readonly viewer: Cesium.Viewer;
    private videoFusion: VideoFusion;

    private gui: any;
    private _camerOffset: number = 30;
    beActive: boolean;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.viewer.frameUpdate.addEventListener(this.loop);

        let gui = new dat.GUI();
        this.gui = gui;
        let options = new GuiOptions();
        options.fov = viewer.camera.frustum.fov * 180 / Math.PI;
        options.LogVideoInfo = () => {
            let logInfo = {} as any;
            logInfo.aspect = options.aspect;
            logInfo.cameraOffset = options.camerOffset;
            logInfo.pos = this.currentPos;
            logInfo.quat = this.currentQuat;

            let position = Cesium.Cartesian3.clone(viewer.camera.positionWC, new Cesium.Cartesian3());
            let arr = [viewer.camera.heading, viewer.camera.pitch, viewer.camera.roll]
            logInfo.cameraPositon = position;
            logInfo.cameraHeadPithRoll = arr;
            logInfo.cameraFov = options.fov;
            console.warn("videoInfo:", logInfo);
        }
        gui.add(options, 'active').onChange((value) => {
            if (value) {
                this.active();
                this.videoFusion.setColor(Cesium.Color.fromCssColorString(options.color).withAlpha(options.opacity));
                this.videoFusion.setAspect(options.aspect);
            } else {
                this.disactive();
            }
        });
        gui.add(options, 'opacity', 0, 1.0).onChange((value) => {
            this.videoFusion.setColor(Cesium.Color.fromCssColorString(options.color).withAlpha(value));
        });
        gui.add(options, 'aspect', 1.0, 3.0).onChange((value) => {
            this.videoFusion.setAspect(value);
        });
        gui.addColor(options, "color");
        gui.add(options, 'camerOffset', 0.1, 100.0).onChange((value) => {
            this._camerOffset = value;
        });

        gui.add(options, "fov", 30, 180).onChange(value => {
            viewer.camera.frustum.fov = value * Math.PI / 180;
        })
        gui.add(options, 'keyBoard');
        gui.add(options, 'LogVideoInfo');

        let deltarot = 0.001;
        let deltaMove = 0.01;
        document.onkeypress = (e) => {
            if (!options.keyBoard) return;
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
                            heading: viewer.camera.heading + deltarot, // east, default value is 0.0 (north)
                            pitch: viewer.camera.pitch,    // default value (looking down)
                            roll: viewer.camera.roll                           // default value
                        }
                    });
                    break;
                case 'x':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading - deltarot, // east, default value is 0.0 (north)
                            pitch: viewer.camera.pitch,    // default value (looking down)
                            roll: viewer.camera.roll                           // default value
                        }
                    });
                    break;
                case 'c':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading, // east, default value is 0.0 (north)
                            pitch: viewer.camera.pitch + deltarot,    // default value (looking down)
                            roll: viewer.camera.roll                           // default value
                        }
                    });
                    break;
                case 'v':
                    viewer.camera.setView({
                        orientation: {
                            heading: viewer.camera.heading, // east, default value is 0.0 (north)
                            pitch: viewer.camera.pitch - deltarot,    // default value (looking down)
                            roll: viewer.camera.roll                          // default value
                        }
                    });
                    break;
            }
        }
    }

    private currentPos: Cesium.Cartesian3;
    private currentQuat: Cesium.Quaternion;
    private loop = () => {
        if (this.beActive && this.videoFusion) {
            let camera = this.viewer.camera;
            let offsetdir = Cesium.Cartesian3.multiplyByScalar(camera.directionWC, this._camerOffset, new Cesium.Cartesian3());
            let targetpos = Cesium.Cartesian3.add(offsetdir, camera.positionWC, new Cesium.Cartesian3());
            let quat = Helper.unitxyzToRotation(camera.rightWC, camera.directionWC, camera.upWC, new Cesium.Quaternion());

            let mat = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(targetpos, quat, new Cesium.Cartesian3(this.videoFusion.aspect * 1, 1, 1)), new Cesium.Matrix4());
            this.videoFusion.setModelMatrix(mat);

            this.currentPos = targetpos;
            this.currentQuat = quat;
        }
    }

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

}