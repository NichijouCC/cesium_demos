import React from "react";
import { CesiumMap } from "@/lib";
import { PointMeasureComp } from "@/lib/components/pointMeasureComp";

export default class PointMeasureDemo extends React.Component {
    state = {
        viewer: null
    }
    render() {
        return (
            <React.Fragment>
                <CesiumMap onViewerLoaded={(viewer) => {
                    this.setState({ viewer });
                    this.handleViewerLoaded(viewer);
                }} />
                {
                    this.state.viewer ? <PointMeasureComp viewer={this.state.viewer} /> : null
                }
            </React.Fragment>
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
