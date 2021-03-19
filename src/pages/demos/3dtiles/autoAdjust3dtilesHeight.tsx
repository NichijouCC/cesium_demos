import React from "react";
import { CesiumMap } from "../../../lib/map";
import { Helper } from "../../../lib/helper";

export default class AutoAdjust3dtilesHeight extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = Cesium.IonResource.fromAssetId(17732);
        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: modelPath,
                maximumScreenSpaceError: 0.8,
                maximumNumberOfLoadedTiles: 100,
            })
        ) as Cesium.Cesium3DTileset;

        tileset.readyPromise.then((tileset) => {
            if (!this._beMount) return;
            //抬高100m, 注意:因为用的官方资源是贴地的，所以先抬高100m，再用贴地方法进行贴地
            let surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tileset.boundingSphere.center);
            let translation = Cesium.Cartesian3.multiplyByScalar(surfaceNormal, 100, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            viewer.zoomTo(tileset);
        });

        //------------进行贴地
        Helper.clamp3dtilesToGround(viewer, tileset)
            .then((tilest) => {
                viewer.scene.camera.flyToBoundingSphere(tilest.boundingSphere);
            });
    }
    private _beMount: boolean = false;
    componentDidMount() {
        this._beMount = true;
    }
    componentWillUnmount() {
        this._beMount = false;
    }
}


