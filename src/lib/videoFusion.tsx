import React from "react";
import { Helper } from "@/lib";

interface Iprops {
    url: string;
    viewer: Cesium.Viewer;
    postion: Cesium.Cartesian3;
    quat: Cesium.Quaternion;
    aspect?: number;
}
export class VideoFusion extends React.Component<Iprops> {
    private primitiveIns: Cesium.Primitive;

    componentDidMount() {
        this._aspect = this.props.aspect != null ? this.props.aspect : 1.3;
        let videoElement = document.getElementById("video_dom") as HTMLVideoElement;
        // let targetpos = Cesium.Cartesian3.fromDegrees(121, 31, 10);
        let modelToWorldMatrix = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(this.props.postion, this.props.quat, new Cesium.Cartesian3(this._aspect * 10, 10, 10)), new Cesium.Matrix4());
        let primitive = VideoFusionHelper.creacteVideoPrimitive(videoElement, { primitiveModelMatrix: modelToWorldMatrix });
        this.props.viewer.scene.primitives.add(primitive);
        this.primitiveIns = primitive;
    }
    show() {
        this.primitiveIns.show = true;
    }
    hide() {
        this.primitiveIns.show = false;
    }
    setOpacity(value: number) {
        this.primitiveIns.appearance.material.uniforms.color = new Cesium.Color(1.0, 1.0, 1.0, value);
    }

    setColor(value: Cesium.Color) {
        this.primitiveIns.appearance.material.uniforms.color = value;
    }

    private _aspect: number = 1.3;
    setAspect(value: number) {
        this._aspect = value;
        let modelToWorldMatrix = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(this.props.postion, this.props.quat, new Cesium.Cartesian3(this._aspect * 1, 1, 1)), new Cesium.Matrix4());
        this.primitiveIns.modelMatrix = modelToWorldMatrix;
    }

    setModelMatrix(mat: Cesium.Matrix4) {
        this.primitiveIns.modelMatrix = mat;
    }

    get aspect() {
        return this._aspect;
    }

    render() {
        return (<video id="video_dom" preload="auto" style={{ display: 'none', position: "absolute", top: "30vh", left: "30vw", transform: "translate(-50%,-50%)", width: "70vw" }} autoPlay loop controls={false}>
            <source src={this.props.url} type="video/mp4" />
            Your browser does not support the <code>video</code> element.
            </video>);
    }
}
class VideoFusionHelper {
    static creacteVideoPrimitive(video: HTMLVideoElement, options?: {
        insModelMatrix?: Cesium.Matrix4;
        primitiveModelMatrix?: Cesium.Matrix4;
    }) {
        options = options || {};
        let geometryIns = VideoFusionHelper.createGeometryInstance(options.insModelMatrix);
        let appearance = VideoFusionHelper.createAppearance(video);
        let primitive = new Cesium.Primitive({
            geometryInstances: geometryIns,
            appearance: appearance,
            asynchronous: false,
            modelMatrix: options.primitiveModelMatrix,
            show: true
        });
        return primitive;
    }
    static createGeometryInstance(modelMatrix?: Cesium.Matrix4) {
        let instance = new Cesium.GeometryInstance({
            geometry: this.geometry,
            modelMatrix: modelMatrix
        });
        return instance;
    }
    static createAppearance(video: HTMLVideoElement) {
        let source = `czm_material czm_getMaterial(czm_materialInput materialInput)
        {
             czm_material material = czm_getDefaultMaterial(materialInput);
             vec2 st = materialInput.st;
             vec4 colorImage = texture2D(image, vec2(st.s, st.t));
             material.alpha = colorImage.a * color.a;
             material.diffuse = colorImage.rgb*color.rgb;
             return material;
         }`;
        let material = new Cesium.Material({
            fabric: {
                type: "custome_1",
                uniforms: {
                    color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
                    image: "./images/arrow.png",
                },
                source: source
            }
        });
        // let material = Cesium.Material.fromType('Image');
        material.uniforms.image = video;
        let appearance = new Cesium.EllipsoidSurfaceAppearance({
            material: material,
            flat: true,
            renderState: {
                cull: {
                    enabled: false,
                },
                depthTest: {
                    enabled: false
                }
            }
        });
        return appearance;
    }
    private static _geometry: Cesium.Geometry;
    static get geometry() {
        if (this._geometry == null) {
            this._geometry = this.creacteGeometry(10, 10);
        }
        return this._geometry;
    }
    private static creacteGeometry(width: number, height: number) {
        let hwidth = width / 2.0;
        let hheigt = height / 2.0;
        let positions = new Float64Array([hwidth, 0.0, hheigt, -hwidth, 0.0, hheigt, -hwidth, 0.0, -hheigt, hwidth, 0.0, -hheigt]);
        let sts = new Float32Array([1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0]);
        let indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
        let ge = this._createGeometry(positions, sts, indices);
        return ge;
    }
    private static _createGeometry(positions: Float64Array, sts: Float32Array, indices: Uint16Array) {
        return new Cesium.Geometry({
            attributes: {
                position: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                    componentsPerAttribute: 3,
                    values: positions
                }),
                st: new Cesium.GeometryAttribute({
                    componentDatatype: Cesium.ComponentDatatype.FLOAT,
                    componentsPerAttribute: 2,
                    values: sts
                })
            },
            indices: indices,
            primitiveType: Cesium.PrimitiveType.TRIANGLES,
            boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
        });
    }
}
