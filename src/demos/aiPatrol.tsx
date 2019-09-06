import React from "react";
import Axios from "axios";
import { CesiumMap } from "../lib/map";
import { Helper } from "../lib/helper";

export class AIPatrol extends React.Component {
    static title = "ai巡游";

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelUrl = "./static/models/ship/scene.gltf";
        let ship = viewer.entities.add({
            position: Cesium.Cartesian3.ZERO,
            orientation: Cesium.Quaternion.IDENTITY,
            model: {
                uri: modelUrl,
                scale: 2.5
            }
        });

        Axios.get("./static/json/shipPath.json")
            .then((res) => {
                let degreeArr = [];
                let allpos = res.data.data;
                for (let i = 0; i < allpos.length; i++) {
                    let item = allpos[i];
                    degreeArr.push(item.longitude * Math.PI / 180);
                    degreeArr.push(item.latitude * Math.PI / 180);
                    degreeArr.push(2);
                }

                let pointArr = Cesium.Cartesian3.fromRadiansArrayHeights(degreeArr);
                let dirArr = [];
                for (let i = 0; i < pointArr.length - 1; i++) {
                    let dir = Cesium.Cartesian3.subtract(pointArr[i + 1], pointArr[i], new Cesium.Cartesian3());
                    dir = Cesium.Cartesian3.normalize(dir, dir);
                    dirArr.push(dir);
                }
                viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));

                let speed = 0.01;
                let curPointIndex = 0;
                let curPos = pointArr[0];
                let quat = this.calculateOrientation(pointArr[0], pointArr[1]);
                ship.orientation = new Cesium.ConstantProperty(quat);

                viewer.frameUpdate.addEventListener((deltalTime) => {
                    let moveDelta = Cesium.Cartesian3.multiplyByScalar(dirArr[curPointIndex], speed * deltalTime, new Cesium.Cartesian3());
                    let newPos = Cesium.Cartesian3.add(curPos, moveDelta, new Cesium.Cartesian3());

                    let distance = Cesium.Cartesian3.distance(pointArr[curPointIndex], pointArr[curPointIndex + 1]);
                    let newdistance = Cesium.Cartesian3.distance(pointArr[curPointIndex], newPos);

                    if (newdistance >= distance) {
                        newPos = Cesium.Cartesian3.clone(pointArr[curPointIndex + 1]);
                        curPointIndex++;
                        if (curPointIndex >= pointArr.length - 1) {//end
                            curPointIndex = 0;
                            newPos = Cesium.Cartesian3.clone(pointArr[0]);
                        }
                        let quat = this.calculateOrientation(pointArr[curPointIndex], pointArr[curPointIndex + 1]);
                        ship.orientation = new Cesium.ConstantProperty(quat);
                    }
                    ship.position = new Cesium.ConstantPositionProperty(newPos);
                    curPos = newPos;
                });

            }).catch(err => {
                console.error(err)
            });
    }

    render() {
        return (
            <CesiumMap id={AIPatrol.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }

    private calculateOrientation(nextPosition: Cesium.Cartesian3, position: Cesium.Cartesian3) {
        let dir = new Cesium.Cartesian3();
        Cesium.Cartesian3.subtract(position, nextPosition, dir);
        Cesium.Cartesian3.normalize(dir, dir);
        var surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(position, new Cesium.Cartesian3());

        let right = Cesium.Cartesian3.cross(dir, surfaceNormal, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(right, right);

        let diry = Cesium.Cartesian3.cross(surfaceNormal, right, new Cesium.Cartesian3());
        let quat = Helper.unitxyzToRotation(right, diry, surfaceNormal, new Cesium.Quaternion())
        return quat;
    }
}