import React from "react";
import { CesiumMap } from "../../lib/map";

export default class MutilplyPick extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

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


        this.componentWillUnmount = () => {
            handler.destroy();
            rayHandler.destroy();
        }
    }
}