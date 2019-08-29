import { Iexample } from "./iexample";

export class MutilplyPick implements Iexample {
    title: string = "各种pick"
    beInit?: boolean;
    init?(props: import("./iexample").IinitProps): void {
        //--------------windows position pick
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let picked = props.viewer.scene.pick(event.position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //-------------ray 物体
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let ray = props.viewer.camera.getPickRay(event.position);
            let picked = props.viewer.scene.pickFromRay(ray, []);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        //-------------ray plane
        let sompoint = Cesium.Cartesian3.fromDegrees(121, 31);
        let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(sompoint, new Cesium.Cartesian3());
        let somPlane = Cesium.Plane.fromPointNormal(sompoint, normal);
        let someRay = new Cesium.Ray(props.viewer.camera.position, props.viewer.camera.direction);
        Cesium.IntersectionTests.rayPlane(someRay, somPlane);

    }
    update(props: import("./iexample").IupdateProps): void {

    }
}