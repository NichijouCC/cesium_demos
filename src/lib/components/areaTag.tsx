import areaTag from './areaTag_1.png'
export class AreaTag {
    inside: Cesium.Entity;
    outside: Cesium.Entity;

    static create(viewer: Cesium.Viewer, options: { pos: Cesium.Cartesian3, circleSize: number, rotSpeed: number[] }) {
        let newTag = new AreaTag();
        newTag.inside = this.createCircle(viewer, { ...options, circleSize: options.circleSize * 0.5, rotSpeed: options.rotSpeed[0] });
        newTag.outside = this.createCircle(viewer, { ...options, circleSize: options.circleSize, rotSpeed: options.rotSpeed[1] });

        return newTag;
    }

    private static createCircle(viewer: Cesium.Viewer, options: { pos: Cesium.Cartesian3, circleSize: number, rotSpeed: number }) {
        let rot = 0;
        return viewer.entities.add({
            position: options.pos,
            ellipse: {
                semiMinorAxis: options.circleSize,
                semiMajorAxis: options.circleSize,
                material: areaTag,
                stRotation: new Cesium.CallbackProperty(() => {
                    rot += options.rotSpeed * 0.05;
                    return rot;
                }, false),
                zIndex: 2,
            } as any
        });
    }
}