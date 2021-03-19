import React, { useEffect, useState, ComponentType } from "react";

/**
 * 懒加载组件,配合import使用
 * @param props.target 目标组件(界面)
 * @param props.targetProps (可选)目标组件需要的props
 * @param props.onLoading (可选)加载目标组件过程中需要显示的JSX.Element
 * 
 * @example
 * ```
 * ...
 * <LazyComp target={() => import('./needLazyLoad')} />
 * ...
 * ```
 * 
 */
export function LazyComp<T = {}>(
    props: {
        target: () => Promise<{ default: ComponentType<T> }>,
        targetProps?: T,
        onLoading?: JSX.Element
    }): JSX.Element {
    let [Comp, setComp] = useState<{ default: ComponentType<T> }>(null);

    useEffect(() => {
        (async () => {
            const comp = await props.target();
            if (comp.default != null) {
                setComp(comp);
            } else {
                throw new Error(" 'target' props of LazyComp must be default export ReactNode");
            }
        })()
    }, []);

    return Comp ? <Comp.default {...props.targetProps} /> : (props.onLoading ?? <div></div>)
}
