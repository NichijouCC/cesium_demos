import React from "react";
import { CesiumMap } from "../../../lib/map";
import dat from 'dat.gui';


class Options {
    heightAdjust: number = 0;
    rotAngle: number = 0;
}
export default class Adjust3dtilesHeight extends React.Component {
    private _gui: any;
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
    private _beMount: boolean = false;
    componentDidMount() {
        this._beMount = true;
    }
    componentWillUnmount() {
        this._beMount = false;
        this._gui?.destroy();
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

        var options = new Options();
        var gui = new dat.GUI();
        this._gui = gui;
        tileset.readyPromise.then((tileset) => {
            if (!this._beMount) return;
            gui.add(options, 'heightAdjust', -50, 50).onChange((value) => {
                // tiles_a.show = value;
                let surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tileset.boundingSphere.center);
                let translation = Cesium.Cartesian3.multiplyByScalar(surfaceNormal, value, new Cesium.Cartesian3());
                tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            });

            viewer.zoomTo(tileset);
        })
    }


}


