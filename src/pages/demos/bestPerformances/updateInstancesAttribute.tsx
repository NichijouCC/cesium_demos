import React from "react";
import { CesiumMap } from "../../../lib/map";

export default class UpdateInstancesAttribute extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        viewer.scene.globe.depthTestAgainstTerrain = false;

        var instances = [];
        for (var lon = -180.0; lon < 180.0; lon += 5.0) {
            for (var lat = -90.0; lat < 90.0; lat += 5.0) {
                instances.push(new Cesium.GeometryInstance({
                    geometry: new Cesium.RectangleGeometry({
                        rectangle: Cesium.Rectangle.fromDegrees(lon, lat, lon + 5.0, lat + 5.0)
                    }),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({
                            alpha: 0.5
                        }))
                    },
                    id: lon + "_" + lat
                }));
            }
        }
        let primitive = new Cesium.Primitive({
            geometryInstances: instances,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            appearance: new Cesium.PerInstanceColorAppearance(),
            asynchronous: false,
        });

        viewer.scene.primitives.add(primitive);

        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let picked = viewer.scene.pick(event.position);
            if (picked != null && picked.id != null) {
                let attributes = primitive.getGeometryInstanceAttributes(picked.id);//获取某个实例的属性集
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom());
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.componentWillUnmount = () => {
            handler.destroy();
        }
    }
}