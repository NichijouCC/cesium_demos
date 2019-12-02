import React from "react";
import { CesiumMap } from "../../lib/map";
import DomTagInfo from "../../lib/components/domTag";

export default class Dom_tagInfo extends React.Component {
    static title = "物体标签";
    state = {
        viewer: null
    }

    componentDidMount() {
        CesiumMap.ins.then((ins) => {
            this.handleViewerLoaded(ins.viewer);
        });
    }
    handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer })
    }

    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ? <DomTagInfo viewer={this.state.viewer} worldPos={Cesium.Cartesian3.fromDegrees(121, 31, 0)} text={"xxx标签"} /> : null
                }
            </React.Fragment>
        )
    }
}