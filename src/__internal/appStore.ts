import { EventEmitter } from "@mtgoo/ctool";
import "reflect-metadata";
import { IStoreOption } from "./iapp";

interface IPrivateEvents {
    attChange: { att: string, newValue: any, oldValue: any }
}
type IAttEvents<T extends object> = {
    [key in keyof T]: { newValue: any, oldValue: any }
}
export type IStoreEvents<T extends object = {}> = IPrivateEvents & IAttEvents<T> & IDataEvents;

/**
 * 全局数据中心
 * 
 * @description
 * 需要被持久化的数据(存储到localStorage)使用 serialize 进行标记
 */
export class AppStore<T = IStoreEvents<any>> extends EventEmitter<T> {
    private _target: any;
    private constructor(data: any, opt: IStoreOption) {
        super();
        this._target = data;
        let { saveItemToStorage = "none" } = opt || {};
        if (saveItemToStorage != "none") {
            let storage = opt.saveItemToStorage == "localStorage" ? localStorage : sessionStorage;
            this._clearStore = () => storage.clear();

            this.on("attChange" as any, (ev: any) => {
                let { att, newValue } = ev;
                storage.setItem(att, JSON.stringify(newValue));
            })
        }

        window.addEventListener('beforeunload', () => {
            this.saveDataToLocalStorage();
        }, false);

        if (opt?.loadDataOnOpen != false) {
            this.loadDataFromLocalStorage();
        }
        localStorage.removeItem(storeKey);
    }

    static create<P extends object = {}>(data: P, opt?: IStoreOption): AppStore<IStoreEvents<P>> & P {
        let store = new AppStore<IStoreEvents<P>>(data, opt);
        Object.keys(data).forEach(item => {
            if (data[item] != null) {//如果赋值了初始值，覆盖storage中取到的值
                store[item] = data[item];
            }
        });

        let storedData = new Proxy(store, {
            set: function (obj, prop, value) {
                obj[prop] = value;
                store.emit("attChange", { att: prop.toString(), newValue: value, oldValue: this[prop] });
                store.emit(prop.toString(), { newValue: value, oldValue: this[prop] })
                return true;
            }
        });
        return storedData as any;
    }

    /**
     * 将需要持久化的数据存储到LocalStorage中
     */
    private saveDataToLocalStorage() {
        let store: string[] = Reflect.getMetadata(storeKey, this._target);

        let needStoreData = {};
        store?.forEach(key => {
            let value = Reflect.get(this, key);
            needStoreData[key] = value;
        })

        localStorage.setItem(storeKey, JSON.stringify(needStoreData))
    }

    /**
     * 从localStorage加载被持久化的数据
     */
    private loadDataFromLocalStorage() {
        let store: string[] = Reflect.getMetadata(storeKey, this._target);
        let storedInfo = JSON.parse(localStorage.getItem(storeKey));
        if (storedInfo) {
            store?.forEach(key => {
                Reflect.set(this, key, storedInfo[key]);
            })
        }
    }

    private _clearStore = () => { };
    /**
     * 清空store的数据
     */
    clear(clearStorage: boolean = true) {
        let store: string[] = Reflect.getMetadata(storeKey, this._target);
        store?.forEach(key => {
            Reflect.set(this, key, null);
        });
        if (clearStorage) this._clearStore();
    }
}

/**
 * 标记需要持久化的数据 
 */
export function Att<K>(target: K, name: string) {
    let store: string[] = Reflect.getMetadata(storeKey, target);
    if (store == null) {
        Reflect.defineMetadata(storeKey, [name], target);
    } else {
        store.push(name);
    }
}


const storeKey = "__private__store";