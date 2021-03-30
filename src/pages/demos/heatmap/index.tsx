import { CesiumMap } from "@/lib";
import { Button, message, Slider, Switch } from "antd";
import React from "react";
import './index.less';

export default class heatMaP extends React.Component<{}, { beReady: boolean }> {

    state = {
        beReady: false
    }
    private _mat: Cesium.Material;

    componentDidMount() {

    }
    onViewerLoad = (viewer: Cesium.Viewer) => {
        this._viewer = viewer;

        //目标视角
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(111.4175, 31.655, 8000000),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90.0),
            } as any
        });

        //设置默认图片为透明,不然加载primitive默认的时候还是白图
        let context = (viewer.scene as any)._context;
        context._defaultTexture = new (Cesium as any).Texture({
            context: context,
            source: {
                width: 1,
                height: 1,
                arrayBufferView: new Uint8Array([255, 255, 255, 0]),
            },
            flipY: false,
        });
        this._mat = createPrimitive(viewer);
        this.loadImage()
            .then(() => {
                this.setState({ beReady: true })
            })
            .catch(err => {
                message.error("加载图片失败")
            })

    }
    onChangeSlider = (value: number) => {
        let progress = value / 100;
        let video = document.getElementById("video_dom") as HTMLVideoElement;
        video.currentTime = video.duration * progress;
    }

    private _images = [];
    loadImage = (count: number = 5) => {
        let loadTasks = [];
        for (let i = 0; i < count; i++) {
            loadTasks.push(new Promise<void>((resolve, reject) => {
                let image = new Image();
                image.src = `./heatMapImages/${i + 1}.png`;
                image.onload = () => {
                    {
                        //直接赋值image给uniform会重复texture2d，所以使用用htmlcanvas; 没有接着研究，理论上使用cesium的texture或resource更佳
                        var canvas = document.createElement("canvas");
                        var canvasContext = canvas.getContext("2d");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        canvasContext.clearRect(0, 0, image.width, image.height);
                        canvasContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                        this._images[i] = canvas;
                    }

                    resolve()
                }
                image.onerror = (e) => {
                    reject(e)
                }
            }))
        }

        return Promise.all(loadTasks);
    }

    clickStart = () => {
        let totalTime = 0;
        this._viewer.frameUpdate.addEventListener((deltaTime) => {
            totalTime += deltaTime;
            let current = Math.floor(totalTime / 1000);
            this._mat.uniforms.image = this._images[current % 5];
        });
    }

    private _viewer: Cesium.Viewer;
    render() {
        return <React.Fragment>
            <CesiumMap onViewerLoaded={this.onViewerLoad} />
            <div className="heatmap-ui">
                <Button onClick={this.clickStart} disabled={!this.state.beReady}>start</Button>
            </div>
        </React.Fragment >
    }
}

function createPrimitive(viewer: Cesium.Viewer) {
    let instance = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(80.0, 10.0, 130.0, 60.0),//几何体方框区间范围
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST
        }),
    });

    //创建透明小图
    var canvas = document.createElement("canvas", {});
    canvas.width = 1;
    canvas.height = 1;
    let mat = new Cesium.Material({
        fabric: {
            type: 'Image',
            uniforms: {
                image: canvas
            }
        }
    });

    let appearance = new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: true,
        renderState: {
            cull: {
                enabled: false,
            },
            depthTest: {
                enabled: false,
            },
        },
        material: mat
    })
    viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        appearance: appearance,
        asynchronous: false
    }));
    return mat
}