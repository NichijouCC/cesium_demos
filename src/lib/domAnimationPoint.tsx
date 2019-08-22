import DomTagInfo from "./domTag";
import React from "react";

require("./domAnimationPoint.css");
export class DomAnimationPoint extends DomTagInfo {
    render() {
        let color = "red";
        let pointcss = { border: color + " solid" };
        let css = { boxShadow: "0px 0px 1px " + color };
        return (
            <div className="content" >
                <div className="one" style={pointcss} ref={element => this.element = element}><p style={css}></p><span style={css} ></span></div>
            </div>
        );
    }
}