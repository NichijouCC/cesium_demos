import React from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { demosInfo } from "@/router/routes";

export class LeftMenu extends React.Component {
    render() {
        return (<div style={{ height: '100%', backgroundColor: '#2B2C30' }}>
            {/* <div className="main-logo" style={{ textAlign: "center" }}>
                <span>
                    <img src={Logo} alt="logo" style={{ width: "80%", height: "10%", marginTop: '24px', }} />
                </span>
            </div> */}
            <Menu defaultSelectedKeys={["0"]} defaultOpenKeys={['sub1']} mode="inline" theme="dark" style={{ backgroundColor: '#2B2C30' }}>
                {
                    demosInfo.map(item => {
                        return (
                            <Menu.Item key={item.path}>
                                <Link to={item.path}>{item.title}</Link>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        </div>);
    }
}
