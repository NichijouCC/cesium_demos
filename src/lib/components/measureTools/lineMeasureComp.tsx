import React from "react";
import { DomTagInfo } from "../domTag";
import { ChatBox } from "../chatFrame";
import { Switch, message } from "antd";
import { LineTool, LineMeasureHandler } from "./single/lineTool";

import './measureTool.css'
import { randomChar } from "./single/measureTool";
import { IMeasureComp } from "./pointMeasureComp";

interface Iprops {
    viewer: Cesium.Viewer,
    showUI?: boolean,
    showSwitch?: boolean,
    onMeasureEnd?: (result: LineMeasureHandler) => void
}

interface Istate {
    beActived: boolean,
    tagText: string,
    brokenLine: boolean
}

export class LineMeasureComp extends React.Component<Iprops, Istate> implements IMeasureComp {
    state = {
        beActived: false,
        tagText: null,
        brokenLine: false
    }
    private ins: LineTool;
    componentDidMount() {
        this.ins = new LineTool(this.props.viewer);

        this.ins.onStateChange.addEventListener((actived) => {
            if (actived) this.setState({ tagText: "左单击-开始绘制" });
        })
        this.ins.onSampleChange.addEventListener((state: LineMeasureHandler) => {
            let pointCount = state.samplePoints.length;
            if (pointCount == 0) this.setState({ tagText: "左单击-开始绘制" });
            if (pointCount == 1) {
                if (state.options.enableBrokenLine) {
                    this.setState({ tagText: "左单击-增加点 右单击删除点" });
                } else {
                    this.setState({ tagText: "左单击-结束绘制 右单击删除点" });
                }
            };
            if (pointCount == 2 && state.options.enableBrokenLine) {
                this.setState({ tagText: "左单击-增加点 右单击删除点 \n左双击结束绘制" })
            }
        })
        this.ins.onEndMeasure.addEventListener((result: LineMeasureHandler) => {
            if (this.props.onMeasureEnd) this.props.onMeasureEnd(result);
            result.tag = this.props.viewer.entities.add({
                position: result.samplePoints[result.samplePoints.length - 1].pos.clone(),
                label: {
                    text: `线段_${randomChar()}：${result.result.toFixed(2)} m`,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    font: '15px monospace',
                    outlineWidth: 2,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    showBackground: true,
                    backgroundPadding: new Cesium.Cartesian2(15, 5),
                } as any
            });
        })
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.beActived ? (
                        <DomTagInfo viewer={this.props.viewer} trackCursor={true} alignX={"left"} alignY={"center"}>
                            <ChatBox text={this.state.tagText}></ChatBox>
                        </DomTagInfo>
                    ) : null
                }
                <div className='volume-measure' style={{ display: this.props.showUI != false ? "block" : 'none' }}>
                    {
                        this.props.showSwitch && <div className="measure-options">
                            <div>测量开关：</div>
                            <Switch defaultChecked={false} checked={this.state.beActived} onChange={this.setToolState} />
                        </div>
                    }

                    <div className="measure-options">
                        <div>连续线段：</div>
                        <Switch defaultChecked={false} checked={this.state.brokenLine} onChange={
                            (checked) => {
                                this.setState({ brokenLine: checked });
                                this.ins.measureOptions.enableBrokenLine = checked;
                            }} />
                    </div>
                </div>
            </React.Fragment>)
    }
    setToolState = (checked: boolean) => {
        this.setState({ beActived: checked });
        if (checked) {
            this.ins.active();
        } else {
            this.ins.disActive();
        }
    }
}

