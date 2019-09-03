import React from "react";
import { CesiumMap } from "../lib/map";

export class MutilplyPick extends React.Component {
    static title: string = "各种pick"

    handleViewerLoaded(viewer: Cesium.Viewer) {
        //--------------windows position pick
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let picked = viewer.scene.pick(event.position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //-------------ray 物体
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.position);
            let picked = viewer.scene.pickFromRay(ray, []);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //-------------ray plane
        let sompoint = Cesium.Cartesian3.fromDegrees(121, 31);
        let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(sompoint, new Cesium.Cartesian3());
        let somPlane = Cesium.Plane.fromPointNormal(sompoint, normal);
        let someRay = new Cesium.Ray(viewer.camera.position, viewer.camera.direction);
        Cesium.IntersectionTests.rayPlane(someRay, somPlane);
    }
    render() {
        return (
            <CesiumMap id={MutilplyPick.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
}