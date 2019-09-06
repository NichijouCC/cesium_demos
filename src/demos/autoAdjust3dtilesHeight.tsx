import Axios from "axios"
import React from "react";
import { CesiumMap } from "../lib/map";
import { pickLowestPostion } from "../lib/helper";

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
            viewer.zoomTo(tileset);

            //----------------调整高度
            let checked = false;
            tileset.allTilesLoaded.addEventListener(() => {
                if (!checked) {
                    checked = true;
                    let lowestheight = pickLowestPostion(viewer, boundingSphere);
                    let surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(boundingSphere.center);
                    let translationb = Cesium.Cartesian3.multiplyByScalar(surfaceNormal, -lowestheight, new Cesium.Cartesian3());
                    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translationb);
                    viewer.zoomTo(tileset);
                }
            });
        });
    }
    render() {
        return (
            <CesiumMap id={AutoAdjust3dtilesHeight.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}


