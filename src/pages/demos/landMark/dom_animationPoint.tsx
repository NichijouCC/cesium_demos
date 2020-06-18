import React from "react";
import { CesiumMap } from "../../../lib/map";
import { DomAnimationPoint } from "../../../lib/components/domAnimationPoint";

export default class Dom_animationPoint extends React.Component {

    handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
        let pointArr = Cesium.Cartesian3.fromDegreesArray([121, 31, 121.2, 31.1, 121.5, 31.2]);
        viewer.scene.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints(pointArr));
        this.pointArr = pointArr;
    }

    state = {
        viewer: null
    }
    private pointArr: Cesium.Cartesian3[];
    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ?
                        this.pointArr.map((item, index) => {
                            return (
                                <DomAnimationPoint key={index} viewer={this.state.viewer} trackPos={item} />
                            )
                        }) : null
                }
            </React.Fragment>
        )
    }
}