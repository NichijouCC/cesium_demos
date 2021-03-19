import { Route, RouteProps, Redirect } from "react-router-dom";
import React from "react";

interface ICustomAsyProps {
    checkFunc?: () => boolean;
    redirectPath?: string;
}

interface IAsyncRouteProps extends RouteProps {
    asyncComponent: () => Promise<any>;
}
export class AsyncRoute extends Route<IAsyncRouteProps & ICustomAsyProps> {
    state = {
        component: null,
    }
    private _beMount: boolean = false;
    async componentDidMount() {
        this._beMount = true;
        const { default: component } = await this.props.asyncComponent();
        if (component == null) {
            console.error("Import a wrong component for function param asyncComponent, in the asyncRoute class. Please import a default export class.");
        } else {
            if (this._beMount) {
                this.setState({ component })
            }
        }
    }
    componentWillUnmount() {
        this._beMount = false;
    }

    render() {
        if (this.props.redirectPath && this.props.checkFunc) {
            let redirectToDefault = this.props.checkFunc();
            if (redirectToDefault) {
                return <Redirect to={{
                    pathname: this.props.redirectPath,
                    state: { from: this.props.location }
                }}></Redirect>
            }
        }
        const C = this.state.component;
        return C ? <C {...this.props} /> : null
    }
}

export const CustomAsyncRoute = (_props: ICustomAsyProps) => {
    return (props: IAsyncRouteProps) => {
        return <AsyncRoute {...Object.assign(_props, props)} />;
    }
}
