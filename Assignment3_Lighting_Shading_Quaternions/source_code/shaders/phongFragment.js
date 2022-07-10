export const PhongFragmentShaderSrc = `      		
    precision mediump float;   	
    varying vec3 vNormal;
	varying vec3 surfaceWorldPosition;

	//Material Properties
	uniform vec3 uColor;
	uniform float uShininess;
	uniform float Ka;
	uniform float Kd;
	uniform float Ks;

	//Eye Position
	uniform vec3 uEyeWorldPosition;

	struct Light {
		vec3 uLightWorldPosition;
		vec3 AmbientColor;
		vec3 DiffuseColor;
		vec3 SpecularColor;

		float attenuation_parameter_a;
		float attenuation_parameter_b;
		float attenuation_parameter_c;

		bool isOn;
	};

	#define NUM_OF_LIGHTS 2
	uniform Light LightSources[NUM_OF_LIGHTS];


	void main () { 
		


		vec4 finalColor = vec4(0.0,0.0,0.0,1.0);
		
		for(int i=0;i<NUM_OF_LIGHTS;i++) {

			vec3 surfaceToLightDirection = normalize(LightSources[i].uLightWorldPosition - surfaceWorldPosition);
			vec3 surfaceToEyeDirection = normalize(uEyeWorldPosition - surfaceWorldPosition);
			vec3 halfvector = normalize(surfaceToLightDirection + surfaceToEyeDirection);

			//Ambient Light Component
			vec3 ambient = LightSources[i].AmbientColor;

			//Diffuse Light Component
			float diff = max(dot(vNormal, surfaceToLightDirection), 0.0);
			vec3 diffuse = diff * LightSources[i].DiffuseColor;

			//Specular Light Component
			float spec = pow(dot(vNormal, halfvector), uShininess);
			vec3 specular = spec * LightSources[i].SpecularColor;
		
			//Attenuation
			float d = length(LightSources[i].uLightWorldPosition - surfaceWorldPosition);
			float a = LightSources[i].attenuation_parameter_a;
        	float b = LightSources[i].attenuation_parameter_b;
        	float c = LightSources[i].attenuation_parameter_c;

			float attenuation = clamp(1.0/(a + b*d + c*d*d), 0.0, 1.0);

			if(LightSources[i].isOn) {

				vec3 Color = Ka*ambient + attenuation*(Kd*diffuse + Ks*specular);
				finalColor += vec4(Color*uColor,1.0);
			}
		}
		gl_FragColor = finalColor;
	}                            
`;