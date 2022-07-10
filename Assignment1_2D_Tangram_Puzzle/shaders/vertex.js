export const vertexShaderSrc = `      
	attribute vec2 aPosition;
	
	uniform mat3 uMatrix;

	void main () {
		vec2 position = (uMatrix * vec3(aPosition, 1)).xy;             
		gl_Position = vec4(position,0.0, 1.0); 
	}                          
`;