import { ICustomConfig } from "./customConfig";
import { CustomStore, ICustomStoreEvents } from "./customStore";
//tip:此文件不需要修改
declare global {
    /**
     * （项目配置）自定义类型
     */
    interface IAppConfig extends ICustomConfig { }
    /**
     * (store的数据)自定义类型
     */
    interface IStoreData extends CustomStore { }
    /**
     * (store的事件) 自定义类型
     */
    interface IDataEvents extends ICustomStoreEvents { }
};