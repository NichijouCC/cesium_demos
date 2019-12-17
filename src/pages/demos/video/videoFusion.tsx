import React from "react";
import { CesiumMap } from "@/lib/map";
import { VideoFusion } from "@/lib/videoFusion";

export default class VideoFusionDemo extends React.Component {
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
        viewer.camera.lookAt(this.state.pos, new Cesium.HeadingPitchRange(0, 0 * Math.PI / 180, 200));

        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
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
            </React.Fragment>
        )
    }

}
