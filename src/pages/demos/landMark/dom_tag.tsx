import React from "react";
import { CesiumMap } from "../../../lib/map";
import DomTagInfo from "../../../lib/components/domTag";

export default class Dom_tagInfo extends React.Component {
    static title = "物体标签";
    state = {
        viewer: null
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
        let pointArr = Cesium.Cartesian3.fromDegreesArray([121, 31, 121.2, 31.1, 121.5, 31.2]);
        viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
        this.pointArr = pointArr;
    }
    private pointArr: Cesium.Cartesian3[];
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ? this.pointArr.map((item, index) => <DomTagInfo key={index} viewer={this.state.viewer} worldPos={item} text={"xxx标签"} />) : null
                }
            </React.Fragment>
        )
    }
}