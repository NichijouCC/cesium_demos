import React from "react";
import { CesiumMap } from "@/lib/map";
import { CommandRobot } from "../../../lib/commandRobot";

export default class CommandRobotDemo extends React.Component {
    handleViewerLoaded(viewer: Cesium.Viewer) {
        let robot = new CommandRobot(viewer, { url: "./models/cesium_Air.glb", pos: Cesium.Cartesian3.fromDegrees(121, 31, 10) });

        viewer.flyTo(robot.ins, {
            offset: new Cesium.HeadingPitchRange(0, -45 * Math.PI / 180, 500)
        });
        let handler = this.clickLand(viewer, (clickPos) => {
            robot.sendTargetPos({ pos: clickPos });
        });
        this.componentWillUnmount = () => {
            handler.destroy();
        }
    }
    private clickLand(viewer: Cesium.Viewer, callback: (clickPos: Cesium.Cartesian3) => void) {
        let rayHandler = new Cesium.ScreenSpaceEventHandler();
        rayHandler.setInputAction((event) => {
            let pos = viewer.scene.pickPosition(event.position);
            if (pos) {
                callback(pos);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return rayHandler;
    }

    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                <div style={{ position: "absolute", top: "10px", right: "100px", zIndex: 99, backgroundColor: "#dd4f" }}>
                    <div>==操作介绍==</div>
                    <div>移动：鼠标左键点击地图</div>
                </div>
            </React.Fragment>
        )
    }

}

