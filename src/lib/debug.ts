

export class Debug {
    static addSpriteMark(pos: Cesium.Cartesian3, viewer: Cesium.Viewer) {
        viewer.entities.add({
            billboard: {
                image: "./static/images/riverNormal.jpg",
                width: 15,
                height: 15,
            },
            position: pos
        });
    }

    static activePick(viewer: Cesium.Viewer) {
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.position);
            let picked = viewer.scene.pickFromRay(ray, []);
            if (picked.object != null) {
                console.warn(Cesium.Cartographic.fromCartesian(picked.position).toString())
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}