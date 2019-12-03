import React from "react";
import { CesiumMap } from "../../lib/map";
import { Helper } from "../../lib/helper";
// import path from "../../../public/json/shipPath.json";
import path from "@public/json/shipPath.json";

// import path from "./shipPath.json"

export default class AIPatrol extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let modelUrl = "./models/ship/scene.gltf";
        let ship = viewer.entities.add({
            position: Cesium.Cartesian3.ZERO,
            orientation: Cesium.Quaternion.IDENTITY,
            model: {
                uri: modelUrl,
                scale: 2.5
            }
        });

        let degreeArr = [];
        let allpos = path.data;
        for (let i = 0; i < allpos.length; i++) {
            let item = allpos[i];
            degreeArr.push(parseFloat(item.longitude) * Math.PI / 180);
            degreeArr.push(parseFloat(item.latitude) * Math.PI / 180);
            degreeArr.push(2);
        }

        let pointArr = Cesium.Cartesian3.fromRadiansArrayHeights(degreeArr);
        let boundingSphere = Cesium.BoundingSphere.fromPoints(pointArr)
        viewer.scene.camera.flyToBoundingSphere(new Cesium.BoundingSphere(boundingSphere.center, boundingSphere.radius * 2));

        new PatrolModel({ ins: ship, viewer: viewer, speed: 0.01, pointArr: pointArr, initRot: Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, Math.PI) });
    }
}


enum LoopEnum {
    pingpong,
    restart
}

class PatrolModel {
    private ins: Cesium.Entity;
    private options: { ins: Cesium.Entity, viewer: Cesium.Viewer, speed: number, pointArr: Cesium.Cartesian3[], initRot: Cesium.Quaternion, loopType: LoopEnum };
    constructor(options: { ins: Cesium.Entity, viewer: Cesium.Viewer, speed: number, pointArr: Cesium.Cartesian3[], initRot?: Cesium.Quaternion, loopType?: LoopEnum }) {
        options.viewer.frameUpdate.addEventListener(this.loop);
        this.options = { ...options, initRot: options.initRot || Cesium.Quaternion.IDENTITY, loopType: options.loopType != null ? options.loopType : LoopEnum.pingpong };
        this.ins = options.ins;

        this.dispose = () => {
            options.viewer.frameUpdate.removeEventListener(this.loop);
        }

        //----------------init
        this.currentDir = this.calculateDirection(options.pointArr[1], options.pointArr[0]);
        this.curPointIndex = 0;

        this.curPos = Cesium.Cartesian3.clone(options.pointArr[0]);
        let quat = this.calculateOrientation(options.pointArr[this.curPointIndex + 1], options.pointArr[this.curPointIndex]);
        this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.initRot, new Cesium.Quaternion());


        //------------start
        this.active();
    }

    private currentDir: Cesium.Cartesian3;
    private curPos: Cesium.Cartesian3;
    private curPointIndex: number;
    private loop = (deltalTime) => {
        if (!this.beActived) return;
        let { pointArr, speed } = this.options;
        let moveDelta = Cesium.Cartesian3.multiplyByScalar(this.currentDir, speed * deltalTime, new Cesium.Cartesian3());
        let newPos = Cesium.Cartesian3.add(this.curPos, moveDelta, new Cesium.Cartesian3());

        let distance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], pointArr[this.curPointIndex + 1]);
        let newdistance = Cesium.Cartesian3.distance(pointArr[this.curPointIndex], newPos);

        if (newdistance >= distance) {
            this.curPointIndex++;
            if (this.curPointIndex >= pointArr.length - 1) {//end
                this.curPointIndex = 0;

                if (this.options.loopType == LoopEnum.pingpong) {
                    pointArr.reverse();
                }
            }
            newPos = Cesium.Cartesian3.clone(pointArr[this.curPointIndex]);
            this.currentDir = this.calculateDirection(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            let quat = this.calculateOrientation(pointArr[this.curPointIndex + 1], pointArr[this.curPointIndex]);
            this.ins.orientation = Cesium.Quaternion.multiply(quat, this.options.initRot, new Cesium.Quaternion());
        }
        this.ins.position = newPos;
        this.curPos = newPos;
    };
    private beActived: boolean = false;

    active() {
        this.beActived = true;
    }

    disActive() {
        this.beActived = false;
    }

    dispose() { }

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

    private calculateDirection(nextPosition: Cesium.Cartesian3, position: Cesium.Cartesian3) {
        let dir = Cesium.Cartesian3.subtract(nextPosition, position, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(dir, dir);
        return dir;
    }
}