import React from "react";
import { CesiumMap } from "../lib/map";
import DomTagInfo from "../lib/components/domTag";

export class Dom_tagInfo extends React.Component {
    static title = "物体标签";
    state = {
        viewer: null
    }
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={Dom_tagInfo.title} onViewerLoaded={(viewer) => { this.setState({ viewer: viewer }) }} />
                {
                    this.state.viewer ? <DomTagInfo viewer={this.state.viewer} worldPos={Cesium.Cartesian3.fromDegrees(121, 31, 0)} text={"xxx标签"} /> : null
                }
            </React.Fragment>
        )
    }
}