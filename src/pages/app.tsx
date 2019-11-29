import React from "react";
import { LeftMenu } from "./components/LeftMenu";
import { Demos } from "@/router/routes";
import { CesiumMap } from "@/lib/map";
export class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CesiumMap ref="cesiumMap" setUp={false} />
                <Demos />
                <LeftMenu />
            </React.Fragment>
        )
    }


}