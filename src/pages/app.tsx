import React from "react";
import { LeftMenu } from "./components/LeftMenu";
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