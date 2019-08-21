import { Iexample, IupdateProps, IinitProps } from "../manager";

export class Load3dtiles implements Iexample {

    title: string = "加载3dtiles";

    init(props: IinitProps) {

        let modelPath = "http://cloudv2bucket.oss-cn-shanghai.aliyuncs.com/185/1254/resultCC/Production_1.json"

        let tileset = props.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100,
            // shadows: Cesium.ShadowMode.DISABLED
        }));
        props.viewer.zoomTo(tileset);


    }


    update(props: IupdateProps): void {
    }
}