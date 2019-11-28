import React from "react";

import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import './main.css'
import { DeafaultPage } from "./pages/deaultPage";


export class Main extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <ConfigProvider locale={zh_CN}>
                <DeafaultPage></DeafaultPage>
            </ConfigProvider >
        );
    }
}

