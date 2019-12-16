import React from "react";
import { CesiumMap } from "../../../lib/map";
import { Debug } from "../../../lib/debug";

export default class Classification_1 extends React.Component {
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
            if (!this._beMount) return;

            viewer.zoomTo(tileset);
            this.doneClassify(viewer);
            let handler = this.addMouseInteractive(viewer, tileset);

            this.componentWillUnmount = () => {
                handler.destroy();
            }
        });
    }


    private doneClassify(viewer: Cesium.Viewer) {
        //-----------这种方式写的单体化,有的时候pick不到，so舍弃
        // let redPolygon = viewer.entities.add({
        //     polygon: {
        //         hierarchy: Cesium.Cartesian3.fromRadiansArray(
        //             [-1.3194099316314372, 0.6987968432881184,
        //             - 1.3193974274016789, 0.6988021105858696,
        //             - 1.319401631614801, 0.6988076344398017,
        //             - 1.319413889290215, 0.6988023356648352
        //             ]),
        //         // height: 0,
        //         // extrudedHeight: 30,
        //         material: Cesium.Color.RED.withAlpha(0.5),
        //         classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        //     }
        // });
        let scene = viewer.scene;
        scene.primitives.add(new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromRadiansArray(
                        [-1.3194099316314372, 0.6987968432881184,
                        - 1.3193974274016789, 0.6988021105858696,
                        - 1.319401631614801, 0.6988076344398017,
                        - 1.319413889290215, 0.6988023356648352
                        ])),
                    height: 0,
                    extrudedHeight: 30,
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1.0, 0.0, 0.0, 0.5)),
                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                },
                id: "c2"

            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }));

        scene.primitives.add(new Cesium.ClassificationPrimitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromRadiansArray(
                        [-1.3194146508025428, 0.6987972336626,
                        -1.3194127494954553, 0.6987980135676406,
                        -1.3194140066218585, 0.6987998137240734,
                        -1.3194158443512902, 0.698798876642071,
                        ])),
                    height: 0,
                    extrudedHeight: 13,
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.0, 1.0, 0.0, 0.5)),
                    show: new Cesium.ShowGeometryInstanceAttribute(true)
                },
                id: "c1"
            }),
            classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
        }));
    }
    private currentId: string;
    private currentPirmitive: Cesium.ClassificationPrimitive;
    private currentColor: Uint8Array;
    private addMouseInteractive(viewer: Cesium.Viewer, tileset: Cesium.Cesium3DTileset) {
        let handler = new Cesium.ScreenSpaceEventHandler();
        handler.setInputAction((event) => {
            let ray = viewer.camera.getPickRay(event.endPosition);
            let picked = viewer.scene.pickFromRay(ray, [tileset]);
            if (picked != null && picked.object != null && picked.object.id != null) {
                if (picked.object.id != this.currentId) {
                    if (this.currentId && this.currentPirmitive) {
                        let atts = this.currentPirmitive.getGeometryInstanceAttributes(this.currentId);
                        atts.color = this.currentColor;
                        this.currentId = null;
                    }
                    let obj = picked.object.primitive;
                    if (obj instanceof Cesium.ClassificationPrimitive) {
                        let atts = obj.getGeometryInstanceAttributes(picked.object.id);
                        this.currentPirmitive = obj;
                        this.currentId = picked.object.id;
                        this.currentColor = atts.color;
                        atts.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.AQUA.withAlpha(0.5));
                    }
                }
            } else {
                if (this.currentId && this.currentPirmitive) {
                    let atts = this.currentPirmitive.getGeometryInstanceAttributes(this.currentId);
                    atts.color = this.currentColor;
                    this.currentId = null;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        return handler;
    }


    private _beMount: boolean = false;
    componentDidMount() {
        this._beMount = true;
    }
    componentWillUnmount() {
        this._beMount = false;
    }
}