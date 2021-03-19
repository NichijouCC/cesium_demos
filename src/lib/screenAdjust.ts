export class ScreenAdjust {
    private static init(viewer: Cesium.Viewer) {
        let fragmentShaderSource =
            'uniform sampler2D colorTexture; \n' +
            'varying vec2 v_textureCoordinates; \n' +
            'uniform float _Brightness; \n' +
            'uniform float _Saturation; \n' +
            'uniform float _Contrast; \n' +

            'void main(void) \n' +
            '{ \n' +
            'vec4 renderTex=texture2D(colorTexture, v_textureCoordinates); \n' +
            '    vec3 finalColor=renderTex.rgb*_Brightness;\n' +

            '    float luminance = 0.2125 * renderTex.r + 0.7154 * renderTex.g + 0.0721 * renderTex.b;\n' +
            '    vec3 luminanceColor = vec3(luminance, luminance, luminance);\n' +
            '    finalColor = mix(luminanceColor, finalColor, _Saturation);\n' +

            '    vec3 avgColor = vec3(0.5, 0.5, 0.5);\n' +
            '    finalColor = mix(avgColor, finalColor, _Contrast);' +

            '    gl_FragColor = vec4(finalColor, renderTex.a); \n' +
            '} \n';
        let stage = viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
            fragmentShader: fragmentShaderSource,
            uniforms: {
                _Brightness: 1.0,
                _Saturation: 1.0,
                _Contrast: 1.0,
            }
        }));
        return stage;
    }

    private static stage: Cesium.PostProcessStage;
    static async set(viewer: Cesium.Viewer, options: { brightness?: number, saturation?: number, contrast?: number }) {
        if (this.stage == null) {
            this.stage = this.init(viewer);
        }
        if (options.brightness != null) {
            this.stage.uniforms["_Brightness"] = options.brightness;
        }
        if (options.saturation != null) {
            this.stage.uniforms["_Saturation"] = options.saturation;
        }
        if (options.contrast != null) {
            this.stage.uniforms["_Contrast"] = options.contrast;
        }
    }
}