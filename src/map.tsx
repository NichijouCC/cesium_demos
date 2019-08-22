import React from "react";
import { CesiumMain } from "./manager";
import { AutoRot } from "./demos/autoRotation";
import { Load3dtiles } from "./demos/load3dTiles";
import { Adjust3dtilesHeight } from "./demos/adjust3dtilesHeight";
import { CustomeRiver } from "./demos/customeRiver";
// import Cesium from "cesium";
// import Cesium from "cesium/Cesium";

// require("@cesiumBuild/Cesium");
require("@cesiumDebug/Cesium");

// const Cesium = (window as any).Cesium;

declare global {
    export module Cesium {
        export interface Cesium3DTileset {
            constructor(Cesium3DTilesetItem: {
                url: string;
                maximumScreenSpaceError: number;
                maximumNumberOfLoadedTiles: number;
                shadows?: any;
            })
        }
    }
}
// declare var Cesiumins: Cesium;
// import cs from 'cesiumSource/Cesium'
require('@cesiumSource/Widgets/widgets.css');


export class Map extends React.Component<{}, { viewer: Cesium.Viewer }> {

    constructor(props) {
        super(props);
        this.state = {
            viewer: null
        }
    }
    componentDidMount() {

        // CesiumIon.defaultAccessToken = Config.ION;
        let viewer: Cesium.Viewer = new Cesium.Viewer("cesiumContainer", MapConfig.MAPOPTIONS);

        (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";//去除版权信息
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.scene.globe.enableLighting = MapConfig.global.enableLighting;
        viewer.scene.globe.depthTestAgainstTerrain = MapConfig.global.depthTestAgainstTerrain;

        this.setState({ viewer: viewer });

    }
    render() {
        const containerStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "fixed",
        };
        return (
            <div id="cesiumContainer" style={containerStyle}>
                {
                    this.state.viewer ? <CesiumMain viewer={this.state.viewer} /> : null
                }
            </div>
        );
    }
}


const MapConfig = {
    //ION: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMGRlYTM0ZS0zYjQzLTQ0N2EtYTk4ZS0zNmIwMmU3MDRkNTIiLCJpZCI6MTkzMSwiaWF0IjoxNTMwNzU5NTg3fQ.nt8CVoWjIXTeDM9T6qPs-dM7tb7IWnNc56mzAqhcBBY',
    global: {
        enableLighting: false,
        depthTestAgainstTerrain: true,
    },
    MAPOPTIONS: {
        imageryProviderViewModels: [
            new Cesium.ProviderViewModel({
                name: "Google卫星",
                iconUrl: "http://img3.cache.netease.com/photo/0031/2012-03-22/7T6QCSPH1CA10031.jpg",
                tooltip: "Google卫星",
                creationFunction: function () {
                    return new Cesium.UrlTemplateImageryProvider({
                        url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',//影像图 (中国范围无偏移)
                        //url: 'http://www.google.cn/maps/vt?lyrs=s&gl=cn&x={x}&y={y}&z={z}',//影像图 (中国范围有偏移，以适应偏移后的Google矢量图)
                        tilingScheme: new Cesium.WebMercatorTilingScheme(),
                        minimumLevel: 1,
                        maximumLevel: 200,
                        credit: 'Google Earth',
                    });
                }
            }),
            // new Cesium.ProviderViewModel({
            //     name: "Google平面",
            //     iconUrl: "http://9.pic.pc6.com/up/2016-1/2016111102941.jpg",
            //     tooltip: "Google平面",
            //     creationFunction: function () {
            //         return new Cesium.UrlTemplateImageryProvider({
            //             url: 'http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}',//带地名标注的影像图 (影像在中国范围无偏移，但注记有偏移)
            //             // url: 'http://www.google.cn/maps/vt?lyrs=y&gl=cn&x={x}&y={y}&z={z}',//带地名标注的影像图 (影像和注记在中国范围都有偏移，以便相互匹配。但与实际坐标（天地图）不匹配)
            //             tilingScheme: new Cesium.WebMercatorTilingScheme(),
            //             minimumLevel: 1,
            //             maximumLevel: 200,
            //             credit: 'Google Earth',
            //         });
            //     }
            // }),
            // //tianditu
            // new Cesium.ProviderViewModel({
            //     name: "天地图卫星",
            //     iconUrl: "http://a4.att.hudong.com/84/20/01300000167299128772204307677.jpg",
            //     tooltip: "天地图卫星",
            //     creationFunction: function () {
            //         return new Cesium.WebMapTileServiceImageryProvider({
            //             url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //             layer: "tdtBasicLayer",
            //             style: "default",
            //             format: "image/jpeg",
            //             tileMatrixSetID: "GoogleMapsCompatible",
            //             show: false
            //         });
            //     }
            // }),
            // new Cesium.ProviderViewModel({
            //     name: "天地图平面",
            //     iconUrl: "http://a4.att.hudong.com/84/20/01300000167299128772204307677.jpg",
            //     tooltip: "天地图平面",
            //     creationFunction: function () {
            //         return new Cesium.WebMapTileServiceImageryProvider({
            //             url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            //             layer: "tdtVecBasicLayer",
            //             style: "default",
            //             format: "image/jpeg",
            //             tileMatrixSetID: "GoogleMapsCompatible",
            //             show: false
            //         });
            //     }
            // }),
        ], //设置影像图列表
        shouldAnimate: true,
        geocoder: false, //右上角查询按钮
        shadows: false,
        terrainProviderViewModels: [],//设置地形图列表
        animation: false,             //动画小窗口
        baseLayerPicker: false,        //图层选择器
        fullscreenButton: false,      //全屏
        vrButton: false,              //vr按钮
        homeButton: false,            //home按钮
        infoBox: false,
        sceneModePicker: false,       //2D,2.5D,3D切换
        selectionIndicator: false,
        timeline: false,              //时间轴
        navigationHelpButton: false,  //帮助按钮
        terrainShadows: Cesium.ShadowMode.ENABLED,
    },
};