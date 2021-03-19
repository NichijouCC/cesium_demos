import { EventEmitter } from "@mtgoo/ctool";
import { AppStore, IStoreEvents } from "./appStore";

declare global {
    /**
     * 项目环境
     */
    var APP_ENV: AppEnvType;
    /**
     * 项目版本
     */
    var APP_VERSION: string;
    /**
     * 项目的配置
     */
    var APP_CONFIG: IAppConfig;
    /**
     * 项目的数据中心
     */
    var APP_STORE: IAppStore;

    /**
     * 项目配置
     */
    interface IAppConfig {
        [k: string]: any
    }
    /**
     * 事件中心的事件类型定义
     */
    interface IDataEvents {
        [k: string]: any
    }
    /**
     * 数据中心的类型定义
     */
    interface IStoreData { [key: string]: any; }
}

export type IAppStore = IStoreData & AppStore<IStoreEvents<IStoreData>>;

export type AppEnvType = "prod" | "test" | "dev";

export interface IAppConfigs<T = IAppConfig> {
    common?: Partial<T>,
    dev?: Partial<T>,
    test?: Partial<T>,
    prod?: Partial<T>,
}

/**
 * app_store 配置项
 */
export interface IStoreOption {
    /**
     * 是否将数据存入Storage，默认：“none”
     */
    saveItemToStorage?: "localStorage" | "sessionStorage" | "none";
    /**
     * 启动的时候加载上次的数据，默认：true
     */
    loadDataOnOpen?: boolean;
}

/**
 * 项目可选配置
 */
export interface IAppOption<T extends object = {}> {
    /**
     * 覆盖掉默认环境配置
     */
    appEnv?: AppEnvType;
    /**
     * merge掉 privateConfig和publicConfig
     */
    appConfig?: Partial<IAppConfig>;
    /**
     * 数据中心 - 存储的数据
     */
    storeData?: T,
    /**
     * 数据中心 - 配置项
     */
    storeOpt?: {
        saveItemToStorage?: "localStorage" | "sessionStorage" | "none";
        loadDataOnOpen?: boolean;
    },
    /**
     * domain改写
     */
    appDomain?: string;

    /**
     * 启动的时候干些事情
     */
    onInit?: () => void;
}