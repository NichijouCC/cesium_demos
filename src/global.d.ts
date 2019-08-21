export module Cesium {
    export interface Cesium3DTileset {
        constructor(Cesium3DTilesetItem: {
            url: string;
            maximumScreenSpaceError: number;
            maximumNumberOfLoadedTiles: number;
            shadows?: any;
        })
    }
}