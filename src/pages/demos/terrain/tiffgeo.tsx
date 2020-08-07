import React from "react";
import { CesiumMap } from "@/lib";

export class TiffGeo extends React.Component {


    private mapref: React.RefObject<CesiumMap>;
    constructor(props) {
        super(props);
        this.mapref = React.createRef<CesiumMap>();
    }

    componentDidMount() {
        this.mapref.current.viewer

    }

    render() {
        return (<CesiumMap ref={this.mapref} />)
    }
}