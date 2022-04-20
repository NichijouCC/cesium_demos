import { Modal } from "antd";
import React from "react";
import { CesiumMap, Debug } from "../../lib";

export default class BoxSelect extends React.Component<{}, { visible: boolean }> {
    line: Cesium.Entity;
    points: { point: Cesium.Cartesian3, ins: Cesium.Entity }[] = [];
    screenStartPoint = new Cesium.Cartesian2();
    screenEndPoint = new Cesium.Cartesian2();
    beActive: boolean;
    viewer: Cesium.Viewer;
    selectDiv: HTMLDivElement;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render() {
        return <React.Fragment>
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
            <Modal
                visible={this.state.visible}
                title="确认删除"
                onOk={() => this.deletePoints()}
                onCancel={() => this.cancel()}
            />
        </React.Fragment>
    }


    private deletePoints() {
        this.points = this.points.filter(item => {
            let screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, item.point);
            if (screenPos == null || screenPos.x < this.screenStartPoint.x || screenPos.x > this.screenEndPoint.x || screenPos.y < this.screenStartPoint.y || screenPos.y > this.screenEndPoint.y) {
                return true;
            } else {
                this.viewer.entities.remove(item.ins);
                return false
            }
        })
        this.beActive = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true;

        this.setState({ visible: false });
        this.selectDiv.style.width = `0px`;
        this.selectDiv.style.height = `0px`;
    }

    private cancel() {
        this.beActive = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = true;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true;


        this.setState({ visible: false });
        this.selectDiv.style.width = `0px`;
        this.selectDiv.style.height = `0px`;
    }


    private init(viewer: Cesium.Viewer) {
        //准备线资源
        let startPoint = Cesium.Cartesian3.fromDegrees(-75.59689628236974, 40.04021362709179, 110.662327232677132);
        let endPoint = Cesium.Cartesian3.fromDegrees(-75.59754639282833, 40.03759666603451, 2.0127028956620197);

        let points: Cesium.Cartesian3[] = [];
        for (let i = 0; i < 1000; i++) {
            let point = Cesium.Cartesian3.lerp(startPoint, endPoint, i / 1000, new Cesium.Cartesian3());
            points.push(point);
            // let ins = null;
            let ins = viewer.entities.add({
                position: point,
                point: {
                    pixelSize: 5,
                    // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }
            });

            this.points.push({ point, ins });
        }

        document.oncontextmenu = function () { return false; }
        let selectDiv = document.createElement("div");
        selectDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;";
        document.body.appendChild(selectDiv);
        this.selectDiv = selectDiv;

        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        this.beActive = false;

        handler.setInputAction((event) => {
            this.screenStartPoint.x = event.position.x;
            this.screenStartPoint.y = event.position.y;
            selectDiv.style.left = event.position.x + "px";
            selectDiv.style.top = event.position.y + "px";

            this.beActive = true;
            viewer.scene.screenSpaceCameraController.enableZoom = false;

        }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
        //鼠标抬起事件，获取div坐上和右下的x,y 转为经纬度坐标
        handler.setInputAction((event) => {
            this.screenEndPoint.x = event.position.x;
            this.screenEndPoint.y = event.position.y;

            this.setState({ visible: true })

        }, Cesium.ScreenSpaceEventType.RIGHT_UP);

        handler.setInputAction((ev) => {
            if (this.beActive) {
                selectDiv.style.width = ev.endPosition.x - this.screenStartPoint.x + "px";
                selectDiv.style.height = ev.endPosition.y - this.screenStartPoint.y + "px";
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        let modelPath = Cesium.IonResource.fromAssetId(17732);
        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: modelPath,
                maximumScreenSpaceError: 0.8,
                maximumNumberOfLoadedTiles: 100,
            })
        ) as Cesium.Cesium3DTileset;

        viewer.zoomTo(tileset);
        this.init(viewer);
    }
}