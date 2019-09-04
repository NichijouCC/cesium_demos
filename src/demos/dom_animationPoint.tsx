import React from "react";
import { CesiumMap } from "../lib/map";
import { DomAnimationPoint } from "../lib/components/domAnimationPoint";

export class Dom_animationPoint extends React.Component {
    static title = "点扩散";
    state = {
        viewer: null
    }
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={Dom_animationPoint.title} onViewerLoaded={(viewer) => { this.setState({ viewer: viewer }) }} />
                {
                    this.state.viewer ? <DomAnimationPoint viewer={this.state.viewer} worldPos={Cesium.Cartesian3.fromDegrees(121, 31, 0)} /> : null
                }
            </React.Fragment>

        )
    }
}