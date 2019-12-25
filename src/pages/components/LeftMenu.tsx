import React from "react";
import { Menu, Button,Icon } from "antd";
import { Link, HashRouter } from "react-router-dom";
import { demosInfo, IrouteInfo } from "@/router/routes";
import SubMenu from "antd/lib/menu/SubMenu";
import { spawn } from "child_process";

export class LeftMenu extends React.Component {
    state = {
        collapsed: false,
      };

    renderRoute = (item: IrouteInfo, parentPath: string = "") => {
        let currentPath = parentPath + item.path;
        if (item.childs != null) {
            return (
                <SubMenu
                    key={item.title}
                    title={
                        <span>
                            <Icon type="global" />
                            <span>
                                {item.title}
                            </span>
                        </span>
                        
                    }
                >
                    {
                        item.childs.map(chid => this.renderRoute(chid, currentPath))
                    }
                </SubMenu>
            )
        } else {
            return (
                <Menu.Item key={currentPath}>
                    <Icon type="global" />
                    <span><Link to={currentPath}></Link>{item.title}</span>
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
                {/* <div className="main-logo" style={{ textAlign: "center" }}>
                <span>
                    <img src={Logo} alt="logo" style={{ width: "80%", height: "10%", marginTop: '24px', }} />
                </span>
                </div> */}
                <Button type="primary" onClick={this.toggleCollapsed} style={{ margin: 16 }}>
                    <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
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
