import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

export class Transform
{
	constructor()
	{

		this.translate = vec3.create();
		vec3.set(this.translate, 0, 0, 0);
		
		this.scale = vec3.create();
		vec3.set(this.scale, 1, 1, 1);
		
		this.rotationMatrix = mat4.create();

		this.modelTransformMatrix = mat4.create();
		mat4.identity(this.modelTransformMatrix);

		this.updateModelTransformMatrix();
	}

	updateModelTransformMatrix()
	{
		mat4.identity(this.modelTransformMatrix);
		
		mat4.translate(this.modelTransformMatrix, this.modelTransformMatrix, this.translate);
		mat4.multiply(this.modelTransformMatrix,this.modelTransformMatrix,this.rotationMatrix);
		mat4.scale(this.modelTransformMatrix,this.modelTransformMatrix,this.scale);
	}	
}