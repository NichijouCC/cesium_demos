
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


export function rotationTo(from: Cesium.Cartesian3, to: Cesium.Cartesian3, out: Cesium.Quaternion = new Cesium.Quaternion()): Cesium.Quaternion {
    let tmpVec3 = new Cesium.Cartesian3();
    let xUnitVec3 = Cesium.Cartesian3.UNIT_X;
    let yUnitVec3 = Cesium.Cartesian3.UNIT_Y;

    let dot = Cesium.Cartesian3.dot(from, to);
    if (dot < -0.999999) {
        Cesium.Cartesian3.cross(tmpVec3, xUnitVec3, from);
        if (Cesium.Cartesian3.magnitude(tmpVec3) < 0.000001) Cesium.Cartesian3.cross(tmpVec3, yUnitVec3, from);
        Cesium.Cartesian3.normalize(tmpVec3, tmpVec3);
        Cesium.Quaternion.fromAxisAngle(tmpVec3, Math.PI, out);
        return out;
    } else if (dot > 0.999999) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return out;
    } else {
        Cesium.Cartesian3.cross(tmpVec3, from, to);
        out.x = tmpVec3.x;
        out.y = tmpVec3.y;
        out.z = tmpVec3.z;
        out.w = 1 + dot;
        return Cesium.Quaternion.normalize(out, out);
    }
}
