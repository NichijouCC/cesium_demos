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

    static activePick(viewer: Cesium.Viewer, type: "cartesian" | "cartographic" | "cartographic_angle", onPick?: (pos: Cesium.Cartographic) => void) {
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.position);
            let picked = viewer.scene.pickFromRay(ray, []);
            if (picked && picked.object != null) {
                switch (type) {
                    case "cartesian":
                        console.warn(picked.position.toString());
                        break;
                    case "cartographic":
                        console.warn(Cesium.Cartographic.fromCartesian(picked.position).toString());
                        break;
                    case "cartographic_angle":
                        let car = Cesium.Cartographic.fromCartesian(picked.position);
                        console.warn(car.longitude * 180 / Math.PI + "," + car.latitude * 180 / Math.PI + "," + car.height);
                        break;
                }
                if (onPick) {
                    let cargo = Cesium.Cartographic.fromCartesian(picked.position);
                    onPick(cargo);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return rayHandler;
    }

    static logCameraInfo(viewer: Cesium.Viewer) {
        let pos = [viewer.camera.positionWC.x, viewer.camera.positionWC.y, viewer.camera.positionWC.z];
        let hpr = [viewer.camera.heading, viewer.camera.pitch, viewer.camera.roll];
        let info = JSON.stringify({ pos, hpr });
        console.log(info);
        return info;
    }

    static loadCameraInfo(viewer: Cesium.Viewer, info: string) {
        let { pos, hpr } = JSON.parse(info);
        viewer.camera.setView({
            destination: new Cesium.Cartesian3(pos[0], pos[1], pos[2]),
            orientation: {
                heading: hpr[0],
                pitch: hpr[1],
                roll: hpr[2],
            }
        });
    }

    static drawPoint(viewer: Cesium.Viewer, point: Cesium.Cartesian3, color = Cesium.Color.RED) {
        viewer.entities.add({
            position: point,
            point: {
                color: color,
                pixelSize: 5,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        })
    }
}