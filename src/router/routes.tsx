import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { AsyncRoute, CustomeAsyncRoute } from "./AsyncRoute";
import { DeafaultPage } from "@/pages/deaultPage";

// 这个在项目里应该很有用
// let CustomeRoute = CustomeAsyncRoute({ checkFunc: () => window.localStorage.token != null, redirectPath: './login' });

export const demosInfo = [
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
        title: "加载3dtiles",
        path: "/load3dTiles",
        asyncComponent: () => import("../pages/demos/load3dTiles")
    },
    {
        title: "调整3dtiles高度",
        path: "/adjust3dtilesHeight",
        asyncComponent: () => import("../pages/demos/adjust3dtilesHeight")
    },
    {
        title: "自动调整3dtiles高度贴合地面",
        path: "/autoAdjust3dtilesHeight",
        asyncComponent: () => import("../pages/demos/autoAdjust3dtilesHeight")
    },
    {
        title: "dom - 点扩散",
        path: "/dom_animationPoint",
        asyncComponent: () => import("../pages/demos/dom_animationPoint")
    },
    {
        title: "dom - 标签",
        path: "/dom_tag",
        asyncComponent: () => import("../pages/demos/dom_tag")
    },
    {
        title: "Instances Gltf 并更新位置",
        path: "/InstancesGltf",
        asyncComponent: () => import("../pages/demos/InstancesGltf")
    },
    {
        title: "动态更改instances 的属性",
        path: "/updateInstancesAttribute",
        asyncComponent: () => import("../pages/demos/updateInstancesAttribute")
    },
    {
        title: "单体化_一号",
        path: "/classification_1",
        asyncComponent: () => import("../pages/demos/classification_1")
    },
    {
        title: "单体化_二号",
        path: "/classification_2",
        asyncComponent: () => import("../pages/demos/classification_2")
    },
    {
        title: "自定义路线巡游",
        path: "/aiPatrol",
        asyncComponent: () => import("../pages/demos/aiPatrol")
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
        title: "自定义材质_围栏一号",
        path: "/customeMaterial_1",
        asyncComponent: () => import("../pages/demos/customeMaterial_1")
    },
    {
        title: "自定义材质_围栏二号",
        path: "/customeMaterial_2",
        asyncComponent: () => import("../pages/demos/customeMaterial_2")
    },
    // {
    //     title: "模型展示",
    //     path: "/modelsShow",
    //     asyncComponent: () => import("../pages/demos/modelsShow")
    // },
    // {
    //     title: "各种pick",
    //     path: "/pick",
    //     asyncComponent: () => import("../pages/demos/pick")
    // },
]


export const Demos = () => {
    return (
        <HashRouter>
            <Switch>
                <Redirect from="/" exact to="/hello"></Redirect>
                <Route path='/hello' exact component={DeafaultPage} />
                {
                    demosInfo.map(item => <AsyncRoute key={item.path} exact path={item.path} asyncComponent={item.asyncComponent} />)
                }
            </Switch>
        </HashRouter>
    )
}