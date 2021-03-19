import React from "react";
import './domTag.css'

export interface IProps {
    viewer: Cesium.Viewer;
    trackPos?: Cesium.Cartesian3;
    trackEntity?: Cesium.Entity;
    trackCursor?: boolean;
    text?: string;
    textCss?: React.CSSProperties
    children?: React.ReactNode,

    alignX?: "left" | "center" | "right",
    alignY?: "top" | "center" | "bottom",
}

export class DomTagInfo extends React.Component<IProps> {
    protected element: HTMLDivElement;
    private mousePos: Cesium.Cartesian2;
    constructor(props: IProps) {
        super(props);

        if (props.trackCursor) {
            const handler = new Cesium.ScreenSpaceEventHandler();
            handler.setInputAction((event) => {
                let offsetToLeftTop = this.props.viewer.container.getBoundingClientRect();
                this.mousePos = Cesium.Cartesian2.subtract(event.endPosition, new Cesium.Cartesian2(offsetToLeftTop.left, offsetToLeftTop.top), new Cesium.Cartesian2());
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }
    }

    componentDidMount() {
        this.props.viewer.scene.preUpdate.addEventListener(this.onUpdate);
    }

    componentWillUnmount() {
        if (this.props.viewer && !this.props.viewer.isDestroyed()) {
            this.props.viewer.scene.preUpdate.removeEventListener(this.onUpdate);
        }
    }
    private onUpdate = () => {
        if (this.element == null) return;
        let screenPos;
        if (this.props.trackCursor) {
            screenPos = this.mousePos;
        }
        else if (this.props.trackEntity) {
            let pos = this.props.trackEntity.position.getValue(Cesium.JulianDate.now());
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, pos);

        } else if (this.props.trackPos) {
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, this.props.trackPos);
        }

        if (screenPos) {
            this.element.style.display = "";

            switch (this.props.alignX) {
                case "left":
                    this.element.style.left = screenPos.x + "px";
                    break;
                case "center":
                    this.element.style.left = (screenPos.x + this.element.clientWidth * 0.5) + "px";
                    break;
                case "right":
                default:
                    this.element.style.left = (screenPos.x - this.element.clientWidth * 0.5) + "px";
            }

            switch (this.props.alignY) {
                case "top":
                    this.element.style.top = (screenPos.y - this.element.clientHeight) + "px";
                    break;
                case "bottom":
                    // this.element.style.top = (screenPos.y + this.element.clientHeight * 0.5) + "px";
                    this.element.style.top = screenPos.y + "px";
                    break;
                case "center":
                default:
                    this.element.style.top = (screenPos.y - this.element.clientHeight * 0.5) + "px";

            }

        } else {
            this.element.style.display = "none";
        }
    }
    render() {
        return (
            < div className="cesium-tag" ref={element => this.element = element} style={{ ...this.props.textCss }} >
                {this.props.text}
                {this.props.children}
            </div >
        );
    }
}
