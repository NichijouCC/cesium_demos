import React, { useEffect, useRef } from "react";
import { CesiumMap } from "@/lib";
import { loadKmlTiles } from "@/lib/loadKMLTilesInfo";

export default function LoadKmlTiles() {
    const ref = useRef(true);
    useEffect(() => {
        return () => ref.current = false;
    }, [])

    const handleViewerLoaded = (viewer: Cesium.Viewer) => {
        let url = "https://cloud-v3-oss.oss-cn-shanghai.aliyuncs.com/app_ortho/1112/resultPix4d/result4d_mosaic.kml";
        loadKmlTiles(url)
            .then(tileInfo => {
                if (ref.current == false) return;
                const { resourcesUrl, orthoRect } = tileInfo;
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
        <CesiumMap id={"LoadKmlTiles"} onViewerLoaded={handleViewerLoaded} />
    )
}

