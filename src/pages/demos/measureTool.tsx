import React, { useState, useEffect } from "react";
import { CesiumMap } from "@/lib";
import { GroupsMeasureTool } from "@/lib/components/measureToolComp";

export default class MeasureToolDeme extends React.Component {
    state = {
        viewer: null
    }
    render() {
        return (
            <React.Fragment>
                <CesiumMap onViewerLoaded={(viewer) => { this.setState({ viewer }); }} />
                {
                    this.state.viewer ? <GroupsMeasureTool
                        viewer={this.state.viewer}
                        style={{
                            position: 'absolute',
                            right: 10, top: 0,
                            backgroundColor: 'gray',
                            width: 'fit-content',

                        }}
                    /> : null
                }
            </React.Fragment>
        )
    }
}
