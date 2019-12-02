import React from "react";
import { CesiumMap } from "../../lib/map";

export default class CustomeGeometry extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let hwidth = 2.0;
        let hheigt = 2.0;
        let positions = new Float64Array([hwidth, hheigt, 0.0, -hwidth, hheigt, 0.0, -hwidth, -hheigt, 0.0, hwidth, -hheigt, 0.0]);
        let sts = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0]);
        let indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

        let geometry = new Cesium.Geometry({
            attributes: {
                position: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
                }),
                st: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 2,
                    values: sts
                })
            },
            indices: indices,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
        });
        let pos = Cesium.Cartesian3.fromDegrees(121, 31, 100);
        let hpr = new Cesium.HeadingPitchRoll();
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
        let modelToWorldMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(pos, orientation, new Cesium.Cartesian3(1, 1, 1));

        let instance = new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
            },
            modelMatrix: modelToWorldMatrix,
        });

        let mat = new Cesium.Material({
            fabric: {
                type: 'Image',
                uniforms: {
                    image: "./images/riverNormal.jpg"
                }
            }
        });
        let appearance = new Cesium.EllipsoidSurfaceAppearance({
            material: mat,
            flat: true,
        });

        viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: instance,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            appearance: appearance,
            asynchronous: false,
            shadows: Cesium.ShadowMode.DISABLED
        }));

        viewer.camera.lookAt(pos, new Cesium.HeadingPitchRange(-30, -90, 100));
    }
}