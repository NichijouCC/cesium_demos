import Axios from "axios"
import React from "react";
import { CesiumMap } from "../lib/map";
import { Helper } from "../lib/helper";

export class AutoAdjust3dtilesHeight extends React.Component {
    static title: string = "自动调整3dtiles高度贴合地面";

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"
        Axios.get(modelPath).then((data) => {
            let res = data.data as any;
            var modelSphere = res.root.boundingVolume.sphere;
            const boundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(modelSphere[0], modelSphere[1], modelSphere[2]), modelSphere[3]);//用zyx及R来调用
            return boundingSphere;

        }).then((boundingSphere) => {
            let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url: modelPath,
                maximumScreenSpaceError: 0.8,
                maximumNumberOfLoadedTiles: 100
            })) as Cesium.Cesium3DTileset;
            return { tileset: tileset, boundingSphere: boundingSphere };
        }).then((res) => {
            //----------------调整高度
            Helper.clamp3dtilesToGround(viewer, res.tileset, res.boundingSphere, (tilest) => {
                viewer.zoomTo(tilest);
            });

        }).catch(err => {
            console.error(err);
        });
    }


    render() {
        return (
            <CesiumMap id={AutoAdjust3dtilesHeight.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}


