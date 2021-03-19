import React from "react";

import './groupTool.css'
import { PointMeasureComp, IMeasureComp } from "./pointMeasureComp";
import { LineMeasureComp } from "./lineMeasureComp";
import { VolumeMeasureComp } from "./volumeMeasureComp";
import { ToolEnum } from "@/lib/components/measureTools/single/measureTool";

import point_unselected from './images/point/unselected.svg'
import point_selected from './images/point/selected.svg'
import line_unselected from './images/line/unselected.svg'
import line_selected from './images/line/selected.svg'
import volume_unselected from './images/volume/unselected.svg'
import volume_selected from './images/volume/selected.svg'
import { Tooltip } from "antd";

export default class GroupMeasureComp extends React.Component<{
    viewer: Cesium.Viewer,
    onMeasureEnd?: (type: ToolEnum, data: any) => void
}, { choosedTool: ToolEnum }> {

    state = {
        choosedTool: null
    }
    private pointComp = React.createRef<PointMeasureComp>();
    private lineComp = React.createRef<LineMeasureComp>();
    private volumeComp = React.createRef<VolumeMeasureComp>();
    private groupToolConfig: { [type: string]: { type: ToolEnum, url: string, selected: string, comp: React.RefObject<IMeasureComp> } } = {};;

    constructor(props) {
        super(props);
        this.groupToolConfig[ToolEnum.POINT] = { type: ToolEnum.POINT, url: point_unselected, selected: point_selected, comp: this.pointComp };
        this.groupToolConfig[ToolEnum.LINE] = { type: ToolEnum.LINE, url: line_unselected, selected: line_selected, comp: this.lineComp };
        this.groupToolConfig[ToolEnum.VOLUME] = { type: ToolEnum.VOLUME, url: volume_unselected, selected: volume_selected, comp: this.volumeComp };

    }
    private chooseTool = (type: ToolEnum) => {
        if (type == this.state.choosedTool) {
            if (type != null) {
                this.groupToolConfig[this.state.choosedTool].comp.current.setToolState(false);
            }
            this.setState({ choosedTool: null });
        } else {
            if (this.state.choosedTool != null) {
                this.groupToolConfig[this.state.choosedTool].comp.current.setToolState(false);
            }
            this.setState({ choosedTool: type }, () => {
                if (type != null) {
                    this.groupToolConfig[this.state.choosedTool].comp.current.setToolState(true);
                }
            });

        }
    }

    private onMeasureEnd = (type: ToolEnum, data: any) => {
        if (this.state.choosedTool == type) this.chooseTool(null);

        if (this.props.onMeasureEnd) {
            this.props.onMeasureEnd(type, data)
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className='measure-group-tool'>
                    {
                        Object.values(this.groupToolConfig).map(item => {
                            return (
                                <React.Fragment key={item.type} >
                                    <Tooltip key={item.type} placement="leftBottom" title={item.type}>
                                        <div className='toolItem'
                                            style={{ backgroundImage: `url(${this.state.choosedTool == item.type ? item.selected : item.url})` }}
                                            onClick={() => this.chooseTool(item.type)}></div>
                                    </Tooltip>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <PointMeasureComp
                    ref={this.pointComp}
                    viewer={this.props.viewer}
                    showUI={this.state.choosedTool == ToolEnum.POINT}
                    onMeasureEnd={(data) => { this.onMeasureEnd(ToolEnum.POINT, data) }}
                />
                <LineMeasureComp
                    ref={this.lineComp}
                    viewer={this.props.viewer}
                    showUI={this.state.choosedTool == ToolEnum.LINE}
                    onMeasureEnd={(data) => { this.onMeasureEnd(ToolEnum.LINE, data) }}
                />
                <VolumeMeasureComp
                    ref={this.volumeComp}
                    viewer={this.props.viewer}
                    showUI={this.state.choosedTool == ToolEnum.VOLUME || this.state.choosedTool == null}
                    onMeasureEnd={(data) => { this.onMeasureEnd(ToolEnum.VOLUME, data) }}
                />
            </React.Fragment>
        )
    }
}