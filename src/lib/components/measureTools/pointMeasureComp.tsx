import React from "react";
import { PointTool, PointMeasureHandler } from "./single/pointTool";
import { message, Switch } from "antd";
import DomTagInfo, { AlignXPosEnum, AlignYPosEnum } from "../domTag";
import { ChatBox, ChatLocationEnum } from "../chatFrame";
import './measureTool.scss'
import { randomChar } from "./single/measureTool";

interface Iprops {
    viewer: Cesium.Viewer,
    showUI?: boolean,
    showSwitch?: boolean,
    onMeasureEnd?: (point: PointMeasureHandler) => void
}
export class PointMeasureComp extends React.Component<Iprops> implements ImeasureComp {
    state = {
        beActived: false,
        tagText: null,
    }
    ins: PointTool;
    componentDidMount() {
        this.ins = new PointTool(this.props.viewer);
        this.ins.onStateChange.addEventListener((actived) => {
            if (actived) this.setState({ tagText: "左单击-完成绘制" });
        })
        this.ins.onEndMeasure.addEventListener((result: PointMeasureHandler) => {
            if (this.props.onMeasureEnd) this.props.onMeasureEnd(result);
            let cargo = Cesium.Cartographic.fromCartesian(result.samplePoint.pos);
            let gps = [cargo.longitude * 180 / Math.PI, cargo.latitude * 180 / Math.PI, cargo.height];

            result.tag = this.props.viewer.entities.add({
                position: result.samplePoint.pos.clone(),
                label: {
                    text: `点_${randomChar()}：${gps[0].toFixed(2)},${gps[1].toFixed(2)},${gps[2].toFixed(2)}`,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    font: '15px monospace',
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    pixelOffset: new Cesium.Cartesian2(10, 0),
                    showBackground: true,
                    backgroundPadding: new Cesium.Cartesian2(15, 5),
                } as any
            });

        })
    }

    render() {
        return (<React.Fragment>
            {
                this.state.beActived ? (
                    <DomTagInfo viewer={this.props.viewer} trackCursor={true} alignx={AlignXPosEnum.CENTER} aligny={AlignYPosEnum.TOP}>
                        <ChatBox location={ChatLocationEnum.BOTTOM} text={this.state.tagText}></ChatBox>
                    </DomTagInfo>
                ) : null
            }
            {
                this.props.showSwitch && <div className='volume-measure' style={{ display: this.props.showUI != false ? "block" : 'none' }}>
                    <div className="measure-options">
                        <div>测量开关：</div>
                        <Switch defaultChecked={false} checked={this.state.beActived} onChange={this.setToolState} />
                    </div>
                </div>
            }

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

export interface ImeasureComp {
    setToolState: (checked: boolean) => void;
}