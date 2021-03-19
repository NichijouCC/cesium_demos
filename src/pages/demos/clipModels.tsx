import React from "react";
import { CesiumMap } from "../../lib/map";
import dat from 'dat.gui'
class Options {
    width: number = 10
}
export default class ClipModels extends React.Component {
    private _gui: any;
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }


    handleViewerLoaded(viewer: Cesium.Viewer) {
        let clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: [
                new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), 10.0),
                new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), 10.0),
                new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), 10.0),
                new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), 10.0),
            ],
            unionClippingRegions: true,
            edgeWidth: 1.0
        });

        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(17732),
                maximumScreenSpaceError: 0.8,
                maximumNumberOfLoadedTiles: 100,
                clippingPlanes: clippingPlanes
            })
        ) as Cesium.Cesium3DTileset;
        viewer.zoomTo(tileset);


        let ops = new Options();
        let gui = new dat.GUI();
        this._gui = gui;
        gui.add(ops, "width", 0, 1000).onChange((value) => {
            for (let i = 0; i < clippingPlanes.length; i++) {
                clippingPlanes.get(i).distance = value;
            }
        });
    }
    componentWillUnmount() {
        this._gui?.destroy();
    }
}