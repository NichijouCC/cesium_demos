import React, { useEffect, useState } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAppStore } from '../__internal';

/**
 * 路由验证token，跳转登录页面
 * @param props.component 目标组件，即route.component 参数
 * @param props.rest route需要各种参数&目标组件需要各种参数
 */
export function PrivateRoute<T extends RouteProps = RouteProps, P = {}>(props: P & T & { component: React.ElementType<P> }) {
    let PrivateRouteComp = MyRoute as any;
    let { component, ...rest } = props;
    return <Route {...rest} render={() => {
        return (<PrivateRouteComp {...props} />)
    }} />
}

function MyRoute<T extends RouteProps = RouteProps, P = {}>({ component, ...rest }: P & T & { component: React.ElementType<P> }) {
    let authInfo = useAppStore("authInfo");

    let Comp = component as any;
    useEffect(() => {
        //[可选] 在这调用api检查token,token无限将authInfo置为null
    })
    return authInfo?.token ? <Comp {...rest} /> : <Redirect to={{
        pathname: '/login',
        state: { from: rest.location }
    }} />
}