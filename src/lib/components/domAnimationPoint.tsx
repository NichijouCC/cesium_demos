import DomTagInfo from "./domTag";
import React from "react";

require("./domAnimationPoint.css");
export class DomAnimationPoint extends DomTagInfo {
    render() {
        return (
            <div className="content" >
                <div className="one" ref={element => this.element = element}>
                    <p></p>
                    <span></span>
                </div>
            </div>
        );
    }
}