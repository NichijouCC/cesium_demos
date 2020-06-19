import React from "react";
import './domTag.scss'

export interface ItagInfoProps {
    viewer: Cesium.Viewer;
    trackPos?: Cesium.Cartesian3;
    trackEntity?: Cesium.Entity;
    trackCursor?: boolean;
    text?: string;
    textCss?: React.CSSProperties
    children?: React.ReactNode,

    alignx?: AlignXPosEnum,
    aligny?: AlignYPosEnum,
}

export enum AlignXPosEnum {
    LEFT,
    CENTER,
    RIGHT
}
export enum AlignYPosEnum {
    TOP,
    CENTER,
    BOTOOM
}

export default class DomTagInfo extends React.Component<ItagInfoProps> {
    private trackPos: Cesium.Cartesian3 | undefined;
    private trackEntity: Cesium.Entity | undefined;
    protected element: HTMLDivElement;

    private mousePos: Cesium.Cartesian2;
    constructor(props: ItagInfoProps) {
        super(props);
        this.trackPos = props.trackPos;
        this.trackEntity = props.trackEntity;

        if (props.trackCursor) {
            const handler = new Cesium.ScreenSpaceEventHandler();
            handler.setInputAction((event) => {
                this.mousePos = event.endPosition;
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }
    }

    componentDidMount() {
        this.props.viewer.scene.preUpdate.addEventListener(this.onUpdate);
    }

    componentWillUnmount() {
        this.props.viewer.scene.preUpdate.removeEventListener(this.onUpdate);
    }
    private onUpdate = () => {
        if (this.element == null) return;
        let screenPos;
        if (this.props.trackCursor) {
            screenPos = this.mousePos;
        }
        else if (this.props.trackEntity) {
            let pos = this.trackEntity.position.getValue(Cesium.JulianDate.now());
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, pos);

        } else if (this.props.trackPos) {
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, this.trackPos);
        }

        if (screenPos) {
            this.element.style.display = "";

            switch (this.props.alignx) {
                case AlignXPosEnum.LEFT:
                    this.element.style.left = screenPos.x + "px";
                    break;
                case AlignXPosEnum.RIGHT:
                    this.element.style.left = (screenPos.x + this.element.clientWidth * 0.5) + "px";
                    break;
                case AlignXPosEnum.RIGHT:
                default:
                    this.element.style.left = (screenPos.x - this.element.clientWidth * 0.5) + "px";
            }

            switch (this.props.aligny) {
                case AlignYPosEnum.TOP:
                    this.element.style.top = (screenPos.y - this.element.clientHeight) + "px";
                    break;
                case AlignYPosEnum.BOTOOM:
                    // this.element.style.top = (screenPos.y + this.element.clientHeight * 0.5) + "px";
                    this.element.style.top = screenPos.y + "px";
                    break;
                case AlignYPosEnum.CENTER:
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
