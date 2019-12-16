import React from "react";
import { Menu, Button } from "antd";
import { Link, HashRouter } from "react-router-dom";
import { demosInfo, IrouteInfo } from "@/router/routes";
import SubMenu from "antd/lib/menu/SubMenu";

export class LeftMenu extends React.Component {


    renderRoute = (item: IrouteInfo, parentPath: string = "") => {
        let currentPath = parentPath + item.path;
        if (item.childs != null) {
            return (
                <SubMenu
                    key={item.title}
                    title={
                        <span>{item.title}</span>
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
                    <Link to={currentPath}>{item.title}</Link>
                </Menu.Item>
            )
        }
    }

    render() {
        return (
            <div style={{ height: '100%', width: 200, backgroundColor: '#2B2C30', position: "absolute", top: "0" }}>
                {/* <div className="main-logo" style={{ textAlign: "center" }}>
                <span>
                    <img src={Logo} alt="logo" style={{ width: "80%", height: "10%", marginTop: '24px', }} />
                </span>
                </div> */}
                <HashRouter>
                    <Menu defaultSelectedKeys={["0"]} defaultOpenKeys={['sub1']} mode="inline" theme="dark" style={{ backgroundColor: '#2B2C30' }}>
                        {
                            demosInfo.map(item => this.renderRoute(item as any))
                        }
                    </Menu>
                </HashRouter>
            </div>);
    }
}
