import {Transform} from './transform.js';
import { vec3, mat4, quat } from 'https://cdn.skypack.dev/gl-matrix';
import { LightSource } from './light.js';

export class Model {

    constructor(modelId)
	{	
		this.modelId = modelId;
		this.vertexAttributesData = [];
		this.vertexIndices = [];
		this.vertexNormals = [];

		this.transform = new Transform();
		this.lightSource = new LightSource();

		this.selected = false;

		//Shader Mode
		this.shaderMode = 0;

		//Material Properties w.r.t Light
		this.color = [1.0,1.0,1.0];
		this.ka = 1.0;
		this.kd = 1.0;
		this.ks = 1.0;
		this.shininess = 10;

		this.transform.updateModelTransformMatrix();
	}

	setVertexAttributesData(vertices) {
		this.vertexAttributesData = new Float32Array(vertices);
	}
	setVertexIndices(vertexIndices) {
		this.vertexIndices = new Uint16Array(vertexIndices);
	}
	setVertexNormals(normals) {
		this.vertexNormals = new Float32Array(normals);
	}
	setColor(r,g,b) {
		this.color = [r,g,b];
	}
	setKa(ka) {
		this.ka = ka;
	}
	setKd(kd) {
		this.kd = kd;
	}
	setKs(ks) {
		this.ks = ks;
	}

	setShininess(shine) {
		this.shininess = shine;
	}

	switchShaderMode() {
		this.shaderMode = (this.shaderMode+1)%2;
	}

	getLightSourceObj() {
		return this.lightSource;
	}

	getUpdatedCentroid() {
		return vec3.transformMat4([],[0,0,0],this.transform.modelTransformMatrix);
	}

	moveX(step) {
		this.transform.translate[0] += step;
		this.lightSource.transform.translate[0] += step;
	}

	moveY(step) {
		this.transform.translate[1] += step;
		this.lightSource.transform.translate[1] += step;
	}

	moveZ(step) {
		this.transform.translate[2] += step;
		this.lightSource.transform.translate[2] += step;
	}

	moveLightSourceX(step) {
		this.lightSource.transform.translate[0] += step;
		this.lightSource.transform.updateModelTransformMatrix();
		if(this.checkLightBoundations() == 1) {
			this.lightSource.transform.translate[0] -= step;
			this.lightSource.transform.updateModelTransformMatrix();
		}
	}

	moveLightSourceY(step) {
		this.lightSource.transform.translate[1] += step;
		this.lightSource.transform.updateModelTransformMatrix();
		if(this.checkLightBoundations() == 1) {
			this.lightSource.transform.translate[1] -= step;
			this.lightSource.transform.updateModelTransformMatrix();
		}
	}

	moveLightSourceZ(step) {
		this.lightSource.transform.translate[2] += step;
		this.lightSource.transform.updateModelTransformMatrix();
		if(this.checkLightBoundations() == 1) {
			this.lightSource.transform.translate[2] -= step;
			this.lightSource.transform.updateModelTransformMatrix();
		}
	}

    scale(step) {
        this.transform.scale[0] += step;
        this.transform.scale[1] += step;
        this.transform.scale[2] += step;
    }


	rotate(theta,rotAxis) {

	
		var RotQuat = quat.create();
		quat.setAxisAngle(RotQuat,rotAxis,theta);
		quat.normalize(RotQuat,RotQuat);
		var RotMat = mat4.create();
		mat4.fromQuat(RotMat,RotQuat);

		mat4.multiply(this.transform.rotationMatrix,RotMat,this.transform.rotationMatrix);
		if(this.checkLightBoundations() == 1) {
			const centroid = this.getUpdatedCentroid();
			this.lightSource.transform.translate[0]=centroid[0];
			this.lightSource.transform.translate[1]=centroid[1];
			this.lightSource.transform.translate[2]=centroid[2];
		}
	}

	checkLightBoundations() {

		const maxVals = this.findLightBoundingBox()[0];
		const minVals = this.findLightBoundingBox()[1];


		const minX = minVals[0];
		const minY = minVals[1];
		const minZ = minVals[2];

		const maxX = maxVals[0];
		const maxY = maxVals[1];
		const maxZ = maxVals[2];
		
		
		const currX = this.lightSource.getUpdatedPosition()[0];
		const currY = this.lightSource.getUpdatedPosition()[1];
		const currZ = this.lightSource.getUpdatedPosition()[2];



		let invTransMatrix = mat4.create();
		mat4.invert(invTransMatrix,this.transform.modelTransformMatrix);

		let transformedCoordinates = vec3.create();
		vec3.transformMat4(transformedCoordinates,vec3.fromValues(currX,currY,currZ),invTransMatrix);

		if(transformedCoordinates[0] > maxX || transformedCoordinates[0] < minX) {
			return 1;
		}

		if(transformedCoordinates[1] > maxY || transformedCoordinates[1] < minY) {
			return 1;
		}

		if(transformedCoordinates[2] > maxZ || transformedCoordinates[2] < minZ) {
			return 1;
		}

		return 0;
	}

	findLightBoundingBox() {

        var maxX = -Infinity;
        var maxY = -Infinity;
        var maxZ = -Infinity;
        var minX = Infinity;
        var minY = Infinity;
        var minZ = Infinity;

        for(var i=0;i<this.vertexAttributesData.length;i++) {
            if(i%3 == 0) {
                if(this.vertexAttributesData[i] > maxX) {
                    maxX = this.vertexAttributesData[i];
                }
                if(this.vertexAttributesData[i] < minX) {
                    minX = this.vertexAttributesData[i];
                }
            }
            else if(i%3 == 1) {
                if(this.vertexAttributesData[i] > maxY) {
                    maxY = this.vertexAttributesData[i];
                }
                if(this.vertexAttributesData[i] < minY) {
                    minY = this.vertexAttributesData[i];
                }
            }
            else {
                if(this.vertexAttributesData[i] > maxZ) {
                    maxZ = this.vertexAttributesData[i];
                }
                if(this.vertexAttributesData[i] < minZ) {
                    minZ = this.vertexAttributesData[i];
                }
            }
        }

		const maxVals = vec3.fromValues(maxX*1.25,maxY*1.25,maxZ*1.25)
		const minVals = vec3.fromValues(minX*1.25,minY*1.25,minZ*1.25)

        return [maxVals,minVals];
    }
}