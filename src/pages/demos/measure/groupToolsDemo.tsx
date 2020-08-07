import React from "react";
import { CesiumMap } from "@/lib";
import GroupMeasureComp from "@/lib/components/measureTools/groupMeasureComp";

export default class GroupToolsDemo extends React.Component {

    state = {
        viewer: null
    }

    render() {
        return (
            <CesiumMap onViewerLoaded={(viewer) => {
                this.setState({ viewer });
                this.handleViewerLoaded(viewer);
            }} >
                {
                    this.state.viewer ? <GroupMeasureComp viewer={this.state.viewer} /> : null
                }
            </CesiumMap>
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