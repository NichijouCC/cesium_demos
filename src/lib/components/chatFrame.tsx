import React from "react";
import './chatBox.scss'

export enum ChatLocationEnum {
    LEFT = "left",
    BOTTOM = "bottom"
}

export class ChatBox extends React.Component<{ text: string, location?: ChatLocationEnum }> {
    render() {
        return (
            <div className={`chat-frame ${this.props.location ?? "left"}`} >
                <span>{this.props.text}</span>
            </div>)
    }
}