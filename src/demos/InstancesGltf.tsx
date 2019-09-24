import React from "react";
import { CesiumMap } from "../lib/map";

import dat from 'dat.gui';
import { Helper } from "../lib/helper";


export class InstancesGltf extends React.Component {
    static title = "Instances Gltf 并更新位置";
    gui: any;
    render() {
        return (
            <CesiumMap id={InstancesGltf.title} onViewerLoaded={(viewer) => { this.handleViewerLoaded(viewer) }
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
        let centerLongitude = 121;
        let centerLatitude = 31;
        let height = 250.0;
        let count = 1024;
        let spacing = 0.0004;
        let modelUrl = "./static/models/ship/scene.gltf";

        let instances = [];
        let gridSize = Math.sqrt(count);
        for (let y = 0; y < gridSize; ++y) {
            for (let x = 0; x < gridSize; ++x) {
                let longitude = centerLongitude + spacing * (x - gridSize / 2);
                let latitude = centerLatitude + spacing * (y - gridSize / 2);
                let position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 10);
                let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 3.5, modelMatrix);
                instances.push(modelMatrix);
            }
        }
        instances = instances.map(item => { return { modelMatrix: item } });

        let collection = this.createCollection(modelUrl, instances, viewer);

        this.autoUpdateInstancesPosition(collection);

        viewer.scene.camera.flyToBoundingSphere(collection._boundingSphere);
    }

    private createCollection(url: string, instances: { modelMatrix: Cesium.Matrix4 }[], viewer: Cesium.Viewer) {
        let collection = viewer.scene.primitives.add(new Cesium.ModelInstanceCollection({
            url: url,
            instances: instances,
            shadows: Cesium.ShadowMode.CAST_ONLY,
            dynamic: true
        })) as Cesium.ModelInstanceCollection;
        return collection;
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