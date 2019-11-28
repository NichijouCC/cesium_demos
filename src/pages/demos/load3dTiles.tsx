import React from "react";
import { CesiumMap } from "../../lib/map";

export class Load3dtiles extends React.Component {

    static title: string = "加载3dtiles";

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"

        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));
        viewer.zoomTo(tileset);
    }
    render() {
        return (
            <CesiumMap id={Load3dtiles.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}