
export enum PosType {
    Cartesian,
    Cartographic,
    Cartographic_angle,
}

export class Debug {
    static addSpriteMark(pos: Cesium.Cartesian3, viewer: Cesium.Viewer) {
        viewer.entities.add({
            billboard: {
                image: "./images/riverNormal.jpg",
                width: 15,
                height: 15,
            },
            position: pos
        });
    }

    static activePick(viewer: Cesium.Viewer, type: PosType = PosType.Cartographic) {
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.position);
            let picked = viewer.scene.pickFromRay(ray, []);
            if (picked.object != null) {
                switch (type) {
                    case PosType.Cartesian:
                        console.warn(picked.position.toString());
                        break;
                    case PosType.Cartographic:
                        console.warn(Cesium.Cartographic.fromCartesian(picked.position).toString());
                        break;
                    case PosType.Cartographic_angle:
                        let car = Cesium.Cartographic.fromCartesian(picked.position);
                        console.warn(car.longitude * 180 / Math.PI + "," + car.latitude * 180 / Math.PI + "," + car.height);
                        break;
                }
                // console.warn(Cesium.Cartographic.fromCartesian(picked.position).toString())
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

}