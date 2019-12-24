import React from "react";
import { LeftMenu } from "./components/leftMenu";
import { Demos } from "@/router/routes";
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