import React from "react";

import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import './main.css'
import { App } from "./pages/app";


export class Main extends React.Component {
    render() {
        return (
            <ConfigProvider locale={zh_CN}>
                <App></App>
            </ConfigProvider >
        );
    }
}

