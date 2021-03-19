import React from "react";
import { CesiumMap } from "../../lib/map";

interface IriverJson {
    data: { longitude: string, latitude: string }[]
}
export default class CustomeRiver extends React.Component {

    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        fetch("./json/islandRiver.json")
            .then(res => res.json())
            .then((res) => {
                let data = (res.data as IriverJson).data;
                let riverPoint: number[] = [];
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    riverPoint.push(Number.parseFloat(item.longitude));
                    riverPoint.push(Number.parseFloat(item.latitude));
                }
                return riverPoint;
            })
            .then((riverPoint) => {

                let points = Cesium.Cartesian3.fromDegreesArray(riverPoint);

                let polygon = new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(points),
                    extrudedHeight: 0,
                    height: 0.1,
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                });
                let inc = new Cesium.GeometryInstance({
                    geometry: polygon as any
                })
                let River = new Cesium.Primitive({
                    geometryInstances: [inc],
                    appearance: new Cesium.EllipsoidSurfaceAppearance({
                        aboveGround: true
                    }),
                    show: true
                });
                let a = 0.3;
                let colorg = new Cesium.Color(a * 3.0 / 255, a * 42.0 / 255, a * 111.0 / 255, 0.8);
                var River_Material = new Cesium.Material({
                    fabric: {
                        type: 'Water',
                        uniforms: {
                            baseWaterColor: colorg,
                            specularIntensity: 0.5,
                            normalMap: './images/riverNormal.jpg',
                            frequency: 5000.0,
                            animationSpeed: 0.01,
                            amplitude: 2
                        }
                    }
                });
                River.appearance.material = River_Material;
                viewer.scene.primitives.add(River);

                viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(points), { offset: new Cesium.HeadingPitchRange(0, -90 * Math.PI / 180, 1000) });

                // viewer.camera.setView({
                //     destination: new Cesium.Cartesian3(-2862254.210290102, 4651511.794501719, 3283563.2216813704),
                //     orientation: {
                //         heading: 0, // east, default value is 0.0 (north)
                //         pitch: -90*Math.PI/180,    // default value (looking down)
                //         roll: 0                             // default value
                //     }
                // })
            }).catch(err => {
                console.error(err);
            });
    }
}