import React from "react";

import { Adjust3dtilesHeight } from "./demos/adjust3dtilesHeight";
import { CameraRot } from "./demos/cameraRotation";


import 'antd/dist/antd.css';
import { Tabs, Radio } from 'antd';
import './main.css'
import { BrowserRouter, Route } from "react-router-dom";
import { CustomeGeometry } from "./demos/customeGeometry";
import { CustomeRiver } from "./demos/customeRiver";
import { Load3dtiles } from "./demos/load3dTiles";
import { MutilplyPick } from "./demos/pick";
import { UpdateInstancesAttribute } from "./demos/updateInstancesAttribute";
const { TabPane } = Tabs;

export class Main extends React.Component {
    private demos: typeof CameraRot[] = [CameraRot];

    render() {
        let cssStyle: React.CSSProperties = { width: "100%", height: "100%", position: "fixed" };
        return (
            <div >
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: "100%", width: "100%", position: "absolute" }}>
                    <TabPane tab={CameraRot.title} key={CameraRot.title}>
                        <div style={cssStyle}>
                            <CameraRot />
                        </div>
                    </TabPane>
                    <TabPane tab={Adjust3dtilesHeight.title} key={Adjust3dtilesHeight.title}>
                        <div style={cssStyle}>
                            <Adjust3dtilesHeight />
                        </div>
                    </TabPane>
                    <TabPane tab={CustomeGeometry.title} key={CustomeGeometry.title}>
                        <div style={cssStyle}>
                            <CustomeGeometry />
                        </div>
                    </TabPane>
                    <TabPane tab={CustomeRiver.title} key={CustomeRiver.title}>
                        <div style={cssStyle}>
                            <CustomeRiver />
                        </div>
                    </TabPane>
                    <TabPane tab={Load3dtiles.title} key={Load3dtiles.title}>
                        <div style={cssStyle}>
                            <Load3dtiles />
                        </div>
                    </TabPane>
                    <TabPane tab={MutilplyPick.title} key={MutilplyPick.title}>
                        <div style={cssStyle}>
                            <MutilplyPick />
                        </div>
                    </TabPane>
                    <TabPane tab={UpdateInstancesAttribute.title} key={UpdateInstancesAttribute.title}>
                        <div style={cssStyle}>
                            <UpdateInstancesAttribute />
                        </div>
                    </TabPane>
                    {/* {
                        this.demos.map((item, index) => {
                            return (
                                <TabPane tab={(item as any).title} key={index.toString()}>
                                    <div style={cssStyle}>
                                        <item />
                                    </div>
                                </TabPane>
                            )
                        })
                    } */}
                </Tabs>

            </div>
        );
    }
}