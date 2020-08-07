import { ImeasureTool, ToolEnum } from "./measureTool";

export class AreaTool implements ImeasureTool {
    type: ToolEnum;
    active: () => void;
    disActive: () => void;
    onMeasureEnd: (...data: any) => void;

    static compute(posArr: Cesium.Cartesian3[]) {
        let startPos = posArr[0];
        let temptLeft = new Cesium.Cartesian3();
        let temptRight = new Cesium.Cartesian3();
        let totalArea = 0;
        for (let i = 1; i < posArr.length - 1; i++) {
            let leftDir = Cesium.Cartesian3.subtract(posArr[i], startPos, temptLeft);
            let rightDir = Cesium.Cartesian3.subtract(posArr[i + 1], startPos, temptRight);
            let crossValue = Cesium.Cartesian3.cross(leftDir, rightDir, new Cesium.Cartesian3());
            totalArea += Cesium.Cartesian3.magnitude(crossValue) / 2;
        }
        return totalArea;
    }
}