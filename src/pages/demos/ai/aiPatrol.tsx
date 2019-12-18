import React from "react";
import { CesiumMap } from "../../../lib/map";
// import path from "../../../public/json/shipPath.json";
import path from "@public/json/shipPath.json";
import { PatrolModel } from "../../../lib/patrolRobot";

// import path from "./shipPath.json"

export default class AIPatrol extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let degreeArr = [];
        let allpos = path.data;
        for (let i = 0; i < allpos.length; i++) {
            let item = allpos[i];
            degreeArr.push(parseFloat(item.longitude) * Math.PI / 180);
            degreeArr.push(parseFloat(item.latitude) * Math.PI / 180);
            degreeArr.push(2);
        }
        let pointArr = Cesium.Cartesian3.fromRadiansArrayHeights(degreeArr);

        new PatrolModel(viewer, { url: "./models/ship/scene.gltf", scale: 2.5 }, { speed: 0.01, pointArr: pointArr });

        let boundingSphere = Cesium.BoundingSphere.fromPoints(pointArr)
        viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(boundingSphere.center, boundingSphere.radius * 2));
    }
}


