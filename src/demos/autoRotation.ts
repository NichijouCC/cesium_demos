import { Iexample, IupdateProps } from "../manager";


export class AutoRot implements Iexample {
    update(props: IupdateProps): void {
        props.viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, props.deltaTime * this.speed);
    }
    title: string = "地球自旋转"
    speed: number;

    constructor(speed: number = 1) {
        this.speed = speed;
    }
}