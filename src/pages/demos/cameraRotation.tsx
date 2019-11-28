import React from "react";
import { CesiumMap } from "../../lib/map";


export class CameraRot extends React.Component {
    static title: string = "地球自旋转"
    speed: number = 0.001;

    handleViewerLoaded(viewer: Cesium.Viewer) {
        viewer.frameUpdate.addEventListener((deltaTime) => {
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, deltaTime * this.speed);
        });
    }
    render() {
        return (
            <CesiumMap id={CameraRot.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}