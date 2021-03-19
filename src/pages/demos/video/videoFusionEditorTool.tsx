import React from "react";
import { VideoFusion } from "@/lib/videoFusion";
import { CesiumMap } from "@/lib";
import { VideoFusionEditor } from "../../../lib/VideoFusionEditor";

export default class VideoFusionEditorToolDemo extends React.Component {
    state = {
        viewer: null,
        opacity: 0.5,
        pos: new Cesium.Cartesian3(-2862001.0959806717, 4651306.438826122, 3283702.9141938747),
        quat: new Cesium.Quaternion(-0.3554680319936638, 0.3186025875155842, 0.8575975474538291, 0.1914714497258105),
        aspect: 1.7979678238780694,
        editorInfo: { "aspect": 1.7979678238780694, "cameraOffset": 30.00000000036392, "pos": [-2861999.8843600666, 4651308.262380583, 3283701.9702296667], "quat": [-0.35565499986088944, 0.3184325958649666, 0.8574897840777559, 0.19188922108063622], "cameraPositon": [-2861983.216648571, 4651329.969133107, 3283689.681849448], "cameraHeadPithRoll": [1.0240711517455319, -0.06604407712253324, 0.002514721490340044], "cameraFov": 0.8979678238780694 }
    }
    editor: VideoFusionEditor;

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "https://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json",
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));
        // viewer.zoomTo(tileset);
        let editorInfo = this.state.editorInfo;
        viewer.camera.frustum.fov = editorInfo.cameraFov;
        viewer.camera.setView({
            destination: new Cesium.Cartesian3(editorInfo.cameraPositon[0], editorInfo.cameraPositon[1], editorInfo.cameraPositon[2]),
            // destination: Cesium.Cartesian3.fromRadians(editorInfo.cameraPositon[0], editorInfo.cameraPositon[1], editorInfo.cameraPositon[2]),
            orientation: {
                heading: editorInfo.cameraHeadPithRoll[0],
                pitch: editorInfo.cameraHeadPithRoll[1],
                roll: editorInfo.cameraHeadPithRoll[2],
            }
        });
        setTimeout(() => {
            let editor = new VideoFusionEditor(viewer);
            editor.attch(this.videoFusionIns);
            this.editor = editor;
        }, 1000);
    }

    componentWillUnmount() {
        this.editor.dispose();
    }

    get videoFusionIns() {
        return this.videoRef.current;
    }
    private videoRef = React.createRef<VideoFusion>();

    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ?
                        <VideoFusion ref={this.videoRef} editorInfo={this.state.editorInfo} aspect={this.state.aspect} position={this.state.pos} quat={this.state.quat} url={"./videos/videoFusion.mp4"} viewer={this.state.viewer} /> : null
                }
                <div style={{ position: "absolute", top: "350px", right: "30px", zIndex: 99, backgroundColor: "#dd4f" }}>
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


