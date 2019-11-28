import Axios from "axios"
import React from "react";
import { CesiumMap } from "../../lib/map";
import { Helper } from "../../lib/helper";

export class AutoAdjust3dtilesHeight extends React.Component {
    static title: string = "自动调整3dtiles高度贴合地面";

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,

        })) as Cesium.Cesium3DTileset;
        tileset.readyPromise.then((tileset) => {
            //----------------调整高度
            Helper.clamp3dtilesToGround(viewer, tileset, (tilest) => {
                viewer.scene.camera.flyToBoundingSphere(tilest.boundingSphere);
            });
        });
    }

    render() {
        return (
            <CesiumMap id={AutoAdjust3dtilesHeight.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}


