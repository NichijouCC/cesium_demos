import React from "react";
import pin from './images/pin.png'
import path from './images/path.png'
import cubage from './images/cubage.png'
import del from './images/del.png'

import './groupTool.scss'
import { PointMeasureComp } from "../pointMeasureComp";
import { LineMeasureComp } from "../lineMeasureComp";
import { VolumeMeasureComp } from "../volumeMeasureComp";
import { ToolEnum } from "@/lib/measure/measureTool";

type toolTypes = ToolEnum | "删除"

export default class MeasureGroupTool extends React.Component<{ viewer: Cesium.Viewer }, { activeTool: toolTypes }> {

    state = {
        activeTool: null
    }
    pointComp = React.createRef<PointMeasureComp>();
    lineComp = React.createRef<LineMeasureComp>();
    volumeComp = React.createRef<VolumeMeasureComp>();

    private chooseTool = (type: toolTypes) => {
        this.setState({ activeTool: type });
        switch (type) {
            case ToolEnum.POINT:
                this.pointComp.current.setToolState(true);
                break;
            case ToolEnum.LINE:
                this.lineComp.current.setToolState(true);
                break;
            case ToolEnum.VOLUME:
                this.volumeComp.current.setToolState(true);
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className='measure-group-tool'>
                    <div className='toolItem' style={{ backgroundImage: `url(${pin})` }} onClick={() => this.chooseTool(ToolEnum.POINT)}></div>
                    <div className="cuttLine"></div>
                    <div className='toolItem' style={{ backgroundImage: `url(${path})` }} onClick={() => this.chooseTool(ToolEnum.LINE)}></div>
                    <div className="cuttLine"></div>
                    <div className='toolItem' style={{ backgroundImage: `url(${cubage})` }} onClick={() => this.chooseTool(ToolEnum.VOLUME)}></div>
                    <div className="cuttLine"></div>
                    <div className='toolItem' style={{ backgroundImage: `url(${del})` }} onClick={() => this.chooseTool('删除')}></div>
                </div>
                <PointMeasureComp ref={this.pointComp} viewer={this.props.viewer} show={this.state.activeTool == ToolEnum.POINT} />
                <LineMeasureComp ref={this.lineComp} viewer={this.props.viewer} show={this.state.activeTool == ToolEnum.LINE} />
                <VolumeMeasureComp ref={this.volumeComp} viewer={this.props.viewer} show={this.state.activeTool == ToolEnum.VOLUME} />
            </React.Fragment>
        )
    }
}