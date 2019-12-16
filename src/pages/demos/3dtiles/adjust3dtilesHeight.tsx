import React from "react";
import { CesiumMap } from "../../../lib/map";
import dat from 'dat.gui';
import { Debug } from "../../../lib/debug";


class Options {
    heightAdjust: number = 0;
    rotAngle: number = 0;
}
export default class Adjust3dtilesHeight extends React.Component {
    gui: any;
    private bemount: boolean;
    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"

        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100
        })) as Cesium.Cesium3DTileset;
        viewer.zoomTo(tileset);

        var options = new Options();
        var gui = new dat.GUI();
        this.gui = gui;
        tileset.readyPromise.then((tileset) => {
            if (!this.bemount) return;

            gui.add(options, 'heightAdjust', -50, 50).onChange((value) => {
                // tiles_a.show = value;
                let surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tileset.boundingSphere.center);
                let translationb = Cesium.Cartesian3.multiplyByScalar(surfaceNormal, value, new Cesium.Cartesian3());
                tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translationb);
            });

            // let targetModelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(tileset.boundingSphere.center);
            // let selfToTarget = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(targetModelMatrix, new Cesium.Matrix4()), tileset.modelMatrix, new Cesium.Matrix4());


            // let pos = Cesium.Matrix4.getTranslation(targetModelMatrix, new Cesium.Cartesian3());
            // Debug.addSpriteMark(pos, viewer);

            // gui.add(options, "rotAngle", -360, 360).onChange(value => {
            //     let rotmat = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(value * Math.PI / 180), new Cesium.Cartesian3(0, 0, 0));
            //     let modelMatrix = Cesium.Matrix4.multiply(targetModelMatrix, rotmat, new Cesium.Matrix4());
            //     tileset.modelMatrix = Cesium.Matrix4.multiply(modelMatrix, selfToTarget, new Cesium.Matrix4());
            // });
        })
    }
    componentDidMount() {
        this.bemount = true;
    }

    componentWillUnmount() {
        this.bemount = false;
        if (this.gui) {
            this.gui.destroy();
        }
    }

    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
}


