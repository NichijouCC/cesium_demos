import React from "react";
import { CesiumMap } from "@/lib/map";

export class VideoFusionDemo extends React.Component {
    state = {
        viewer: null
    }
    private handleViewerLoaded(viewer: Cesium.Viewer) {
        this.setState({ viewer: viewer });
    }

    render() {
        return (
            <React.Fragment>
                <CesiumMap id={this.constructor.name} onViewerLoaded={this.handleViewerLoaded.bind(this)} />
                {
                    this.state.viewer ? <VideoFusion url={"https://cesiumdemos.oss-cn-shanghai.aliyuncs.com/videoFusion.mp4"} viewer={this.state.viewer} /> : null
                }
            </React.Fragment>
        )
    }
}


export class VideoFusion extends React.Component<{ url: string, viewer: Cesium.Viewer }> {
    componentDidMount() {
        let videoElement = document.getElementById("video_dom") as HTMLVideoElement;
        let targetpos = Cesium.Cartesian3.fromDegrees(121, 31, 10);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(targetpos, new Cesium.HeadingPitchRoll(0, 0, 0));
        let modelToWorldMatrix = Cesium.Matrix4.fromTranslationRotationScale(new Cesium.TranslationRotationScale(targetpos, orientation, new Cesium.Cartesian3(1, 1, 1)), new Cesium.Matrix4());
        this.props.viewer.scene.primitives.add(VideoFusionTool.creacteVideoPrimitive(videoElement, { primitiveModelMatrix: modelToWorldMatrix }));
    }

    render() {
        return (
            <video id="video_dom" style={{ display: 'none', position: "absolute", top: "30vh", left: "30vw", transform: "translate(-50%,-50%)", width: "70vw" }} autoPlay loop controls={false}>
                <source src={this.props.url} type="video/mp4" />
                Your browser does not support the <code>video</code> element.
            </video>
        )
    }
}

class VideoFusionTool {

    static creacteVideoPrimitive(video: HTMLVideoElement, options?: { insModelMatrix?: Cesium.Matrix4, primitiveModelMatrix?: Cesium.Matrix4 }) {
        options = options || {};
        let geometryIns = VideoFusionTool.createGeometryInstance(options.insModelMatrix);
        let appearance = VideoFusionTool.createAppearance(video);

        let primitive = new Cesium.Primitive({
            geometryInstances: geometryIns,
            appearance: appearance,
            asynchronous: false,
            modelMatrix: options.primitiveModelMatrix,
            show: true
        })
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
        let material = Cesium.Material.fromType('Image');
        material.uniforms.image = video;
        let appearance = new Cesium.EllipsoidSurfaceAppearance({
            material: material,
            flat: true,
        });
        return appearance
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
        let positions = new Float64Array([hwidth, hheigt, 0.0, -hwidth, hheigt, 0.0, -hwidth, -hheigt, 0.0, hwidth, -hheigt, 0.0]);
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