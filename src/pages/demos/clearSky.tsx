import { CesiumMap } from "@/lib";
import React, { useEffect, useRef } from "react";
import dat from 'dat.gui';

export default function ClearSky() {
    useEffect(() => {
        mapRef.current.setUp({
            orderIndependentTranslucency: false,
            contextOptions: {
                webgl: {
                    alpha: true,
                }
            }
        });
        let { viewer } = mapRef.current;
        viewer.scene.skyBox.show = false;
        viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

        var gui = new dat.GUI();
        const options = { clearMapLayers: false };
        gui.add(options, 'clearMapLayers').onChange((clear) => {
            console.warn("clearMapLayers", clear);
            if (clear) {
                viewer.imageryLayers.get(0).show = false;
                viewer.scene.skyAtmosphere.show = false;
                viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;
            } else {
                viewer.imageryLayers.get(0).show = true;
                viewer.scene.skyAtmosphere.show = true;
                viewer.scene.globe.baseColor = Cesium.Color.BLUE;
            }
        });

        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(17732)
            })
        ) as Cesium.Cesium3DTileset;
        tileset.readyPromise.then(() => {
            viewer.zoomTo(tileset);
        });

        return () => {
            gui.destroy();
        }
    }, []);
    const mapRef = useRef<CesiumMap>();

    return (
        <div className="container" style={{ width: "100%", height: "100%", backgroundImage: "url(./images/center_bg.png)", backgroundColor: "#04172A", backgroundRepeat: "norepeat" }} >
            <CesiumMap ref={mapRef} setUp={false} />
        </div>)
}