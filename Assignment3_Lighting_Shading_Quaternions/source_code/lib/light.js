import {Transform} from './transform.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class LightSource {
    
    constructor() {
        this.position = vec3.fromValues(0,0,0);
        this.ambientColor = vec3.fromValues(1,1,1);
        this.diffuseColor = vec3.fromValues(1,1,1);
        this.specularColor = vec3.fromValues(1,1,1);

        this.attenuationParameter_a = 0.1;
        this.attenuationParameter_b = 1;
        this.attenuationParameter_c = 10;

        this.isOn = true;

        this.transform = new Transform();
        this.transform.updateModelTransformMatrix();
    }

    setPosition(px,py,pz) {
        this.position = vec3.fromValues(px,py,pz);
    }
    setAmbientColor(r,g,b) {
        this.ambientColor = vec3.fromValues(r,g,b);
    }
    setDiffuseColor(r,g,b) {
        this.diffuseColor = vec3.fromValues(r,g,b);
    }
    setSpecularColor(r,g,b) {
        this.specularColor = vec3.fromValues(r,g,b);
    }

    getUpdatedPosition() {
        return vec3.transformMat4([],this.position,this.transform.modelTransformMatrix);
    }

    switchOn() {
        this.isOn = true;
    }
    switchOff() {
        this.isOn = false;
    }


}