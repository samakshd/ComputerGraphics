import { Scene, Model, WebGLRenderer, Shader, Camera, LightSource} from './lib/threeD.js';
import {GouraudVertexShaderSrc} from './shaders/gouraudVertex.js';
import {GouraudFragmentShaderSrc} from './shaders/gouraudFragment.js';
import {PhongVertexShaderSrc} from './shaders/phongVertex.js';
import {PhongFragmentShaderSrc} from './shaders/phongFragment.js';
import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import {vec3} from 'https://cdn.skypack.dev/gl-matrix';

//Setting Up Renderer and WebGL Shaders
const renderer = new WebGLRenderer();
renderer.setSize( 940, 940 );
document.getElementById('RENDERING_CANVAS').appendChild(renderer.domElement);

//Setting Up the Shaders
const GouraudShader = new Shader(renderer.glContext(), GouraudVertexShaderSrc, GouraudFragmentShaderSrc);
const PhongShader = new Shader(renderer.glContext(), PhongVertexShaderSrc, PhongFragmentShaderSrc);

const shaders = [GouraudShader,PhongShader];


//Setting Up the Scene
const scene = new Scene();

//Importing Objects for the scene
var teapot = new Model(3);
fetch('./models/teapot.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		teapot.setVertexAttributesData(meshData.vertices);
		teapot.setVertexIndices(meshData.indices);
		teapot.setVertexNormals(meshData.vertexNormals);

		//Material Properties
		teapot.setColor(1,0,0);
		document.getElementById('TEAPOT_COLOR').value="#FF0000";
		document.getElementById('TEAPOT_COLOR').addEventListener('change',(e)=>{
			const color = e.target.value;
			const r = parseInt(color.substr(1,2), 16)/255
			const g = parseInt(color.substr(3,2), 16)/255
			const b = parseInt(color.substr(5,2), 16)/255
			teapot.setColor(r,g,b);
		})
		teapot.setKa(0.1);
		teapot.setKd(1);
		teapot.setKs(1);
		teapot.setShininess(200);

		//Light Properties
		teapot.lightSource.setAmbientColor(1,1,1);
		teapot.lightSource.setDiffuseColor(1,1,1);
		teapot.lightSource.setSpecularColor(1,1,1);


		teapot.transform.scale = [0.02,0.02,0.02];
		teapot.moveX(-0.4);
	})

var sphere = new Model(4);
fetch('./models/sphere.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		sphere.setVertexAttributesData(meshData.vertices);
		sphere.setVertexIndices(meshData.indices);
		sphere.setVertexNormals(meshData.vertexNormals);

		//Material Properties
		sphere.setColor(0,0,1);
		document.getElementById('SPHERE_COLOR').value="#0000FF";
		document.getElementById('SPHERE_COLOR').addEventListener('change',(e)=>{
			const color = e.target.value;
			const r = parseInt(color.substr(1,2), 16)/255
			const g = parseInt(color.substr(3,2), 16)/255
			const b = parseInt(color.substr(5,2), 16)/255
			sphere.setColor(r,g,b);
		})
		sphere.setKa(0.1);
		sphere.setKd(1);
		sphere.setKs(1);
		sphere.setShininess(200);

	

		//Light Properties
		sphere.lightSource.setAmbientColor(1,1,1);
		sphere.lightSource.setDiffuseColor(1,1,1);
		sphere.lightSource.setSpecularColor(1,1,1);


		sphere.transform.scale = [0.15,0.15,0.15];
		sphere.moveX(0.4);
	})


//Adding Objects to scene
scene.add(teapot);
scene.add(sphere);

//Light Sources in the scene
const lights = [];
lights.push(teapot.getLightSourceObj());
lights.push(sphere.getLightSourceObj());
document.getElementById('TEAPOT_LIGHT').innerText = 'ON';
document.getElementById('SPHERE_LIGHT').innerText = 'ON';
//Setting Up the Camera

//Top View Camera
var cameraPosition = [0,0,1];
var cameraUpVector = [0,1,0];
var cameraTarget = [0,0,0];
var cameraFOV = 70* Math.PI/180;
var cameraZNear = 0.01;
var cameraZFar = 2000;

const camera = new Camera(cameraPosition,cameraUpVector,cameraTarget,cameraFOV,cameraZNear,cameraZFar);




//Main Program Application

var selectedModelId = 2; //By Default None of the objects are selected
document.getElementById('SELECTED_OBJECT').innerText = 'None';
document.getElementById('SHADING').innerText = 'N/A';
var MeshTransformationMode = false;
var IlluminatorMode = false;
document.getElementById('MESH_MOVEMENT').innerText = 'OFF';
document.getElementById('ILLUMINATION_MODE').innerText = 'OFF';

let MouseCoordinates = 0;
var MouseDrag = false;
var MouseDownX, MouseDownY;

window.addEventListener("keydown",checkKeyDown,false);
window.addEventListener("mousedown",checkMouseDown,false);
window.addEventListener("mouseup",checkMouseUp,false);
window.addEventListener("mousemove",checkMouseMove,false);

function checkKeyDown(event) {

	if(event.key == '2') {
		selectedModelId = 2;
		document.getElementById('SELECTED_OBJECT').innerText = 'None';
		document.getElementById('SHADING').innerText = 'N/A';
	}
	else if(event.key == '3') {
		selectedModelId = 3;
		document.getElementById('SELECTED_OBJECT').innerText = 'Teapot';
		document.getElementById('SHADING').innerText =  (teapot.shaderMode==0)?'Gouraud':'Phong';
	}
	else if(event.key == '4') {
		selectedModelId = 4;
		document.getElementById('SELECTED_OBJECT').innerText = 'Sphere';
		document.getElementById('SHADING').innerText =  (sphere.shaderMode==0)?'Gouraud':'Phong';
	}
	else if(event.key == 'm' || event.key=='M') {
		MeshTransformationMode = !MeshTransformationMode;
		document.getElementById('MESH_MOVEMENT').innerText = (MeshTransformationMode)?'ON':'OFF';
		renderer.domElement.style.cursor = (MeshTransformationMode?'grab':'auto')
	}
	else if(event.key == 'i' || event.key =='I') {
		IlluminatorMode = !IlluminatorMode;
		document.getElementById('ILLUMINATION_MODE').innerText = (IlluminatorMode)?'ON':'OFF';
	}
	else if(event.key == 's' || event.key=='S') {
		if(selectedModelId != 2) {
			scene.primitives[selectedModelId-3].switchShaderMode();
			document.getElementById('SHADING').innerText =  (((selectedModelId-3)?sphere:teapot).shaderMode==0)?'Gouraud':'Phong';
		}
	}
	else if(event.key == '0') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].lightSource.switchOff();
			document.getElementById((selectedModelId-3)?'SPHERE_LIGHT':'TEAPOT_LIGHT').innerText = 'OFF';
		}
	}
	else if(event.key == '1') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].lightSource.switchOn();
			document.getElementById((selectedModelId-3)?'SPHERE_LIGHT':'TEAPOT_LIGHT').innerText = 'ON';
		}
	}
	else if(event.key == 'x') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveX(0.01);
		}
	}
	else if(event.key == 'X') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveX(-0.01);
		}
	}
	else if(event.key == 'y') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveY(0.01);
		}
	}
	else if(event.key == 'Y') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveY(-0.01);
		}
	}
	else if(event.key == 'z') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveZ(0.01);
		}
	}
	else if(event.key == 'Z') {
		if(MeshTransformationMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveZ(-0.01);
		}
	}
	else if(event.key == 'ArrowRight') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceX(0.01);
		}
	}
	else if(event.key == 'ArrowLeft') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceX(-0.01);
		}
	}
	else if(event.key == 'ArrowUp') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceY(0.01);
		}
	}
	else if(event.key == 'ArrowDown') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceY(-0.01);
		}
	}
	else if(event.key == '+') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceZ(0.01);
		}
	}
	else if(event.key == '-') {
		if(IlluminatorMode && selectedModelId >=3) {
			scene.primitives[selectedModelId-3].moveLightSourceZ(-0.01);
		}
	}

}


function checkMouseDown(event) {
	if(event.button == 0) {

		if(MeshTransformationMode && selectedModelId >= 3) {
			
			const mouseClipCoord = renderer.mouseToClipCoord(event.pageX,event.pageY);
			MouseDownX = mouseClipCoord[0];
			MouseDownY = mouseClipCoord[1];
			MouseDrag = true;
			renderer.domElement.style.cursor = 'grabbing';
		}
		
		
	}
}

function checkMouseUp(event) {
	MouseDrag = false;
	renderer.domElement.style.cursor = (MeshTransformationMode?'grab':'auto')
}

function checkMouseMove(event) {
	if(MeshTransformationMode && selectedModelId >= 3 && MouseDrag) {
		const clipCoord = renderer.mouseToClipCoord(event.pageX,event.pageY);
		var mouseMoveX = clipCoord[0];
		var mouseMoveY = clipCoord[1];

		MouseCoordinates = [mouseMoveX,mouseMoveY];

		const centroid = scene.primitives[selectedModelId-3].getUpdatedCentroid();
		const centroid_clip = camera.worldToClip(centroid);
	
		//Initial Vector P1
		var p1 = vec3.create();
		vec3.normalize(p1, vec3.fromValues(MouseDownX - centroid_clip[0], MouseDownY -centroid_clip[1], 10));
		// Moved Vector P2
		var p2 = vec3.create();
		vec3.normalize(p2, vec3.fromValues(MouseCoordinates[0] -centroid_clip[0], MouseCoordinates[1] - centroid_clip[1], 10));
		
		//Rotation Angle
		var theta = vec3.angle(p1, p2);
		theta = theta*10;

		// Rotation Axis
		var rotAxis = vec3.create();
		vec3.cross(rotAxis, p1, p2);

		scene.primitives[selectedModelId-3].rotate(theta,rotAxis);
	}
}


renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{	
	renderer.clear(0,0,0,1);
	renderer.render(scene, shaders, camera, lights);	
}

