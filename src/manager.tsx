import React, { Fragment } from "react";
import { CustomeRiver } from "./demos/customeRiver";
import DomTagInfo from "./lib/domTag";
import { Iexample } from "./demos/iexample";
import { DomAnimationPoint } from "./lib/domAnimationPoint";
import { UpdateInstancesAttribute } from "./demos/updateInstancesAttribute";
import { CustomeGeometry } from "./demos/customeGeometry";


export class CesiumMain extends React.Component<{ viewer: Cesium.Viewer }, { append: any[] }> {

    constructor(props) {
        super(props);
        this.state = {
            append: []
        }
    }
    componentDidMount() {
        this.loop();

        // main.addDemo(new AutoRot(0.001));
        // main.chooseDemo(new Load3dtiles());
        // main.chooseDemo(new Adjust3dtilesHeight());
        // this.chooseDemo(new CustomeRiver());
        // this.chooseDemo(new UpdateInstancesAttribute());
        this.chooseDemo(new CustomeGeometry());
        // {
        //     this.state.append.push(<DomTagInfo key={Date.now()} text={"TAG!!!!!!!"} viewer={this.props.viewer} worldPos={Cesium.Cartesian3.fromDegrees(121, 31)}></DomTagInfo>);
        //     this.props.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(121, 31), new Cesium.Cartesian3(10, 10, 10));
        //     this.props.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY, null);
        //     this.setState({ append: this.state.append });
        // }
        // {
        //     this.state.append.push(<DomAnimationPoint key={Date.now()} text={""} viewer={this.props.viewer} worldPos={Cesium.Cartesian3.fromDegrees(121, 31)} ></DomAnimationPoint >);
        //     this.props.viewer.camera.lookAt(Cesium.Cartesian3.fromDegrees(121, 31), new Cesium.Cartesian3(10, 10, 10));
        //     this.props.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY, null);
        //     this.setState({ append: this.state.append });
        // }

    }
    private examples: Iexample[] = [];
    addDemo(example: Iexample) {
        this.examples.push(example);
    }

    chooseDemo(example: Iexample) {
        this.examples = [example];
        if (example.init != null && !example.beInit) {
            example.init({ viewer: this.props.viewer });
        }
    }

    removeDemo(example: Iexample) {
        let index = this.examples.indexOf(example);
        if (index != -1) {
            this.examples.splice(index, 1);
        }
    }

    private loop() {
        let lasTime;
        this.props.viewer.scene.preUpdate.addEventListener(() => {
            let dateNow = Date.now();
            let deltaTime = lasTime != null ? dateNow - lasTime : 0;
            lasTime = dateNow;

            let updateProps = { viewer: this.props.viewer, deltaTime: deltaTime };
            this.examples.forEach(item => {
                item.update(updateProps);
            });
        });
    }


    render() {

        return (
            <Fragment>
                {
                    this.state.append
                }
            </Fragment>
        )
    }

}

