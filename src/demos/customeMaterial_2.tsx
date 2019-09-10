import React from "react";
import { CesiumMap } from "../lib/map";

export class CustomeMaterial_2 extends React.Component {
    static title = "自定义材质_围栏二号"
    render() {
        return (
            <CesiumMap id={CustomeMaterial_2.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }
    handleViewerLoaded(viewer: Cesium.Viewer) {

        let pointArr = Cesium.Cartesian3.fromDegreesArrayHeights([
            121.444409, 31.247417, 500.0,
            121.533521, 31.235685, 500.0,
            121.563273, 31.190347, 500.0,
            121.546744, 31.194054, 500.0,
            121.516705, 31.191459, 500.0,
            121.502188, 31.203074, 500.0,
            121.444409, 31.247417, 500.0,

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
                    image: "./static/images/arrow.png",
                    time: 0,
                    repeat: 50
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