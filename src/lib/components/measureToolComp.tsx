import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { ImeasureTool, ToolEnum, PointTool, LineTool, VolumeTool } from "../measureTool";


export function GroupsMeasureTool(props: { viewer: Cesium.Viewer, style: React.CSSProperties }) {
    let [tools, setTools] = useState<{ [key in ToolEnum]?: ImeasureTool }>({});
    let [choosedType, setChooseType] = useState<ToolEnum>(null);
    useEffect(() => {

        let preparedTools = {};
        [ToolEnum.POINT, ToolEnum.LINE, ToolEnum.VOLUME].forEach(item => {
            let newTool = createMeasureTool(props.viewer, item);
            newTool.onMeasureEnd = (data) => {
                message.success(`测量：${data.toString()}`);
            }
            preparedTools[item] = newTool;
        })
        setTools(preparedTools);
    }, []);

    let clickTool = (type: ToolEnum) => {
        if (choosedType != null) {
            if (choosedType == type) {
                tools[choosedType].disActive();
                setChooseType(null);
            } else {
                tools[choosedType].disActive();
                tools[type].active();
                setChooseType(type);
            }
        } else {
            tools[type].active();
            setChooseType(type);
        }
    }

    return (
        <div style={props.style}>
            {
                Object.keys(tools).map(item => <div
                    key={item}
                    onClick={() => clickTool(item as any)}
                    style={{ backgroundColor: choosedType == item ? "green" : "gray" }}
                >{item}</div>)
            }
        </div>)
}


export class SingleMeasureTool extends React.Component<{ viewer: Cesium.Viewer, type: ToolEnum, onclick?: () => void }>{
    ins: ImeasureTool;
    componentDidMount() {
        let newTool: ImeasureTool;
        if (this.props.type == ToolEnum.POINT) {
            newTool = new PointTool(this.props.viewer);
        } else if (this.props.type == ToolEnum.LINE) {
            newTool = new LineTool(this.props.viewer);
        } else if (this.props.type == ToolEnum.VOLUME) {
            newTool = new VolumeTool(this.props.viewer);
        }
        if (newTool) {
            newTool.onMeasureEnd = (data) => {
                message.success(`测量：${data.toString()}`);
            };
        }
        this.ins = newTool;
    }
    render() {
        return <div style={{ padding: "4px" }} onClick={() => { this.props.onclick(); }}>{this.props.type}</div>
    }
};

export function createMeasureTool(viewer: Cesium.Viewer, type: ToolEnum) {
    if (type == ToolEnum.POINT) {
        return new PointTool(viewer);
    } else if (type == ToolEnum.LINE) {
        return new LineTool(viewer);
    } else if (type == ToolEnum.VOLUME) {
        return new VolumeTool(viewer);
    }
}
