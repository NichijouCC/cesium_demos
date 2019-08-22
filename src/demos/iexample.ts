export interface IinitProps {
    viewer: Cesium.Viewer;
}

export interface IupdateProps {
    viewer: Cesium.Viewer;
    deltaTime: number;
}
export interface Iexample {
    readonly title: string;
    beInit?: boolean;
    init?(props: IinitProps): void;
    update(props: IupdateProps): void;
}
