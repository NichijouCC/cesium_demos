import React from "react";
import { CesiumMap } from "../../../lib/map";

export default class CustomeMaterial_2 extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {

        let pointArr = Cesium.Cartesian3.fromDegreesArrayHeights([
            121.00, 31.00, 100.0,
            121.01, 31.003, 100.0,
            121.013, 31.01, 100.0,
            121.0, 31.013, 100.0,
            121.00, 31.00, 100.0,

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
             float t=fract(time);
             material.alpha =mix(0.1,1.0,clamp((1.0-st.t) * color.a,0.0,1.0)) +(1.0-sign(st.t-t))*0.2*(1.0-colorImage.r)+colorImage.r ;
             material.diffuse = (1.0-colorImage.r)*color.rgb+colorImage.rgb*vec3(1.0,1.0,0);
             return material;
         }`;
        let material = new Cesium.Material({
            fabric: {
                type: "custome_2",
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                    image: "./images/arrow.png",
                    time: 0,
                    repeat: 30
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
            material.uniforms["time"] = material.uniforms["time"] + delta * 0.0005;
        });

        viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
    }
}