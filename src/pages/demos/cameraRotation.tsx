import React from "react";
import { CesiumMap } from "../../lib/map";


export default class CameraRot extends React.Component {
    speed: number = 0.001;
    handleViewerLoaded(viewer: Cesium.Viewer) {
        let loop = (deltaTime) => {
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, deltaTime * this.speed);
        }
        viewer.frameUpdate.addEventListener(loop);
    }
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
}