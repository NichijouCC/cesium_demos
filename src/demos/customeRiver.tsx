import Axios from "axios";
import React from "react";
import { CesiumMap } from "../lib/map";

interface IriverJson {
    data: { longitude: string, latitude: string }[]
}
export class CustomeRiver extends React.Component {
    static title: string = "画河流"

    handleViewerLoaded(viewer: Cesium.Viewer) {
        Axios.get("./json/islandRiver.json").then((res) => {
            let data = (res.data as IriverJson).data;
            let riverPoint: number[] = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                riverPoint.push(Number.parseFloat(item.longitude));
                riverPoint.push(Number.parseFloat(item.latitude));
            }
            return riverPoint;
        }).then((riverPoint) => {
            let polygon = new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(riverPoint)),
                extrudedHeight: 0,
                height: 3,
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
            let colorg = new Cesium.Color(a * 3.0 / 255, a * 42.0 / 255, a * 111.0 / 255, 1.0);
            var River_Material = new Cesium.Material({
                fabric: {
                    type: 'Water',
                    uniforms: {
                        baseWaterColor: colorg,
                        specularIntensity: 0.0001,
                        normalMap: './images/riverNormal.jpg',
                        frequency: 500.0,
                        animationSpeed: 0.01,
                        amplitude: 10.0
                    }
                }
            });
            River.appearance.material = River_Material;
            viewer.scene.primitives.add(River);

            viewer.camera.setView({
                destination: new Cesium.Cartesian3(-2862254.210290102, 4651511.794501719, 3283563.2216813704),
                orientation: {
                    heading: 6.159615851035844, // east, default value is 0.0 (north)
                    pitch: -0.6766046253129958,    // default value (looking down)
                    roll: 6.282714572962707                             // default value
                }
            })
        }).catch(err => {
            console.error(err);
        });
    }
    render() {
        return (
            <CesiumMap id={CustomeRiver.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }} />
        )
    }

}