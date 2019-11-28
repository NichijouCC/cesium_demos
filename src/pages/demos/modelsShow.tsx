import Axios from "axios"
import React from "react";
import { CesiumMap } from "../../lib/map";
import { Helper } from "../../lib/helper";
import { Debug, PosType } from "../../lib/debug";

export class AislandModelShow extends React.Component {
    static title: string = "模型展示";

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
        })) as Cesium.Cesium3DTileset;
        tileset.readyPromise.then((tileset) => {
            //----------------调整高度
            Helper.clamp3dtilesToGround(viewer, tileset, (tilest) => {
                viewer.scene.camera.flyToBoundingSphere(tilest.boundingSphere, {
                    complete: () => {
                        this.showModels(viewer);
                    }
                });
            });
        });
    }

    showModels(viewer: Cesium.Viewer) {
        Debug.activePick(viewer, PosType.Cartographic_angle);
        this.loadModel(viewer, "./models/aisland/robotM.glb", Cesium.Cartesian3.fromRadians(2.1223943281417106, 0.5443208677930021, 6.1775470701822615));
        this.loadModel(viewer, "./models/aisland/drone.glb", Cesium.Cartesian3.fromRadians(2.1223943281417106, 0.5443208677930021, 16.1775470701822615));
        this.loadModel(viewer, "./models/aisland/shipM.glb", Cesium.Cartesian3.fromRadians(2.1223947358329927, 0.5443187651652112, 6.078191713518405), 0.05);

        // this.loadModel(viewer, "./models/aisland/waterRobot.glb", Cesium.Cartesian3.fromRadians(2.1223930950568626, 0.5443173216645161, 6.92286310017964), 10);
    }
    private loadModel(viewer: Cesium.Viewer, modelUrl: string, pos: Cesium.Cartesian3, scale: number = 1, rotangle: number = 0) {
        viewer.entities.add({
            position: pos,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(pos, new Cesium.HeadingPitchRoll()),
            model: {
                uri: modelUrl,
                scale: scale
            }
        });
    }
    render() {
        return (
            <CesiumMap id={AislandModelShow.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}