import React from "react";

import { Load3dtiles } from "./demos/load3dTiles";
import { Adjust3dtilesHeight } from "./demos/adjust3dtilesHeight";
import { CameraRot } from "./demos/cameraRotation";
import { CustomeRiver } from "./demos/customeRiver";
import { CustomeGeometry } from "./demos/customeGeometry";
import { UpdateInstancesAttribute } from "./demos/updateInstancesAttribute";
import { MutilplyPick } from "./demos/pick";

import { Dom_animationPoint } from "./demos/dom_animationPoint";
import { Dom_tagInfo } from "./demos/dom_tag";

import 'antd/dist/antd.css';
import { Tabs, Radio, Menu } from 'antd';
import './main.css'
import { AutoAdjust3dtilesHeight } from "./demos/autoAdjust3dtilesHeight";
import { AIPatrol } from "./demos/aiPatrol";
import { CustomeMaterial_1 } from "./demos/customeMaterial_1";
import { PointLineFace } from "./demos/pointLineFace";
import { CustomeMaterial_2 } from "./demos/customeMaterial_2";
import { Classification_1 } from "./demos/classification_1";
import { Classification_2 } from "./demos/classification_2";
import { ClipModels } from "./demos/clipModels";
import { InstancesGltf } from "./demos/InstancesGltf";

export class Main extends React.Component {
    state = {
        demos: null,
        demoIndex: 0,
    }
    componentDidMount() {
        let _demos = [
            { title: PointLineFace.title, element: < PointLineFace /> },
            { title: Adjust3dtilesHeight.title, element: < Adjust3dtilesHeight /> },
            { title: Load3dtiles.title, element: < Load3dtiles /> },
            { title: ClipModels.title, element: < ClipModels /> },
            { title: AutoAdjust3dtilesHeight.title, element: < AutoAdjust3dtilesHeight /> },
            { title: CameraRot.title, element: < CameraRot /> },
            { title: AIPatrol.title, element: < AIPatrol /> },
            { title: CustomeRiver.title, element: < CustomeRiver /> },
            { title: Classification_1.title, element: < Classification_1 /> },
            { title: Classification_2.title, element: < Classification_2 /> },
            { title: Dom_animationPoint.title, element: < Dom_animationPoint /> },
            { title: Dom_tagInfo.title, element: < Dom_tagInfo /> },
            { title: InstancesGltf.title, element: < InstancesGltf /> },
            { title: UpdateInstancesAttribute.title, element: < UpdateInstancesAttribute /> },
            { title: CustomeGeometry.title, element: < CustomeGeometry /> },
            { title: CustomeMaterial_1.title, element: < CustomeMaterial_1 /> },
            { title: CustomeMaterial_2.title, element: < CustomeMaterial_2 /> },
            { title: MutilplyPick.title, element: < MutilplyPick /> },
        ]
        this.setState({ demos: _demos });
    }

    render() {
        let cssStyle: React.CSSProperties = { width: "100%", height: "100%", position: "fixed" };
        return (
            <div >
                {
                    this.state.demos ? this.state.demos[this.state.demoIndex].element : null
                }
                <Menu
                    onClick={(Item) => {
                        this.setState({ demoIndex: Item.key })
                    }}
                    style={{
                        width: 256,
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        background: "darkgray"
                    }}
                    defaultSelectedKeys={["0"]}
                    mode="inline"
                >
                    {
                        this.state.demos ? this.state.demos.map((item, index) => {
                            return <Menu.Item key={index}>{item.title}</Menu.Item>
                        }) : null
                    }
                </Menu>

            </div>
        );
    }
}