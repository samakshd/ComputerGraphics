export class WebGLRenderer
{
	constructor()
	{
		this.domElement = document.createElement("canvas");		

		this.gl = this.domElement.getContext("webgl",{preserveDrawingBuffer: true}) || this.canvas.getContext("experimental-webgl",{preserveDrawingBuffer: true});
		if (!this.gl) throw new Error("WebGL is not supported");

		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}	

	setSize(width, height)
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	clear(r,g,b,a)
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT) | this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
	}

	setAnimationLoop(animation) 
	{
		function renderLoop()
		{
			animation();
			window.requestAnimationFrame(renderLoop);
		}	

		renderLoop();
		  
	}

	render(scene, shaders, camera, lights) 
	{
		camera.transform.updateModelTransformMatrix();
		camera.updateViewTransformationMatrix();
		camera.updateProjectionTransformationMatrix();

		scene.primitives.forEach( function (primitive) {
			primitive.transform.updateModelTransformMatrix();
			primitive.lightSource.transform.updateModelTransformMatrix();
			
			var shader = shaders[primitive.shaderMode];
			shader.use();

			const elementsPerVertex = 3;

			//Vertex Positions Attribute
			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexAttributesData);
			shader.bindElementArrayBuffer(shader.indexBuffer,primitive.vertexIndices);
			shader.fillAttributeData("aPosition", elementsPerVertex,  0, 0);	
			
			//Vertex Normals Attribute
			shader.bindArrayBuffer(shader.vertexNormalsBuffer, primitive.vertexNormals);
			shader.fillAttributeData("aNormal", elementsPerVertex,  0, 0);
			
			//Uniform Transformation Matrix
			shader.setUniformMatrix4fv("uModel", primitive.transform.modelTransformMatrix);
			shader.setUniformMatrix4fv("uView", camera.viewTransformationMatrix);
			shader.setUniformMatrix4fv("uProjection", camera.projectionTransformationMatrix);
			
			//Material Properties
			shader.setUniform3f("uColor", primitive.color);
			shader.setUniform1f("uShininess", primitive.shininess);
			shader.setUniform1f("Ka", primitive.ka);
			shader.setUniform1f("Kd", primitive.kd);
			shader.setUniform1f("Ks", primitive.ks);

			//Eye World Position
			shader.setUniform3f("uEyeWorldPosition",camera.position);

			//Light Properties
			for(var i in lights) {
				
				shader.setUniform3f("LightSources[" + i + "].uLightWorldPosition", lights[i].getUpdatedPosition());
				shader.setUniform3f("LightSources[" + i + "].AmbientColor", lights[i].ambientColor);
				shader.setUniform3f("LightSources[" + i + "].DiffuseColor", lights[i].diffuseColor);
				shader.setUniform3f("LightSources[" + i + "].SpecularColor", lights[i].specularColor);

				shader.setUniform1f("LightSources[" + i + "].attenuation_parameter_a", lights[i].attenuationParameter_a);
				shader.setUniform1f("LightSources[" + i + "].attenuation_parameter_b", lights[i].attenuationParameter_b);
				shader.setUniform1f("LightSources[" + i + "].attenuation_parameter_c", lights[i].attenuationParameter_c);

				shader.setUniform1i("LightSources[" + i + "].isOn",lights[i].isOn);
			}

			// Draw
			shader.drawElements(primitive.vertexIndices.length);
		});

		
	}

	glContext()
	{
		return this.gl;
	}

	mouseToCanvasCoord(mouseX,mouseY,rect) {

		// @ToDo
		const centerX = this.domElement.width/2;
		const centerY = this.domElement.height/2; 

		const clipCoord = [
			mouseX - rect.left,
			rect.bottom - mouseY 
		];

		return clipCoord;
	}

	mouseToClipCoord(mouseX,mouseY) {

		
		// @ToDo

		const centerX = this.domElement.width/2;
		const centerY = this.domElement.height/2; 

		const clipCoord = [
			(mouseX-centerX)/(this.domElement.width/2),
			(centerY - mouseY)/(this.domElement.height/2)
		];

		return clipCoord;
	}
}