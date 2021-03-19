import React from "react";
import { AreaTag } from "../../../lib/components/areaTag";
import { CesiumMap } from "../../../lib/map";

export default class AreaTagDemo extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    private handleViewerLoaded(viewer: Cesium.Viewer) {
        let tag = AreaTag.create(viewer, { pos: Cesium.Cartesian3.fromDegrees(121, 31, 0), rotSpeed: [1.0, -1.0], circleSize: 20 });
        viewer.zoomTo([tag.inside, tag.outside]);
    }
}