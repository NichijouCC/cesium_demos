import React from "react";
import { VolumeTool, VolumMeasureHandler } from "./single/volumeTool";
import { message, Switch, Slider } from "antd";
import { DomTagInfo } from "../domTag";
import { ChatBox } from "../chatFrame";
import { IMeasureComp } from "./pointMeasureComp";

import './measureTool.css'
import { MeasureStateEnum } from "./single/measureTool";


interface Iprops {
    viewer: Cesium.Viewer,
    showUI?: boolean,
    showSwitch?: boolean,
    onMeasureEnd?: (result: VolumMeasureHandler) => void
}

interface Istate {
    basePlaneHeight: number,
    disable: boolean,
    beActived: boolean,
    tagText: string,
    sliderValue: number,
    sliderDetailValue: number
}

export class VolumeMeasureComp extends React.Component<Iprops, Istate> implements IMeasureComp {

    state = {
        basePlaneHeight: 0,
        disable: false,
        beActived: false,
        tagText: null,
        sliderValue: 0,
        sliderDetailValue: 0
    }
    ins: VolumeTool;
    currentResult: VolumMeasureHandler;
    componentDidMount() {
        this.ins = new VolumeTool(this.props.viewer);

        this.ins.onStateChange.addEventListener((actived) => {
            this.setState({ disable: true });
            if (actived) this.setState({ tagText: "左单击-开始绘制" });
        });

        this.ins.onSampleChange.addEventListener((data: VolumMeasureHandler) => {
            let index = data.samplePoints.length;
            if (data.state == MeasureStateEnum.COMPUING) {
                this.setState({ tagText: "计算中...." });
            } else {
                if (index == 0) this.setState({ tagText: "左单击-开始绘制" });
                if (index == 1) this.setState({ tagText: "左单击-增加点 右单击删除点" });
                if (index == 2) this.setState({ tagText: "左单击-增加点 右单击删除点 \n左双击结束绘制" })
            }
        })

        this.ins.onEndMeasure.addEventListener((data: VolumMeasureHandler) => {
            if (this.props.onMeasureEnd) this.props.onMeasureEnd(data);

            this.setState({ disable: false });
            this.setState({ basePlaneHeight: Cesium.Cartographic.fromCartesian(data.centerPos).height });
            data.tag = this.props.viewer.entities.add({
                position: data.centerPos,
                label: {
                    text: `挖方体积：${data.result.cutVolume.toFixed(2)} m³\n填方体积：${data.result.fillVolume.toFixed(2)} m³\n基准面海拔高度：${(data.options.adjustheight + data.options.basePlanHeight).toFixed(2)} m`,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    scale: 0.4,
                } as any
            });

            this.currentResult = data;

        });
    }

    componentWillUnmount() {
        this.ins?.disActive();
    }

    private recomputeVlume() {
        let adjustHeight = this.state.sliderValue + this.state.sliderDetailValue;
        if (this.currentResult) {
            this.currentResult.options.adjustheight = adjustHeight;
            this.currentResult.endSample();
            let { tag, result, options } = this.currentResult;
            tag.label.text = `挖方体积：${result.cutVolume.toFixed(2)} m³\n填方体积：${result.fillVolume.toFixed(2)} m³\n基准面海拔高度：${(options.adjustheight + options.basePlanHeight).toFixed(2)} m` as any;
        }
    }

    setToolState = (checked: boolean) => {
        this.setState({ beActived: checked });
        if (checked) {
            this.ins.active();
            this.setState({ sliderValue: 0 });
        } else {
            this.ins.disActive();
        }
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
                            <Switch disabled={this.state.disable} defaultChecked={false} checked={this.state.beActived} onChange={this.setToolState} />
                        </div>
                    }
                    <div>{`基准面海拔高度：${(this.state.basePlaneHeight + this.state.sliderValue + this.state.sliderDetailValue).toFixed(2)}`}</div>
                    <div className="measure-options">
                        <div>{`调整高度:${this.state.sliderValue + this.state.sliderDetailValue}`}</div>
                    </div>
                    <Slider
                        value={this.state.sliderValue}
                        style={{ width: "300px" }}
                        defaultValue={0} min={-50} max={50}
                        onChange={(value) => {
                            this.setState({ sliderValue: value as any }, () => { this.recomputeVlume() });
                        }}
                        disabled={this.state.disable} />
                    <Slider
                        min={-1}
                        max={1}
                        step={0.01}
                        style={{ width: "300px" }}
                        value={this.state.sliderDetailValue}
                        onChange={(value) => {
                            this.setState({ sliderDetailValue: value as any }, () => { this.recomputeVlume() });
                        }}
                        disabled={this.state.disable}
                    />
                </div>
            </React.Fragment>
        )
    }
}