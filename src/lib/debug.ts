

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
}