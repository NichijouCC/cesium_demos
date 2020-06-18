import React from "react";
import './chatFrame.scss'
export class ChatFrame extends React.Component<{ text: string }> {
    render() {
        return (
            <div className='chat-frame'>
                <span>{this.props.text}</span>
            </div>)
    }
}