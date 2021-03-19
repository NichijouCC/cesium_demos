import React from "react";
import { CesiumMap } from "../../../lib/map";
import path from "@public/json/shipPath.json";
import { PatrolModel } from "../../../lib/patrolRobot";

export default class AIPatrol extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let degreeArr = [];
        let allPos = path.data;
        for (let i = 0; i < allPos.length; i++) {
            let item = allPos[i];
            degreeArr.push(parseFloat(item.longitude) * Math.PI / 180);
            degreeArr.push(parseFloat(item.latitude) * Math.PI / 180);
            degreeArr.push(2);
        }
        let pointArr = Cesium.Cartesian3.fromRadiansArrayHeights(degreeArr);

        new PatrolModel(viewer, { url: "./models/cesium_Air.glb", scale: 2.5 }, { speed: 0.1, pointArr: pointArr });

        let boundingSphere = Cesium.BoundingSphere.fromPoints(pointArr)
        viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(boundingSphere.center, boundingSphere.radius * 2));
    }
}


