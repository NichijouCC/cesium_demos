import React from "react";
import { CesiumMap } from "@/lib/map";
import { VideoFusion } from "@/lib/videoFusion";
import { Helper } from "@/lib";

export default class VideoFusionDemo extends React.Component {
    state = {
        viewer: null,
        opacity: 0.5,
        pos: new Cesium.Cartesian3(-2862001.0959806717, 4651306.438826122, 3283702.9141938747),
        quat: new Cesium.Quaternion(-0.3554680319936638, 0.3186025875155842, 0.8575975474538291, 0.1914714497258105),
        aspect: 1.7979678238780694,
        editorInfo: { "aspect": 1.7979678238780694, "cameraOffset": 30.00000000036392, "pos": [-2861999.8843600666, 4651308.262380583, 3283701.9702296667], "quat": [-0.35565499986088944, 0.3184325958649666, 0.8574897840777559, 0.19188922108063622], "cameraPositon": [-2861983.216648571, 4651329.969133107, 3283689.681849448], "cameraHeadPithRoll": [1.0240711517455319, -0.06604407712253324, 0.002514721490340044], "cameraFov": 0.8979678238780694 }
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "https://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json",
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));

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


    }

    get videoFusionIns() {
        return this.videoRef;
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
            </React.Fragment>
        )
    }

}
