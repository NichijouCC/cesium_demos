import React from "react";
import { CesiumMap, Debug } from "@/lib";
import { loadKmlTiles } from "@/lib/loadKMLTilesInfo";

export default class DsmShow extends React.Component {
    private mapref: React.RefObject<CesiumMap>;
    constructor(props) {
        super(props);
        this.mapref = React.createRef<CesiumMap>();
    }

    componentDidMount() {

        // viewer.camera.flyTo({
        //     destination: new Cesium.Cartesian3(2033992.677662228, -15449708.24660572, 10948396.652844096),
        //     orientation: new Cesium.HeadingPitchRoll(6.283185307179586, -1.569218664619823, 0)
        // })

        loadKmlTiles("./kml/google_tiles/1_mosaic.kml")
            .then(tileinfo => {
                const { resourcesUrl, orthoRect } = tileinfo;
                const level = 20;
                // const mapper = new Cesium.TileMapServiceImageryProvider({
                //     url: resourcesUrl,
                //     fileExtension: 'png',
                //     maximumLevel: level,
                //     minimumLevel: 0,
                //     rectangle: orthoRect,
                // });
                // viewer.imageryLayers.addImageryProvider(mapper);

                this.mapref.current.setUp({
                    // terrainProvider: new Cesium.CesiumTerrainProvider({
                    //     requestVertexNormals: true,
                    //     url: Cesium.IonResource.fromAssetId(109657, { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMzJmNDgwZi1iNmQ2LTQ0NWEtOWRkNi0wODkxYzYxYTg0ZDIiLCJpZCI6ODUzMiwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MjIwMjY4OH0.u4d7x0IxZY06ThT4JFmxrfgBxVjQcfI6xXDLu-fsWsY" }),
                    // }),
                    // imageryProvider: mapper,
                    imageryProviderViewModels: []
                } as any);
                let viewer = this.mapref.current.viewer;
                viewer.camera.flyTo({
                    destination: orthoRect
                });

                let options = {
                    camera: viewer.scene.camera,
                    canvas: viewer.scene.canvas as any,
                    clampToGround: true //开启贴地
                };
                let kml = viewer.dataSources.add(Cesium.KmlDataSource.load('./kml/45454.kml', options));
                viewer.flyTo(kml);

                //--------------------等高线----------------------------
                let material = Cesium.Material.fromType("ElevationContour") as any;
                material.uniforms.width = 5.0;
                material.uniforms.spacing = 50.0;
                material.uniforms.color = Cesium.Color.YELLOW.clone();
                (viewer.scene.globe as any).material = material;

            })

    }

    render() {
        return (<CesiumMap setUp={false} ref={this.mapref} />)
    }
}