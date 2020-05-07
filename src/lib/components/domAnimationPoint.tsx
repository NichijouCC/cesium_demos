import DomTagInfo from "./domTag";
import React from "react";

import "./domAnimationPoint.scss";
export class DomAnimationPoint extends DomTagInfo {
    render() {
        return (
            <div className="content" >
                <div className="one" ref={element => this.element = element}>
                    <p></p>
                    <span></span>
                    <div className="text">{this.props.text}</div>
                </div>
            </div>
        );
    }
}