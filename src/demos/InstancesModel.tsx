import React from "react";
import { CesiumMap } from "../lib/map";

import dat from 'dat.gui';

class Options {
    a_tiles_show: boolean = true;
    a_tiles_height: number = -1200;

    b_tiles_show: boolean = true;
    b_tiles_height: number = -1200;

    c_tiles_show: boolean = true;
    c_tiles_height: number = -1200;
}


export class InstancesModel extends React.Component {
    static title = "模型Instances";
    gui: any;
    render() {
        return (
            <CesiumMap id={InstancesModel.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }
            } />
        )
    }

    componentDidMount() {

    }
    componentWillUnmount() {
        if (this.gui) {
            this.gui.destroy();
        }
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {


        let tiles_a = this.add3dtiles(viewer, "./static/3dtiles/3dtile/Production_2.json");
        let tiles_b = this.add3dtiles(viewer, "./static/3dtiles/Scene/Production_2.json");
        let tiles_c = this.add3dtiles(viewer, "./static/3dtiles/Scene1/Production_2.json");
        viewer.zoomTo(tiles_a);
        // viewer.scene.camera.flyToBoundingSphere(tiles_a.boundingSphere);


        var options = new Options();
        var gui = new dat.GUI();
        var f1 = gui.addFolder('tileseta');
        f1.add(options, 'a_tiles_show').onChange((value) => {
            tiles_a.show = value;
        });
        f1.add(options, 'a_tiles_height').onChange((value) => {
            let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tiles_a.boundingSphere.center, new Cesium.Cartesian3());
            tiles_a.modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.multiplyByScalar(normal, value, new Cesium.Cartesian3()));
        });

        var f2 = gui.addFolder('tilesetb');
        f2.add(options, 'b_tiles_show').onChange((value) => {
            tiles_b.show = value;
        });
        f2.add(options, 'b_tiles_height').onChange((value) => {
            let normal = Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(tiles_b.boundingSphere.center, new Cesium.Cartesian3());
            tiles_b.modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.multiplyByScalar(normal, value, new Cesium.Cartesian3()));
        });

        var f3 = gui.addFolder('tilesetc');
        f3.add(options, 'c_tiles_show').onChange((value) => {
            tiles_c.show = value;
        });
        f3.add(options, 'c_tiles_height').onChange((value) => {
            let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tiles_c.boundingSphere.center, new Cesium.Cartesian3());
            tiles_c.modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.multiplyByScalar(normal, value, new Cesium.Cartesian3()));
        });
        this.gui = gui;

        tiles_a.readyPromise.then(
            () => {
                let centers = Cesium.Cartographic.fromCartesian(tiles_a.boundingSphere.center);
                let centerLongitude = centers.longitude * 180 / Math.PI;
                let centerLatitude = centers.latitude * 180 / Math.PI;
                let height = 250.0;
                let count = 1024;
                let spacing = 0.0004;
                let modelUrl = "./static/models/ship/scene.gltf";
                modelUrl = "./static/models/excavator.gltf"

                let instances = [];
                let gridSize = Math.sqrt(count);
                for (let y = 0; y < gridSize; ++y) {
                    for (let x = 0; x < gridSize; ++x) {
                        let longitude = centerLongitude + spacing * (x - gridSize / 2);
                        let latitude = centerLatitude + spacing * (y - gridSize / 2);
                        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                        let heading = Math.random();
                        let pitch = Math.random();
                        let roll = Math.random();
                        let scale = 0.3;
                        let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, new Cesium.HeadingPitchRoll(heading, pitch, roll));
                        Cesium.Matrix4.multiplyByUniformScale(modelMatrix, scale, modelMatrix);
                        instances.push(modelMatrix);
                    }
                }

                this.createCollection(modelUrl, instances, viewer);
            }
        );


    }

    private createCollection(url: string, modelMatrix: Cesium.Matrix4[], viewer: Cesium.Viewer) {
        let collection = viewer.scene.primitives.add(new Cesium.ModelInstanceCollection({
            url: url,
            instances: modelMatrix.map(item => { return { modelMatrix: item } }),
            shadows: Cesium.ShadowMode.CAST_ONLY
        })) as Cesium.ModelInstanceCollection;
        collection.readyPromise.then((collection) => {
            // Play and loop all animations at half-speed
            viewer.scene.camera.flyToBoundingSphere(collection._boundingSphere);

        })
        // .otherwise((error) => {
        //     window.alert(error);
        // });
    }

    private add3dtiles(viewer: Cesium.Viewer, modelPath: string): Cesium.Cesium3DTileset {
        return viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: modelPath,
            maximumScreenSpaceError: 0.8,
            maximumNumberOfLoadedTiles: 100
        })) as Cesium.Cesium3DTileset;
    }
}