import React from "react";
import { CesiumMap } from "../../lib/map";

export default class Load3dtiles extends React.Component {

    componentDidMount() {
        CesiumMap.addEventlistenerToMapLoaded((map) => {
            this.handleViewerLoaded(map.viewer);
        });
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
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
        return null;
    }
}