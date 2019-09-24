import React from "react";
import { CesiumMap } from "../lib/map";

import dat from 'dat.gui';
import { Helper } from "../lib/helper";

class Options {
    tilesChange: () => void;
    index: number = 0;
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
        // viewer.scene.camera.flyToBoundingSphere(tiles_a.boundingSphere);
        var options = new Options();
        options.tilesChange = () => {
            let tiles = [tiles_a, tiles_b, tiles_c];
            tiles.forEach(item => {
                item.show = false;
            });
            options.index++;
            if (options.index >= tiles.length) {
                options.index = 0;
            }
            tiles[options.index].show = true;
        }
        var gui = new dat.GUI();
        gui.add(options, 'tilesChange');
        this.gui = gui;

        let a = tiles_a.readyPromise.then(() => {
            tiles_a.show = true;
            return Promise.resolve(tiles_a);
        }
        );
        let b = tiles_b.readyPromise.then(() => {
            tiles_a.show = false;
            return Promise.resolve(tiles_b);
        }
        );
        let c = tiles_c.readyPromise.then(() => {
            tiles_a.show = false;
            return Promise.resolve(tiles_c);
        }
        );
        // viewer.zoomTo(tiles_a);
        Promise.all([a, b, c]).then((tiles) => {
            for (let i = 0; i < tiles.length; i++) {
                let normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(tiles[i].boundingSphere.center, new Cesium.Cartesian3());
                tiles[i].modelMatrix = Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.multiplyByScalar(normal, -1200, new Cesium.Cartesian3()));
            }
            viewer.camera.viewBoundingSphere(tiles_a.boundingSphere);
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

            setTimeout(() => {
                let centers = Cesium.Cartographic.fromCartesian(tiles_a.boundingSphere.center);
                let centerLongitude = centers.longitude * 180 / Math.PI;
                let centerLatitude = centers.latitude * 180 / Math.PI;
                let height = 250.0;
                let count = 1024;
                let spacing = 0.0004;
                let modelUrl = "./static/models/ship/scene.gltf";
                modelUrl = "./static/models/excavator.gltf"

                let instances = [];
                let pick = Helper.pickPosByNormalDir(tiles_a.boundingSphere.center, viewer);
                if (pick != null && pick.position) {
                    let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(pick.position);
                    Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 1, modelMatrix);
                    instances.push(modelMatrix);
                }
                let gridSize = Math.sqrt(count);
                for (let y = 0; y < gridSize; ++y) {
                    for (let x = 0; x < gridSize; ++x) {
                        let longitude = centerLongitude + spacing * (x - gridSize / 2);
                        let latitude = centerLatitude + spacing * (y - gridSize / 2);
                        let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 500);
                        let pick = Helper.pickPosByNormalDir(position, viewer);
                        if (pick != null && pick.position) {
                            let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(pick.position);
                            Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 0.4, modelMatrix);
                            instances.push(modelMatrix);
                        }
                    }
                }
                instances = instances.map(item => { return { modelMatrix: item } })
                let collection = this.createCollection(modelUrl, instances, viewer);

                this.autoUpdateInstancesPosition(collection);
                this.addModelInteractive(viewer);
            }, 3000);
        });
    }

    private createCollection(url: string, instances: { modelMatrix: Cesium.Matrix4 }[], viewer: Cesium.Viewer) {
        let collection = viewer.scene.primitives.add(new Cesium.ModelInstanceCollection({
            url: url,
            instances: instances,
            shadows: Cesium.ShadowMode.CAST_ONLY,
            dynamic: true
        })) as Cesium.ModelInstanceCollection;
        return collection;
        collection.readyPromise.then((collection) => {
            // Play and loop all animations at half-speed
            // viewer.scene.camera.flyToBoundingSphere(collection._boundingSphere);
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

    private addModelInteractive(viewer: Cesium.Viewer) {
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let pos = viewer.scene.pickPosition(event.position);
            if (pos != null) {
                this.addModel(viewer, "./static/models/ship/scene.gltf", pos);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }
    private addModel(viewer: Cesium.Viewer, modelUrl: string, pos: Cesium.Cartesian3) {
        viewer.entities.add({
            position: pos,
            orientation: Cesium.Transforms.headingPitchRollQuaternion(pos, new Cesium.HeadingPitchRoll()),
            model: {
                uri: modelUrl,
                scale: 2.5
            }
        });
    }


    private autoUpdateInstancesPosition(collection: Cesium.ModelInstanceCollection) {
        let instances = collection._instances;
        setInterval(() => {
            console.warn("update!!")
            for (let i = 0; i < instances.length; i++) {
                instances[i]._modelMatrix[12] += Math.random() * 5;
                instances[i]._modelMatrix[13] += Math.random() * 5;
                instances[i]._modelMatrix[14] += Math.random() * 5;
            }
            collection._dirty = true;
        }, 5000);
    }
}