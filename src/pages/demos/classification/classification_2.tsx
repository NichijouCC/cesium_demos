import React from "react";
import { CesiumMap } from "../../../lib/map";
import { Debug } from "../../../lib/debug";
import { Helper } from "../../../lib/helper";

export default class Classification_2 extends React.Component {
    render() {
        return (
            <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
        )
    }

    handleViewerLoaded(viewer: Cesium.Viewer) {
        // Debug.activePick(viewer);//用于找点
        let tileset = viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(17732)
            })
        ) as Cesium.Cesium3DTileset;
        tileset.readyPromise.then(() => {
            viewer.zoomTo(tileset);
            this.doneClassify(viewer);
            this.addMouseInteractive(viewer, tileset);
        });
    }

    private doneClassify(viewer: Cesium.Viewer) {
        // let pos = new Cesium.Cartographic(-1.319405732682494, 0.6988020232990926, 15);
        // let mat = Helper.computeMatToWorld(Cesium.Cartesian3.fromRadians(pos.longitude, pos.latitude, pos.height));

        let pos = Cesium.Cartesian3.fromRadians(-1.319405732682494, 0.6988020232990926, 18.5)
        // viewer.entities.add({
        //     position: pos,
        //     orientation: Cesium.Transforms.headingPitchRollQuaternion(pos, new Cesium.HeadingPitchRoll(60 * Math.PI / 180, 0, 0)),
        //     box: {
        //         dimensions: ,
        //         material: new Cesium.ImageMaterialProperty({
        //             image: "./images/wall.png",
        //             transparent: true,
        //             color: Cesium.Color.BLUE
        //         }),
        //         outline: true,
        //         outlineColor: Cesium.Color.BLUE.withAlpha(0.7)
        //     }
        // });
        this.addClassifyObject2({ viewer: viewer, position: pos, rotAngle: -60, dimensions: new Cesium.Cartesian3(40.0, 70.0, 21.0), onHoverColor: Cesium.Color.YELLOW });
    }
    private currentId: string;
    private currentPirmitive: Cesium.ClassificationPrimitive;
    private currentColor: Uint8Array;
    private addMouseInteractive(viewer: Cesium.Viewer, tileset: Cesium.Cesium3DTileset) {


        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.endPosition);
            let picked = viewer.scene.pickFromRay(ray, [tileset]);
            // console.warn(picked)
            // let ray = viewer.camera.getPickRay(event.endPosition);
            // let picked = viewer.scene.pickFromRay(ray, [tileset]);
            // console.warn(picked)

            // var worldPosition = viewer.scene.pickPosition(movement.position);
            // console.warn(picked)
            // if (picked != null && picked.object != null && picked.object.id != null) {
            //     if (picked.object.id != this.currentId) {
            //         if (this.currentId && this.currentPirmitive) {
            //             let atts = this.currentPirmitive.getGeometryInstanceAttributes(this.currentId);
            //             atts.color = this.currentColor;
            //             this.currentId = null;
            //         }
            //         let obj = picked.object.primitive;
            //         if (obj instanceof Cesium.ClassificationPrimitive) {
            //             let atts = obj.getGeometryInstanceAttributes(picked.object.id);
            //             this.currentPirmitive = obj;
            //             this.currentId = picked.object.id;
            //             this.currentColor = atts.color;
            //             atts.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.AQUA.withAlpha(0.5));
            //         }
            //     }
            // } else {
            //     if (this.currentId && this.currentPirmitive) {
            //         let atts = this.currentPirmitive.getGeometryInstanceAttributes(this.currentId);
            //         atts.color = this.currentColor;
            //         this.currentId = null;
            //     }
            // }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }


    private addClassifyObject(options: {
        viewer: Cesium.Viewer,
        position: Cesium.Cartesian3,
        dimensions: Cesium.Cartesian3,
        rotAngle?: number,
        color?: Cesium.Color,
        onHoverColor?: Cesium.Color,
        onClassifitionHover?: (entity: Cesium.Entity) => void,

    }) {
        let orientation = options.rotAngle != null ?
            Cesium.Transforms.headingPitchRollQuaternion(options.position, new Cesium.HeadingPitchRoll(options.rotAngle * Math.PI / 180, 0, 0)) : Cesium.Transforms.headingPitchRollQuaternion(options.position, new Cesium.HeadingPitchRoll());
        let color = options.color || Cesium.Color.BLUE;
        let obj = options.viewer.entities.add({
            position: options.position,
            orientation: orientation,
            box: {
                dimensions: options.dimensions,
                material: new Cesium.ImageMaterialProperty({
                    // image: "./images/wall.png",
                    image: "./images/riverNormal.jpg",

                    // transparent: true,
                    color: color
                }),
                outline: true,
                outlineColor: color.withAlpha(0.7)
            }
        });
        obj.onHover = new Cesium.Event();
        obj.onEndHover = new Cesium.Event();
        obj.onHover.addEventListener(() => {
            if (options.onClassifitionHover != null) {
                options.onClassifitionHover(obj);
            }
            obj.box.dimensions = Cesium.Cartesian3.multiplyByScalar(options.dimensions, 1.2, new Cesium.Cartesian3());
            (obj.box.material as Cesium.ImageMaterialProperty).color = options.onHoverColor;
            obj.box.outlineColor = options.onHoverColor.withAlpha(0.7);
        });
        obj.onEndHover.addEventListener(() => {
            obj.box.dimensions = options.dimensions;
            (obj.box.material as Cesium.ImageMaterialProperty).color = color;
            obj.box.outlineColor = color.withAlpha(0.7);
        });
    }
    private addClassifyObject2(options: {
        viewer: Cesium.Viewer,
        position: Cesium.Cartesian3,
        dimensions: Cesium.Cartesian3,
        rotAngle?: number,
        color?: Cesium.Color,
        onHoverColor?: Cesium.Color,
        onClassifitionHover?: (entity: Cesium.Entity) => void,

    }) {
        let orientation = options.rotAngle != null ?
            Cesium.Transforms.headingPitchRollQuaternion(options.position, new Cesium.HeadingPitchRoll(options.rotAngle * Math.PI / 180, 0, 0)) : Cesium.Transforms.headingPitchRollQuaternion(options.position, new Cesium.HeadingPitchRoll());
        let color = options.color || Cesium.Color.BLUE;
        let mat = Cesium.Transforms.eastNorthUpToFixedFrame(options.position);
        let toWorldmat = Cesium.Matrix4.multiplyByMatrix3(mat, Cesium.Matrix3.fromRotationZ(options.rotAngle != null ? options.rotAngle * Math.PI / 180 : 0), new Cesium.Matrix4());

        var appearance = new Cesium.MaterialAppearance({
            translucent: false,
            renderState: {
                depthMask: true,
                blending: Cesium.BlendingState.ALPHA_BLEND,
            },
            flat: true
        });
        appearance.material = new Cesium.Material({
            fabric: {
                type: 'Image',
                uniforms: {
                    image: './images/wall.png',
                    // image: "./images/riverNormal.jpg",
                    color: color
                },
            }
        });
        // console.warn(appearance)
        let geometry = new Cesium.GeometryInstance({
            geometry: Cesium.BoxGeometry.fromDimensions({
                dimensions: options.dimensions,
                vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
            }),
        })
        let obj = options.viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: geometry,
            appearance: appearance,
            modelMatrix: toWorldmat
        }));
        // obj.onHover = new Cesium.Event();
        // obj.onEndHover = new Cesium.Event();
        // obj.onHover.addEventListener(() => {
        //     if (options.onClassifitionHover != null) {
        //         options.onClassifitionHover(obj);
        //     }
        //     obj.box.dimensions = Cesium.Cartesian3.multiplyByScalar(options.dimensions, 1.2, new Cesium.Cartesian3());
        //     (obj.box.material as Cesium.ImageMaterialProperty).color = options.onHoverColor;
        //     obj.box.outlineColor = options.onHoverColor.withAlpha(0.7);
        // });
        // obj.onEndHover.addEventListener(() => {
        //     obj.box.dimensions = options.dimensions;
        //     (obj.box.material as Cesium.ImageMaterialProperty).color = color;
        //     obj.box.outlineColor = color.withAlpha(0.7);
        // });
    }

}