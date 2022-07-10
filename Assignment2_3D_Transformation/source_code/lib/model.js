import {Transform} from './transform.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Model {

    constructor(modelId)
	{	
		this.modelId = modelId;
		this.vertexPositions = [];
		this.indices = [];
		this.color = [];
		this.transform = new Transform(0);
		this.selected = false;

		this.transform.updateModelTransformMatrix();
	}

	setVertexPositions(vertices) {
		this.vertexPositions = new Float32Array(vertices);
	}

	setIndices(indices) {
		this.indices = new Uint16Array(indices);
	}

	setColor(color) {
		this.color = color;
	}

	getUpdatedCentroid() {
		return vec3.transformMat4([],[0,0,0],this.transform.modelTransformMatrix);
	}

	rotateX(theta) {
		const currRotation = mat4.create();
		mat4.rotateX(currRotation,currRotation,theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
    }

    rotateY(theta) {;
		const currRotation = mat4.create();
		mat4.rotateY(currRotation,currRotation,theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
    }

    rotateZ(theta) {
        const currRotation = mat4.create();
		mat4.rotateZ(currRotation,currRotation,theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
    }

    scale(step) {
        this.transform.scale[0] += step;
        this.transform.scale[1] += step;
        this.transform.scale[2] += step;
    }




}