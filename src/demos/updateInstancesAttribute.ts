import { Iexample } from "./iexample";

export class UpdateInstancesAttribute implements Iexample {
    title: string = "动态更改instances 的属性"
    beInit?: boolean;
    init?(props: import("./iexample").IinitProps): void {
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

        props.viewer.scene.primitives.add(primitive);

        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let picked = props.viewer.scene.pick(event.position);
            if (picked != null && picked.id != null) {
                let attributes = primitive.getGeometryInstanceAttributes(picked.id);//获取某个实例的属性集
                attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.fromRandom());
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    update(props: import("./iexample").IupdateProps): void {
    }


}