import React from "react";
import { CesiumMap } from "../../../lib/map";

export default class CustomeMaterial_1 extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {

        // let mat = new Cesium.ImageMaterialProperty({
        //     image: './images/arrow.png',
        //     color: Cesium.Color.RED,
        //     repeat: new Cesium.Cartesian2(50, 1)
        // });

        // var redWall = viewer.entities.add({
        //     name: 'Red wall at height',
        //     wall: {
        //         positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        //             121.444409, 31.247417, 200.0,
        //             121.533521, 31.235685, 200.0,
        //             121.563273, 31.190347, 200.0,
        //             121.546744, 31.194054, 200.0,
        //             121.516705, 31.191459, 200.0,
        //             121.502188, 31.203074, 200.0
        //         ]),
        //         material: mat
        //     },
        //     show: false
        // });



        // let pointArr = Cesium.Cartesian3.fromDegreesArrayHeights([
        //     121.444409, 31.247417, 800.0,
        //     121.533521, 31.235685, 800.0,
        //     121.563273, 31.190347, 800.0,
        //     121.546744, 31.194054, 800.0,
        //     121.516705, 31.191459, 800.0,
        //     121.502188, 31.203074, 800.0,
        //     121.444409, 31.247417, 800.0,

        // ])

        let pointArr = Cesium.Cartesian3.fromDegreesArrayHeights([
            121.00, 31.00, 200.0,
            121.01, 31.003, 200.0,
            121.013, 31.01, 200.0,
            121.0, 31.013, 200.0,
            121.00, 31.00, 200.0,
        ])
        //-----内建的wall模型,按照position来分配uv的规则观察可知:点与点之间均分uv,和点的位置没有关系

        let wall = new Cesium.WallGeometry({
            positions: pointArr,
        });
        let geometry = Cesium.WallGeometry.createGeometry(wall);

        let source = `czm_material czm_getMaterial(czm_materialInput materialInput)
        {
             czm_material material = czm_getDefaultMaterial(materialInput);
             vec2 st = materialInput.st;
             vec4 colorImage = texture2D(image, vec2(fract(st.s*repeat - time), st.t));
             material.alpha = colorImage.a * color.a;
             material.diffuse = colorImage.rgb*color.rgb;
             return material;
         }`;
        let material = new Cesium.Material({
            fabric: {
                type: "custome_1",
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                    image: "./images/cardon.svg",
                    time: 0,
                    repeat: 10
                },
                source: source
            }
        });
        var rectangle = viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: false,
                renderState: {
                    cull: {
                        enabled: false,
                    }
                }
            }),
            asynchronous: false,
        }));
        rectangle.appearance.material = material;
        viewer.frameUpdate.addEventListener((delta) => {
            material.uniforms["time"] = material.uniforms["time"] + delta * 0.0001;
        });

        viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
    }
}