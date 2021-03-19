import React from "react";
import { CesiumMap } from "../../../lib/map";

export default class LoadKml extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        let options = {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas as any,
            clampToGround: true //开启贴地
        };
        let kml = viewer.dataSources.add(Cesium.KmlDataSource.load('./kml/love.kml', options));
        viewer.flyTo(kml);
    }
}