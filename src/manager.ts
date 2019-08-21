
export class CesiumMain {
    viewer: Cesium.Viewer;
    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.loop();
    }

    private examples: Iexample[] = [];
    addDemo(example: Iexample) {
        this.examples.push(example);
    }

    chooseDemo(example: Iexample) {
        this.examples = [example];
        if (example.init != null && !example.beInit) {
            example.init({ viewer: this.viewer });
        }
    }

    removeDemo(example: Iexample) {
        let index = this.examples.indexOf(example);
        if (index != -1) {
            this.examples.splice(index, 1);
        }
    }

    private loop() {
        let lasTime;
        this.viewer.scene.preUpdate.addEventListener(() => {
            let dateNow = Date.now();
            let deltaTime = lasTime != null ? dateNow - lasTime : 0;
            lasTime = dateNow;

            let updateProps = { viewer: this.viewer, deltaTime: deltaTime };
            this.examples.forEach(item => {
                item.update(updateProps);
            });
        });
    }
}

export interface IinitProps {
    viewer: Cesium.Viewer;
}

export interface IupdateProps {
    viewer: Cesium.Viewer;
    deltaTime: number;
}
export interface Iexample {
    title: string;
    beInit?: boolean;
    init?(props: IinitProps): void;
    update(props: IupdateProps): void;
}
