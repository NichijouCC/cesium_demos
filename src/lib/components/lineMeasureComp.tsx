import React from "react";
import DomTagInfo, { AlignXPosEnum, AlignYPosEnum } from "./domTag";
import { ChatFrame } from "./chatFrame";
import { Switch, message } from "antd";
import { LineTool } from "../measure/lineTool";

import './measureTool.scss'

export class LineMeasureComp extends React.Component<{ viewer: Cesium.Viewer, show?: boolean }> {

    state = {
        beActived: false,
        tagText: null,
        brokenLine: false
    }
    ins: LineTool;
    componentDidMount() {
        this.ins = new LineTool(this.props.viewer);
        this.ins.onPickPoint = (index) => {
            if (index == 0) this.setState({ tagText: "左单击-开始绘制" });
            if (index == 1) {
                if (this.state.brokenLine) {
                    this.setState({ tagText: "左单击-增加点 右单击删除点" });
                } else {
                    this.setState({ tagText: "左单击-结束绘制 右单击删除点" });
                }
            };
            if (index == 2 && this.state.brokenLine) {
                this.setState({ tagText: "左单击-增加点 右单击删除点 \n左双击结束绘制" })
            }
        };

        this.ins.onMeasureEnd = (lens) => {
            this.setToolState(false);
            message.warn(`测量长度：${lens.toFixed(2)}`);
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.beActived ? (
                        <DomTagInfo viewer={this.props.viewer} trackCursor={true} alignx={AlignXPosEnum.LEFT} aligny={AlignYPosEnum.CENTER}>
                            <ChatFrame text={this.state.tagText}></ChatFrame>
                        </DomTagInfo>
                    ) : null
                }

                <div className='volume-measure' style={{ display: this.props.show != false ? "block" : 'none' }}>

                    <div className="measure-options">
                        <div>测量开关：</div>
                        <Switch defaultChecked={false} checked={this.state.beActived} onChange={
                            (checked) => {
                                this.setToolState(checked);
                            }} />
                    </div>
                    <div className="measure-options">
                        <div>连续线段：</div>
                        <Switch defaultChecked={false} checked={this.state.brokenLine} onChange={
                            (checked) => {
                                this.setState({ brokenLine: checked });
                                this.ins.setBrokenLine(checked);
                            }} />
                    </div>
                </div>
            </React.Fragment>)
    }
    setToolState(checked: boolean) {
        this.setState({ beActived: checked });
        if (checked) {
            this.ins.active();
        } else {
            this.ins.disActive();
        }
    }
}