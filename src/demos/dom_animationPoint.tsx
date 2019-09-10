import React from "react";
import { CesiumMap } from "../lib/map";
import { DomAnimationPoint } from "../lib/components/domAnimationPoint";

export class Dom_animationPoint extends React.Component {
    static title = "点扩散";
    state = {
        viewer: null
    }
    private pointArr: Cesium.Cartesian3[];
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={Dom_animationPoint.title} onViewerLoaded={(viewer) => {

                    this.setState({ viewer: viewer });
                    let pointArr = Cesium.Cartesian3.fromDegreesArray([121, 31, 121.2, 31.1, 121.5, 31.2]);
                    viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
                    this.pointArr = pointArr;
                }} />
                {
                    this.state.viewer ?
                        this.pointArr.map((item, index) => {
                            return (
                                <DomAnimationPoint viewer={this.state.viewer} worldPos={item} />
                            )
                        }) : null
                }
            </React.Fragment>

        )
    }
}