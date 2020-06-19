import React from "react";
import { PointTool } from "../measureTool";
import { message, Switch } from "antd";
import DomTagInfo, { AlignXPosEnum, AlignYPosEnum } from "./domTag";
import { ChatFrame, ChatLocationEnum } from "./chatFrame";

import './volumeMeasure.scss'

export class PointMeasureComp extends React.Component<{ viewer: Cesium.Viewer }> {
    state = {
        beActived: false,
        tagText: null,
    }
    ins: PointTool;
    componentDidMount() {
        this.ins = new PointTool(this.props.viewer);
        this.ins.onPickPoint = (index) => {
            if (index == 0) this.setState({ tagText: "左单击-完成绘制" });
        };

        this.ins.onMeasureEnd = (point) => {
            this.setToolState(false);
            message.warn(`测量：${point[0].toFixed(2)}, ${point[1].toFixed(2)},${point[2].toFixed(2)}`);
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.beActived ? (
                        <DomTagInfo viewer={this.props.viewer} trackCursor={true} alignx={AlignXPosEnum.CENTER} aligny={AlignYPosEnum.TOP}>
                            <ChatFrame location={ChatLocationEnum.BOTTOM} text={this.state.tagText}></ChatFrame>
                        </DomTagInfo>
                    ) : null
                }
                <div className='volume-measure'>
                    <div className="measure-options">
                        <div>测量开关：</div>
                        <Switch defaultChecked={false} checked={this.state.beActived} onChange={
                            (checked) => {
                                this.setToolState(checked);
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