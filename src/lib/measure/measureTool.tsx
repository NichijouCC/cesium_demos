import { PointGoup, PointGoupTypeEnum } from "../pointEditorTool";
import { message } from "antd";
import { PointTool } from "./pointTool";
import { LineTool } from "./lineTool";
import { VolumeTool } from "./volumeTool";
export enum ToolEnum {
    POINT = "点测量",
    LINE = "线段测量",
    VOLUME = "体积测量"
}
export interface ImeasureTool {
    type: ToolEnum;
    active: () => void;
    disActive: () => void;
    onMeasureEnd: (data: any) => void;
}


export function samplePoint(viewer, position: Cesium.Cartesian2) {
    let ray = viewer.camera.getPickRay(position);
    let picked = viewer.scene.pickFromRay(ray, []);
    if (picked && picked.position != null) {
        let clampPos = viewer.scene.clampToHeight(picked.position);
        return clampPos;
    }
    return null;
}

export function createMeasureTool(viewer: Cesium.Viewer, type: ToolEnum): ImeasureTool {
    if (type == ToolEnum.POINT) {
        return new PointTool(viewer);
    } else if (type == ToolEnum.LINE) {
        return new LineTool(viewer);
    } else if (type == ToolEnum.VOLUME) {
        return new VolumeTool(viewer);
    }
}