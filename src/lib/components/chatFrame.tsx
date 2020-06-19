import React from "react";
import './chatFrame.scss'

export enum ChatLocationEnum {
    LEFT = "left",
    BOTTOM = "bottom"
}

export class ChatFrame extends React.Component<{ text: string, location?: ChatLocationEnum }> {
    render() {
        return (
            <div className={`chat-frame ${this.props.location ?? "left"}`} >
                <span>{this.props.text}</span>
            </div>)
    }
}