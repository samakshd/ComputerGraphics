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

	render(scene, shader, camera) 
	{
		camera.transform.updateModelTransformMatrix();
		camera.updateViewTransformationMatrix();
		camera.updateProjectionTransformationMatrix();

		scene.primitives.forEach( function (primitive) {
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexPositions);
			shader.bindElementArrayBuffer(shader.indexBuffer,primitive.indices);
			shader.fillAttributeData("aPosition", primitive.vertexPositions, 3,  3 * primitive.vertexPositions.BYTES_PER_ELEMENT, 0);		
			
			if(!primitive.selected) {
				shader.setUniform3f("uColor", primitive.color);
			}
			else {
				shader.setUniform3f("uColor", [0,0,0]);
			}				
			shader.setUniformMatrix4fv("u_model", primitive.transform.modelTransformMatrix);
			shader.setUniformMatrix4fv("u_view", camera.viewTransformationMatrix);
			shader.setUniformMatrix4fv("u_projection", camera.projectionTransformationMatrix);
			
			// Draw
			shader.drawElements(primitive.indices.length);
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