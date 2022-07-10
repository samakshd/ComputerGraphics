export const PhongVertexShaderSrc = `      
	attribute vec3 aPosition;
	
	uniform mat4 uModel;
	uniform mat4 uView;
	uniform mat4 uProjection;

	attribute vec3 aNormal;
	varying vec3 vNormal;

	varying vec3 surfaceWorldPosition;
	
	void main () {             
		gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0); 
		
		vNormal = normalize(mat3(uModel)*aNormal);
		surfaceWorldPosition = (uModel* vec4(aPosition,1)).xyz;
	}                          
`;