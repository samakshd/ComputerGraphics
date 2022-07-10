import {Transform} from './transform.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Camera {
    constructor(position, upVector, target, fov, zNear, zFar) {

        this.position = position;
        this.upVector = upVector;
        this.target = target;

        this.fov = fov;
        this.zNear = zNear;
        this.zFar = zFar;

        this.transform = new Transform();
        this.viewTransformationMatrix = mat4.create();
        this.projectionTransformationMatrix = mat4.create();        

        this.transform.updateModelTransformMatrix();
        this.updateViewTransformationMatrix();
        this.updateProjectionTransformationMatrix();

    }

    getUpdatedPosition(position) {
        return vec3.transformMat4([],position,this.transform.modelTransformMatrix);
    }

    
    updateViewTransformationMatrix() {

        var updatedCameraPosition = this.getUpdatedPosition(this.position);
        var updatedUpVector = this.getUpdatedPosition(this.upVector);

        mat4.identity(this.viewTransformationMatrix);
        mat4.lookAt(this.viewTransformationMatrix,updatedCameraPosition,this.target,updatedUpVector);
    }

    updateProjectionTransformationMatrix() {

        mat4.identity(this.projectionTransformationMatrix);
        mat4.perspective(this.projectionTransformationMatrix,this.fov,1,this.zNear,this.zFar);
    }

    translateX(distance) {
        this.transform.translate[0] += distance;
    }

    translateY(distance) {
        this.transform.translate[1] += distance;
    }
    translateZ(distance) {
        this.transform.translate[2] += distance;
    }

    rotateX(theta) {
        const currRotation = mat4.create();
		mat4.rotateX(currRotation,currRotation,-theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
    }

    rotateY(theta) {;
        const currRotation = mat4.create();
		mat4.rotateY(currRotation,currRotation,-theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
        
    }

    rotateZ(theta) {
        const currRotation = mat4.create();
		mat4.rotateZ(currRotation,currRotation,-theta);
        mat4.multiply(this.transform.rotationMatrix,currRotation,this.transform.rotationMatrix);
        
    }

    worldToClip(worldCoord) {

        let viewProj = mat4.create();
        mat4.multiply(viewProj,this.projectionTransformationMatrix,this.viewTransformationMatrix);

        let clip = vec3.create();
        vec3.transformMat4(clip,worldCoord,viewProj);

        return clip;
    }

    clipToWorld(clipCoord) {

        let viewMatInv = mat4.create();
        viewMatInv = mat4.invert(viewMatInv,this.viewTransformationMatrix);

        let projMatInv = mat4.create();
        projMatInv = mat4.invert(projMatInv,this.projectionTransformationMatrix);

        let viewProjInv = mat4.create();
        mat4.multiply(viewProjInv,viewMatInv,projMatInv);


        let clip = vec3.create();
        vec3.set(clip,clipCoord[0],clipCoord[1],0);

        var world = vec3.create();
        vec3.transformMat4(world,clip,viewProjInv);
        
        return world;   
    }

    reset() {
        mat4.identity(this.transform.rotationMatrix);
    }

}