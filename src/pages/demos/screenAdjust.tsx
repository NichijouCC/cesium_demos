import React from "react";
import { CesiumMap } from "@/lib";
import { ScreenAdjust } from "@/lib/screenAdjust";
import dat from 'dat.gui';

export default class ScreenAdjustDemo extends React.Component {
    gui: any;
    private _beMount: boolean;
    private handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));
        viewer.zoomTo(tileset);
        tileset.readyPromise.then((tileset) => {
            if (!this._beMount) return;
            let surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tileset.boundingSphere.center);
            let translationb = Cesium.Cartesian3.multiplyByScalar(surfaceNormal, -25, new Cesium.Cartesian3());
            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translationb);
        });
        this.adjustScreen(viewer);
    }

    private adjustScreen(viewer: Cesium.Viewer) {
        let onchangeOption = () => {
            ScreenAdjust.set(viewer, options);//调整屏幕色调
        }

        let gui = new dat.GUI();
        this.gui = gui;
        let options = new ScreenOptions();
        gui.add(options, "brightness", 0.1, 3.0).onChange(onchangeOption)
        gui.add(options, "saturation", 0.1, 3.0).onChange(onchangeOption)
        gui.add(options, "contrast", 0.1, 3.0).onChange(onchangeOption)
    }

    componentDidMount() {
        this._beMount = true;
    }
    componentWillUnmount() {
        if (this.gui) {
            this.gui.destroy();
        }
        this._beMount = false;
    }

    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
}

class ScreenOptions {
    brightness: number = 1.6;
    saturation: number = 1.9;
    contrast: number = 1.0;
}