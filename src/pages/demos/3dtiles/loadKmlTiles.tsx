import React from "react";
import { CesiumMap } from "@/lib";
import { loadKmlTiles } from "@/lib/loadKMLTilesInfo";

export default function LoadKmlTiles() {
    const handleViewerLoaded = (viewer) => {
        loadKmlTiles("xxx地址").then(tileinfo => {
            const { resourcesUrl, orthoRect } = tileinfo;
            const level = 20;
            const mapper = new Cesium.TileMapServiceImageryProvider({
                url: resourcesUrl,
                fileExtension: 'png',
                maximumLevel: level,
                minimumLevel: 0,
                rectangle: orthoRect,
            });
            viewer.imageryLayers.addImageryProvider(mapper);

            viewer.camera.flyTo({
                destination: orthoRect
            });
        })
    }
    return (
        <CesiumMap onViewerLoaded={handleViewerLoaded} />
    )
}

