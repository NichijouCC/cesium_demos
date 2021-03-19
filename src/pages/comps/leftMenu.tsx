import React from "react";
import { Menu, Button } from "antd";
import { Link, HashRouter } from "react-router-dom";
import { demosInfo, IRouteInfo } from "../../router/routes";
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';

export class LeftMenu extends React.Component {
    state = {
        collapsed: false,
    };
    renderRoute = (item: IRouteInfo, parentPath: string = "") => {
        let currentPath = parentPath + item.path;
        if (item.childs != null) {
            return (
                <Menu.SubMenu
                    key={item.title}
                    title={
                        <span>
                            <span>
                                {item.title}
                            </span>
                        </span>}>
                    {
                        item.childs.map(chid => this.renderRoute(chid, currentPath))
                    }
                </Menu.SubMenu>
            )
        } else {
            return (
                <Menu.Item key={currentPath}>
                    <Link to={currentPath}>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
            )
        }
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <div style={{ height: '100%', backgroundColor: '#2B2C30', position: "absolute", top: "0" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                    <Button type="primary" onClick={this.toggleCollapsed} style={{ margin: 16 }}>
                        {this.state.collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                    </Button>
                </div>
                <HashRouter>
                    <Menu
                        defaultSelectedKeys={["0"]}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="dark"
                        style={{ backgroundColor: '#2B2C30' }}
                        inlineCollapsed={this.state.collapsed}
                    >
                        {
                            demosInfo.map(item => this.renderRoute(item as any))
                        }
                    </Menu>
                </HashRouter>
            </div>);
    }
}
