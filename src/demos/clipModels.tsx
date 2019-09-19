import React from "react";
import { CesiumMap } from "../lib/map";
import { Adjust3dtilesHeight } from "./adjust3dtilesHeight";
import dat from 'dat.gui'
class Options {
    width: number = 10
}
export class ClipModels extends React.Component {
    static title: string = "模型裁剪"
    render() {
        return (
            <CesiumMap id={Adjust3dtilesHeight.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
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
        gui.add(ops, "width", 0, 1000).onChange((value) => {
            for (let i = 0; i < clippingPlanes.length; i++) {
                clippingPlanes.get(i).distance = value;
            }
        });
    }
}