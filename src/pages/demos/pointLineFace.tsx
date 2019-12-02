import React from "react";
import { CesiumMap } from "../../lib/map";

export default class PointLineFace extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        let pointArr = Cesium.Cartesian3.fromDegreesArrayHeights([
            121.444409, 31.247417, 200.0,
            121.533521, 31.235685, 200.0,
            121.563273, 31.190347, 200.0,
            121.546744, 31.194054, 200.0,
            121.516705, 31.191459, 200.0,
            121.502188, 31.203074, 200.0,
        ]);

        //--------------draw points
        pointArr.forEach(item => {
            viewer.entities.add({
                point: {
                    color: Cesium.Color.AQUA,
                    pixelSize: 15,
                    zIndex: 20
                },
                position: item,
            });
        });
        //-------------draw face
        viewer.entities.add({
            polygon: {
                hierarchy: pointArr,
                material: Cesium.Color.RED.withAlpha(0.3),
                perPositionHeight: true
            }
        });
        pointArr.push(pointArr[0]);
        //-----------------draw line
        viewer.entities.add({
            polyline: {
                positions: pointArr,
                material: Cesium.Color.BLUE,
                zIndex: 10
            }
        });
        viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
        this.handler = this.addMouseInteraction(viewer);
    }
    private handler: Cesium.ScreenSpaceEventHandler
    componentWillUnmount() {
        if (this.handler) {
            this.handler.destroy();
        }
    }

    //增加交互
    private addMouseInteraction(viewer: Cesium.Viewer) {
        let pointArr = [];
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let pos = viewer.scene.pickPosition(event.position);
            if (pos != null) {

                let car = Cesium.Cartographic.fromCartesian(pos);
                let newpos = Cesium.Cartesian3.fromRadians(car.longitude, car.latitude, 200);
                pointArr.push(newpos);
                this.refreshpolygon(viewer, pointArr.concat([]));
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        return handler;
    }
    private customedataSource: Cesium.CustomDataSource;
    private refreshpolygon(viewer: Cesium.Viewer, pointArr: Cesium.Cartesian3[]) {
        if (this.customedataSource != null) {
            viewer.dataSources.remove(this.customedataSource, true);
        }
        var dataSource = new Cesium.CustomDataSource("name");
        this.customedataSource = dataSource;
        viewer.dataSources.add(dataSource);
        //--------------draw points
        pointArr.forEach(item => {
            dataSource.entities.add({
                point: {
                    color: Cesium.Color.AQUA,
                    pixelSize: 15,
                    zIndex: 20
                },
                position: item,
            });
        });
        //-------------draw face
        dataSource.entities.add({
            polygon: {
                hierarchy: pointArr,
                material: Cesium.Color.RED.withAlpha(0.3),
                perPositionHeight: true
            }
        });

        pointArr.push(pointArr[0]);
        //-----------------draw line
        dataSource.entities.add({
            polyline: {
                positions: pointArr,
                material: Cesium.Color.BLUE,
                zIndex: 10
            }
        });
    }
}