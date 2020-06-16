import React from "react";
// require("@cesiumBuild/Cesium");
const cs = require("@cesiumDebug/Cesium");
window.Cesium = cs;
// require("@cesiumDebug/Cesium");
require('@cesiumSource/Widgets/widgets.css');
// import Cesium from "cesium";

export class CesiumMap extends React.Component<{ id?: string, setUp?: boolean, onViewerLoaded?: (viewer: Cesium.Viewer) => void }> {

    private _viewer: Cesium.Viewer;
    get viewer() { return this._viewer; }
    state = {
        beActived: false
    }
    private get containerId() {
        return this.props.id || "__cesiumContainer"
    }
    componentDidMount() {
        if (this.props.setUp != false) {
            this.setUp();
        }
    }

    setUp(options?: {
        imageryProvider?: any,
        imageryProviderViewModels?: Cesium.ProviderViewModel[],
        orderIndependentTranslucency?: boolean,
        contextOptions?: {
            webgl?: {
                alpha?: boolean,
            }
        },
        ION?: string
    }): Cesium.Viewer {
        console.warn("ceisum 启动！！");
        this.setState({ beActived: true });
        Cesium.Ion.defaultAccessToken = options?.ION || MapConfig.ION;
        let viewer: Cesium.Viewer = new Cesium.Viewer(this.containerId, { ...MapConfig.MAPOPTIONS, ...options });

        (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";//去除版权信息
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);//移除双击选中

        // var terrainProvider = Cesium.createWorldTerrain({
        //     requestVertexNormals: true
        // });
        // viewer.terrainProvider = terrainProvider;

        viewer.scene.globe.enableLighting = MapConfig.global.enableLighting;//光照开关
        viewer.scene.globe.depthTestAgainstTerrain = MapConfig.global.depthTestAgainstTerrain;//depth
        viewer.scene.highDynamicRange = true;

        //------------
        viewer.frameUpdate = new Cesium.Event();
        let lasTime;
        viewer.scene.preUpdate.addEventListener((time) => {
            let dateNow = Date.now();
            let deltaTime = lasTime != null ? dateNow - lasTime : 0;
            lasTime = dateNow;
            viewer.frameUpdate.raiseEvent(deltaTime);
        });

        //-----------------------------
        (viewer as any).excuteFrameTask = (task: (deltaTime: number) => void) => {
            viewer.frameUpdate.addEventListener(task);
            return {
                end: () => viewer.frameUpdate.removeEventListener(task)
            }
        }
        if (this.props.onViewerLoaded != null) {
            this.props.onViewerLoaded(viewer);
        }
        this._viewer = viewer;
        return viewer;
    }

    destroy() {
        if (this.state.beActived) {
            this.setState({ beActived: false });
            if (this._viewer) {
                console.warn("ceisum destroy！！");
                this._viewer.destroy();
                this._viewer = null;
            }
        }
    }


    componentWillUnmount() {
        this.destroy();
    }

    render() {
        const containerStyle: React.CSSProperties = {
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: this.state.beActived ? "inline" : "none"
        };
        return (
            <div id={this.containerId} style={containerStyle}></div>
        );
    }
}

const MapConfig = {
    ION: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMzJmNDgwZi1iNmQ2LTQ0NWEtOWRkNi0wODkxYzYxYTg0ZDIiLCJpZCI6ODUzMiwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MjIwMjY4OH0.u4d7x0IxZY06ThT4JFmxrfgBxVjQcfI6xXDLu-fsWsY',
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
        terrainShadows: Cesium.ShadowMode.DISABLED,
    },
};
