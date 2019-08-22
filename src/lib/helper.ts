
export function PickLowestPostion(viewer: Cesium.Viewer, center: Cesium.Cartesian3, radius: number, sampleCount: number) {

    let plane = new Cesium.EllipsoidTangentPlane(Cesium.Ellipsoid.WGS84, center);
    for (let i = 0; i < sampleCount; i++) {
        for (let j = 0; j < sampleCount; j++) {
            let offset = Cesium.Cartesian3.multiplyByScalar(plane.xAxis, j, new Cesium.Cartesian3());
            let samplePos = Cesium.Cartesian3.add(offset, plane.origin, new Cesium.Cartesian3());

            // Cesium.Ellipsoid.WGS84.
            // let res = viewer.scene.pickFromRay(new Cesium.Ray(samplePos, scen), []);
        }
    }

}
