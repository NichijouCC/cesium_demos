export enum PointGoupTypeEnum {
    POLYGON,
    LINE
}
export class PointGoup {
    ins: Cesium.Entity;
    points: Cesium.Entity[] = [];
    private _viewer: Cesium.Viewer;
    constructor(viewer: Cesium.Viewer, type: PointGoupTypeEnum, height?: number) {
        this._viewer = viewer;
        switch (type) {
            case PointGoupTypeEnum.POLYGON:
                this.ins = this._viewer.entities.add({
                    polygon: {
                        hierarchy: new Cesium.CallbackProperty(() => {
                            let posArr = this.points.map(item => {
                                return item.position.getValue(this._viewer.clock.currentTime);
                            })
                            return new Cesium.PolygonHierarchy(posArr);
                        }, false),
                        // extrudedHeight: 200,
                        height: height != null ? height : 0,
                        material: Cesium.Color.AQUA.withAlpha(0.3),
                        outline: true,
                        // outlineColor: Cesium.Color.AQUA,
                        outlineWidth: 20.0
                    }
                });
                break;
            case PointGoupTypeEnum.LINE:
                this.ins = this._viewer.entities.add({
                    polyline: {
                        positions: new Cesium.CallbackProperty(() => {
                            let posArr = this.points.map(item => {
                                return item.position.getValue(this._viewer.clock.currentTime);
                            })
                            return posArr;
                        }, false),
                    }
                });
                break;
        }

    }
    addNewPoint(pos: Cesium.Cartesian3, height: number = null) {
        let carPos = Cesium.Cartographic.fromCartesian(pos);
        let newPos = Cesium.Cartesian3.fromRadians(carPos.longitude, carPos.latitude, height || carPos.height);
        let enityPoint = this._viewer.entities.add({
            position: newPos,
            point: {
                pixelSize: 15.0
            }
        });
        (enityPoint as any).refreshPosition = (newPos: Cesium.Cartesian3) => {
            enityPoint.position = newPos;
        }
        (enityPoint as any).tag = "ctr";
        this.points.push(enityPoint);
    }

    logPosdata() {
        let posArr = this.points.map(item => {
            return item.position.getValue(this._viewer.clock.currentTime);
        })
        console.warn("log ploygon points position!!");
        for (let i = 0; i < posArr.length; i++) {
            let carPos = Cesium.Cartographic.fromCartesian(posArr[i]);
            console.warn(carPos.toString());
        }

    }
}



export class PointsEditorTool {
    private currentEditingPloygon: PointGoup;
    private placedPloygons: Cesium.Entity[] = [];
    constructor(viewer: Cesium.Viewer, type: PointGoupTypeEnum = PointGoupTypeEnum.POLYGON, height: number = 0) {
        let handler = new Cesium.ScreenSpaceEventHandler();
        let pickedPoint: Cesium.Entity = null;
        let activePlacePoint = false;
        let activePlaceNewpolygon = false;


        handler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.position);
            let picked = viewer.scene.pickFromRay(ray, this.placedPloygons);
            if (picked && picked.object && picked.object.id && picked.object.id.tag == "ctr") {
                pickedPoint = picked.object.id;
            } else {
                pickedPoint = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(() => {
            pickedPoint = null;
        }, Cesium.ScreenSpaceEventType.RIGHT_UP);
        handler.setInputAction((event) => {
            if (pickedPoint != null) {
                let sompoint = pickedPoint.position.getValue(viewer.clock.currentTime);
                let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(sompoint, new Cesium.Cartesian3());
                let somPlane = Cesium.Plane.fromPointNormal(sompoint, normal);
                let someRay = viewer.camera.getPickRay(event.endPosition);
                let newPos = Cesium.IntersectionTests.rayPlane(someRay, somPlane);
                if (newPos) {
                    (pickedPoint as any).refreshPosition(newPos);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        document.onkeypress = (ev) => {
            if (ev.keyCode == 66) {//b
                activePlacePoint = true;//增加新的点
            } else if (ev.keyCode == 67)//c
            {
                this.currentEditingPloygon.logPosdata();
            }
            else if (ev.keyCode == 78)//n
            {
                if (activePlaceNewpolygon == false) {
                    console.warn("active Place New polygon !");
                }
                activePlaceNewpolygon = true;//增加新的初始点
            } else {
                console.warn(ev.keyCode);
            }
        }
        document.onkeyup = (ev) => {
            console.warn("onkeyup " + ev.keyCode);
            if (ev.keyCode == 66) {
                activePlacePoint = false;
            } else if (ev.keyCode == 78) {
                if (activePlaceNewpolygon == true) {
                    console.warn("disactive Place New polygon !");
                }
                activePlaceNewpolygon = false;
            }
        }
        handler.setInputAction((event) => {
            if (activePlacePoint) {
                if (this.currentEditingPloygon != null) {
                    let pos = viewer.scene.pickPosition(event.position);
                    if (pos) {
                        this.currentEditingPloygon.addNewPoint(pos, height);
                    }
                }
            }
            if (activePlaceNewpolygon) {
                console.warn("add new ploygon!!");
                let Ploygon = this.addNewPointPloygon(viewer, type, null, height);
                let pos = viewer.scene.pickPosition(event.position);
                if (pos) {
                    Ploygon.addNewPoint(pos, height);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    addNewPointPloygon(viewer: Cesium.Viewer, type: PointGoupTypeEnum, points: Cesium.Cartesian3[] = null, height: number = null) {
        let Ploygon = new PointGoup(viewer, type, height);
        if (points != null) {
            for (const key in points) {
                Ploygon.addNewPoint(points[key], height);
            }
        }
        this.currentEditingPloygon = Ploygon;
        this.placedPloygons.push(Ploygon.ins);

        return Ploygon;
    }
}