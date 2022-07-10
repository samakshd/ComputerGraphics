export const vertexShaderSrc = `      
	attribute vec3 aPosition;

	uniform mat4 u_model;
	uniform mat4 u_view;
	uniform mat4 u_projection;
	
	void main () {             
		gl_Position = u_projection * u_view * u_model * vec4(aPosition, 1.0); 
	}                          
`;