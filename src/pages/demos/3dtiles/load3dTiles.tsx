import React from "react";
import { CesiumMap } from "../../../lib/map";

export default class Load3dtiles extends React.Component {

    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = Cesium.IonResource.fromAssetId(17732);
        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: modelPath,
                maximumScreenSpaceError: 0.8,
                maximumNumberOfLoadedTiles: 100,
            })
        ) as Cesium.Cesium3DTileset;

        viewer.zoomTo(tileset);
    }
}