import Axios from "axios"
import React from "react";
import { CesiumMap } from "../../lib/map";
import { Helper } from "../../lib/helper";

export default class AutoAdjust3dtilesHeight extends React.Component {

    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }
    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,

        })) as Cesium.Cesium3DTileset;
        tileset.readyPromise.then((tileset) => {
            if (!this._beMount) return;
            //----------------调整高度
            Helper.clamp3dtilesToGround(viewer, tileset, (tilest) => {
                viewer.scene.camera.flyToBoundingSphere(tilest.boundingSphere);
            });
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


