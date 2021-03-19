import React from "react";
import { Demos } from "../router/routes";
import { LeftMenu } from "./comps/leftMenu";

export class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Demos />
                <LeftMenu />
            </React.Fragment>
        )
    }
}