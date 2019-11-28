import React from "react";
import { Layout } from "antd";
import { LeftMenu } from "./components/LeftMenu";
import { Demos } from "@/router/routes";
const { Sider, Header, Content, Footer } = Layout
export class DeafaultPage extends React.Component {
    render() {
        return (
            <Layout style={{ height: "100%", minWidth: "1280px" }}>
                <Sider
                    width="100"
                    style={{ backgroundColor: "rgba(0,0,0,0)" }}
                >
                    <LeftMenu />
                </Sider>
                <Layout>
                    {/* <Header style={{ background: '#fff', padding: '0 16px' }}> */}
                    {/* <HeaderBar collapsed={this.state.collapsed} onToggle={this.toggle} /> */}
                    {/* </Header> */}
                    <Content style={{ minHeight: "fit-content" }}>
                        <Demos />
                    </Content>
                    <Footer style={{ textAlign: 'center', }}> Copyright©2019 上海伯镭智能科技有限公司所有| 沪ICP备17037264号</Footer>
                </Layout>
            </Layout>
        )
    }
}

