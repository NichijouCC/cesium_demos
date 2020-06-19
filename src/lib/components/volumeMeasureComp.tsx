import React from "react";
import { VolumeTool, IvolumeReusult } from "../measure/volumeTool";
import { message, Switch, Slider } from "antd";
import DomTagInfo, { AlignXPosEnum, AlignYPosEnum } from "./domTag";
import { ChatFrame } from "./chatFrame";

import './measureTool.scss'

export class VolumeMeasureComp extends React.Component<{ viewer: Cesium.Viewer, show?: boolean }> {

    state = {
        basePlaneHeight: 0,
        beActived: false,
        tagText: null,
        sliderValue: 0
    }
    ins: VolumeTool;
    private lastMeasureData: IvolumeReusult;
    componentDidMount() {
        this.ins = new VolumeTool(this.props.viewer);
        // this.ins.active();
        this.ins.onMeasureEnd = (data) => {
            message.warn(`挖方体积：${data.cutVolume.toFixed(2)}\n填方体积：${data.fillVolume.toFixed(2)}`, 7);
            this.lastMeasureData = data;
            this.setToolState(false);
            this.setState({ basePlaneHeight: Cesium.Cartographic.fromCartesian(data.centerPos).height });
        }

        this.ins.onPickPoint = (index) => {
            if (index == -1) this.setState({ tagText: "计算中..." });
            if (index == 0) this.setState({ tagText: "左单击-开始绘制" });
            if (index == 1) this.setState({ tagText: "左单击-增加点 右单击删除点" });
            if (index == 2) this.setState({ tagText: "左单击-增加点 右单击删除点 \n左双击结束绘制" })
        }
    }

    componentWillUnmount() {
        this.ins?.disActive();
    }

    private recomputeVlume(adjustHeight: number) {
        if (this.lastMeasureData) {
            let voume = VolumeTool.computeVolumeBySampleHeight(this.props.viewer, { ...this.lastMeasureData, adjustHeight });
            let carpos = new Cesium.Cartographic();
            this.lastMeasureData.plan.polygon.hierarchy = this.lastMeasureData.projectPosArr.map(item => {
                carpos = Cesium.Cartographic.fromCartesian(item);
                return Cesium.Cartesian3.fromRadians(carpos.longitude, carpos.latitude, carpos.height + adjustHeight);
            }) as any;
            message.warn(`挖方体积：${voume.cutVolume.toFixed(2)}\n填方体积：${voume.fillVolume.toFixed(2)}`, 4);
        }
    }

    setToolState(checked: boolean) {
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

                    <div>{`基准面高度：${(this.state.basePlaneHeight + this.state.sliderValue).toFixed(2)}`}</div>
                    <div className="measure-options">
                        <div>调整高度:</div>
                        <Slider
                            value={this.state.sliderValue}
                            style={{ width: "300px" }}
                            defaultValue={0} min={-50} max={50}
                            onChange={(value) => {
                                this.setState({ sliderValue: value });
                                this.recomputeVlume(value as number)
                            }}
                            disabled={this.state.beActived} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}