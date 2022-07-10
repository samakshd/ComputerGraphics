export class WebGLRenderer
{
	constructor()
	{
		this.domElement = document.createElement("canvas");		

		this.gl = this.domElement.getContext("webgl") || this.domElement.getContext("experimental-webgl");
		if (!this.gl) throw new Error("WebGL is not supported");

		this.left = 0;
		this.right = 0;

		this.setSize(50,50);
		this.clear(1.0,1.0,1.0,1.0);
	}	

	setSize(width, height)
	{
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	setAlignment(left,l) 
	{	
		this.left = l;

		this.domElement.style.left = left;
		this.domElement.style.position = "absolute";
	}

	setBorder(margin,color) {
		this.domElement.style.border = margin + " " + color;
	}

	clear(r,g,b,a)
	{
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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

	render(scene, shader) 
	{
		scene.primitives.forEach( function (primitive) {
			primitive.transform.updateModelTransformMatrix();

			shader.bindArrayBuffer(shader.vertexAttributesBuffer, primitive.vertexPositions);
			shader.fillAttributeData("aPosition", primitive.vertexPositions, 2,  2 * primitive.vertexPositions.BYTES_PER_ELEMENT, 0);		
			
			shader.setUniform4f("uColor", primitive.color);	
			shader.setUniformMatrix3fv("uMatrix",primitive.transform.modelTransformMatrix);	
			// Draw
			shader.drawArrays(primitive.vertexPositions.length / 2);
		});
	}

	glContext()
	{
		return this.gl;
	}

	mouseToClipCoord(mouseX,mouseY) {

		
		// @ToDo

		const centerX = this.domElement.width/2 + this.left;
		const centerY = this.domElement.height/2 + 10; 

		const clipCoord = [
			(mouseX-centerX)/(this.domElement.width/2),
			(centerY - mouseY)/(this.domElement.height/2)
		];

		return clipCoord;
	}
}