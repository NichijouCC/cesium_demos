import React from "react";

export interface ItagInfoProps {
    viewer: Cesium.Viewer;
    worldPos?: Cesium.Cartesian3;
    trackEntity?: Cesium.Entity;
    text?: string;
    textCss?: React.CSSProperties
}
export default class DomTagInfo extends React.Component<ItagInfoProps> {
    private trackPos: Cesium.Cartesian3 | undefined;
    private trackEntity: Cesium.Entity | undefined;
    protected element: HTMLDivElement;


    constructor(props: ItagInfoProps) {
        super(props);
        this.trackPos = props.worldPos;
        this.trackEntity = props.trackEntity;
    }

    componentDidMount() {
        this.props.viewer.scene.preUpdate.addEventListener(this.onUpdate);
    }

    // componentWillUnmount() {
    //     this.props.viewer.scene.preUpdate.removeEventListener(this.onUpdate);
    // }
    private onUpdate = () => {
        let screenPos;
        if (this.props.trackEntity) {
            let pos = this.trackEntity.position.getValue(Cesium.JulianDate.now());
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, pos);

        } else if (this.props.worldPos) {
            screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.props.viewer.scene, this.trackPos);
        }

        if (screenPos) {
            this.element.style.display = "";
            this.element.style.left = (screenPos.x - this.element.clientWidth * 0.5) + "px";
            this.element.style.top = (screenPos.y - this.element.clientHeight * 0.5) + "px";
        } else {
            this.element.style.display = "none";
        }
    }
    render() {
        return (
            // <div className="tagContainer" style={{ backgroundImage: "url(" + tagImg + ")" ,position:"absolute",width:"363px",height:"108px",backgroundRepeat:"no-repeat",backgroundSize:"cover"}} ref={element=>this.element=element}>
            //     <div className="tag" style={{color:"#FFFF",position:"absolute",top:"14px",left:"17px"}} >{this.props.text}</div>
            // </div>

            < div className="tag" ref={element => this.element = element} style={{ ...this.props.textCss, color: "#FF33FF", position: "absolute", whiteSpace: "nowrap" }} >
                {this.props.text}
            </div >

        );
    }
}
