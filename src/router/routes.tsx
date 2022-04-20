import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { AsyncRoute } from "./asyncRoute";
import { DeafaultPage } from "@/pages/deaultPage";

export const demosInfo = [
    {
        title: "资源加载",
        path: "/3dtiles",
        childs: [
            {
                title: "加载3dtiles",
                path: "/load3dTiles",
                asyncComponent: () => import("../pages/demos/3dtiles/load3dTiles")
            },
            {
                title: "调整3dtiles高度",
                path: "/adjust3dtilesHeight",
                asyncComponent: () => import("../pages/demos/3dtiles/adjust3dtilesHeight")
            },
            {
                title: "自动调整3dtiles高度贴合地面",
                path: "/autoAdjust3dtilesHeight",
                asyncComponent: () => import("../pages/demos/3dtiles/autoAdjust3dtilesHeight")
            },
            {
                title: "加载kml",
                path: "/loadKml",
                asyncComponent: () => import("../pages/demos/3dtiles/loadKml")
            },
            {
                title: "加载正射",
                path: "/loadKmlTiles",
                asyncComponent: () => import("../pages/demos/3dtiles/loadKmlTiles")
            }
        ]
    },
    {
        title: "地标",
        path: "/groundMark",
        childs: [
            {
                title: "dom - 点扩散",
                path: "/dom_animationPoint",
                asyncComponent: () => import("../pages/demos/landMark/dom_animationPoint")
            },
            {
                title: "dom - 标签",
                path: "/dom_tag",
                asyncComponent: () => import("../pages/demos/landMark/dom_tag")
            },
        ]
    },
    {
        title: "ai模拟",
        path: "/aiStimulate",
        childs: [
            {
                title: "自定义路线巡游",
                path: "/Patrol",
                asyncComponent: () => import("../pages/demos/ai/aiPatrol")
            },
            {
                title: "指令机器人",
                path: "/commandRobot",
                asyncComponent: () => import("../pages/demos/ai/commandRobotDemo")
            },
        ]
    },
    {
        title: "测量工具",
        path: "/measureTool",
        childs: [
            {
                title: "体积测量",
                path: "/volumeMeasure",
                asyncComponent: () => import("../pages/demos/measure/volumeMeasureDemo")
            },
            {
                title: "线段测量",
                path: "/lineMeasure",
                asyncComponent: () => import("../pages/demos/measure/lineMeasureDemo")
            },
            {
                title: "点测量",
                path: "/pointMeasure",
                asyncComponent: () => import("../pages/demos/measure/pointMeasureDemo")
            },
            {
                title: "测量工具组",
                path: "/groupMeasureTools",
                asyncComponent: () => import("../pages/demos/measure/groupToolsDemo")
            },
        ]
    },
    {
        title: "单体化",
        path: "/classification",
        childs: [
            {
                title: "单体化_一号",
                path: "/classification_1",
                asyncComponent: () => import("../pages/demos/classification/classification_1")
            },
            {
                title: "单体化_二号",
                path: "/classification_2",
                asyncComponent: () => import("../pages/demos/classification/classification_2")
            },
        ]
    },
    {
        title: "造效果",
        path: "/materials",
        childs: [
            {
                title: "自定义材质_围栏一号",
                path: "/customeMaterial_1",
                asyncComponent: () => import("../pages/demos/effect/customeMaterial_1")
            },
            {
                title: "自定义材质_围栏二号",
                path: "/customeMaterial_2",
                asyncComponent: () => import("../pages/demos/effect/customeMaterial_2")
            },
            {
                title: "区域特效",
                path: "/areaTag",
                asyncComponent: () => import("../pages/demos/effect/areaTagDemo")
            },
        ]
    },
    {
        title: "视频",
        path: "/videoFusion",
        childs: [
            {
                title: "视频融合",
                path: "/videoFusion",
                asyncComponent: () => import("../pages/demos/video/videoFusion")
            },
            {
                title: "视频融合编辑器",
                path: "/videoFusionEditor",
                asyncComponent: () => import("../pages/demos/video/videoFusionEditorTool")
            }
        ]
    },
    {
        title: "性能优化",
        path: "/performances",
        childs: [
            {
                title: "Instances Gltf 并更新位置",
                path: "/InstancesGltf",
                asyncComponent: () => import("../pages/demos/bestPerformances/InstancesGltf")
            },
            {
                title: "动态更改instances 的属性",
                path: "/updateInstancesAttribute",
                asyncComponent: () => import("../pages/demos/bestPerformances/updateInstancesAttribute")
            },
        ]
    },
    {
        title: "热力图",
        path: "/heatmap",
        asyncComponent: () => import("../pages/demos/heatmap/index")
    },
    {
        title: "点线面",
        path: "/pointLineFace",
        asyncComponent: () => import("../pages/demos/pointLineFace")
    },
    {
        title: "地球自转",
        path: "/earthRotate",
        asyncComponent: () => import("../pages/demos/cameraRotation")
    },

    {
        title: "自定义河流",
        path: "/customeRiver",
        asyncComponent: () => import("../pages/demos/customeRiver")
    },
    {
        title: "模型裁剪",
        path: "/clipModels",
        asyncComponent: () => import("../pages/demos/clipModels")
    },
    {
        title: "自定义几何体(非以地心为原点建模)",
        path: "/customeGeometry",
        asyncComponent: () => import("../pages/demos/customeGeometry")
    },
    {
        title: "屏幕色调调整",
        path: "/screenAdjust",
        asyncComponent: () => import("../pages/demos/screenAdjust")
    },
    {
        title: "背景/图层清除",
        path: "/cleatBg",
        asyncComponent: () => import("../pages/demos/clearSky")
    },
    {
        title: "框选删除",
        path: "/boxSelectToDelete",
        asyncComponent: () => import("../pages/demos/boxSelect")
    }
    // {
    //     title: "测试",
    //     path: "/testDemo",
    //     asyncComponent: () => import("../pages/demos/tempt/datacenter")
    // },
    // {
    //     title: "各种pick",
    //     path: "/pick",
    //     asyncComponent: () => import("../pages/demos/pick")
    // },
]

export interface IRouteInfo {
    title: string,
    path: string,
    asyncComponent: () => Promise<any>,
    childs?: IRouteInfo[]
}

export const Demos = () => {

    let func = (child: IRouteInfo, parentpath: string, routeArr: React.ReactNode[]) => {
        if (child.childs != null) {
            child.childs.forEach(item => func(item, child.path, routeArr))
        } else {
            let routePath = parentpath + child.path;
            routeArr.push(<AsyncRoute key={routePath} exact path={routePath} asyncComponent={child.asyncComponent} />);
        }
    };

    let allRoute: React.ReactNode[] = [];
    demosInfo.forEach(item => func(item as any, "", allRoute));
    return (
        <HashRouter>
            <Switch>
                <Redirect from="/" exact to="/hello"></Redirect>
                <Route path='/hello' exact component={DeafaultPage} />
                {
                    allRoute
                }
            </Switch>
        </HashRouter>
    )
}