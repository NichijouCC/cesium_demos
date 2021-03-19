import { DebuffAction } from "@mtgoo/ctool";
import React, { useEffect, useState } from "react";
import { IAppStore } from "./iapp";

/**
 * function组件方便使用APP_STORE
 */
export function useAppStore<T extends IAppStore, P extends keyof T>(attName: P): T[P] {
    let [att, setAtt] = useState(APP_STORE[attName as any]);
    useEffect(() => {
        let handler = (ev: { newValue: any, oldValue: any }) => { setAtt(ev.newValue); }
        APP_STORE.on(attName as string, handler);
        return () => {
            APP_STORE.off(attName as string, handler)
        }
    }, []);
    return att
}
/**
 * class组件方便使用APP_STORE
 */
export function mapAppStoreToProps(atts: string[]) {
    return (Comp: Function) => {
        return class extends React.Component {
            private _debuffAction: DebuffAction;
            componentDidMount() {
                this._debuffAction = DebuffAction.create();
                atts.forEach(item => {
                    let handler = (ev: { newValue: any, oldValue: any }) => {
                        let attState = {};
                        attState[item] = ev.newValue;
                        this.setState(attState);
                    };
                    APP_STORE.on(item, handler);
                    this._debuffAction.appendDebuff(() => {
                        APP_STORE.off(item, handler);
                    })
                });
            }
            componentWillUnmount() {
                this._debuffAction.dispose();
            }
            render() {
                let newProps = { ...this.props, ...this.state };
                return (<Comp {...newProps} />)
            }
        } as any
    }
}