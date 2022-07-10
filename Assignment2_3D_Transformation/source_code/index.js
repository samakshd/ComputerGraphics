import { Scene, Model, WebGLRenderer, Shader, Camera, Animation } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';
import webglObjLoader from 'https://cdn.skypack.dev/webgl-obj-loader';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const degrees_to_radians = deg => (deg * Math.PI) / 180.0;

//Setting Up Renderer and WebGL Shaders
const renderer = new WebGLRenderer();
renderer.setSize( 900, 900 );
document.body.appendChild( renderer.domElement );

const shader = new Shader(renderer.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader.use();


//Setting Up the Scene
const scene = new Scene();

//Importing Objects for the scene
var axisX = new Model(0);
fetch('./models/coordinateAxis.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		axisX.setVertexPositions(meshData.vertices);
		axisX.setIndices(meshData.indices);
		axisX.setColor([1,0,0]);
		axisX.transform.scale = [0.15,0.15,0.15];
		const rotationAngleZ = degrees_to_radians(-90);
		mat4.rotateZ(axisX.transform.rotationMatrix, axisX.transform.rotationMatrix, rotationAngleZ);
	})

var axisY = new Model(1);
fetch('./models/coordinateAxis.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		axisY.setVertexPositions(meshData.vertices);
		axisY.setIndices(meshData.indices);
		axisY.setColor([0,1,0]);
		axisY.transform.scale = [0.15,0.15,0.15];
	})

var axisZ = new Model(2);
fetch('./models/coordinateAxis.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		axisZ.setVertexPositions(meshData.vertices);
		axisZ.setIndices(meshData.indices);
		axisZ.setColor([0,0,1]);
		axisZ.transform.scale = [0.15,0.15,0.15];
		const rotationAngleX = degrees_to_radians(90);
		mat4.rotateX(axisZ.transform.rotationMatrix, axisZ.transform.rotationMatrix, rotationAngleX);
	})


var aeroplane = new Model(3);
fetch('./models/aeroplane.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		aeroplane.setVertexPositions(meshData.vertices);
		aeroplane.setIndices(meshData.indices);
		aeroplane.setColor([1,0,1]);
		aeroplane.transform.scale = [0.05,0.05,0.05];
		aeroplane.rotateX(1.57);
	})

var satellite = new Model(4);
fetch('./models/satellite.obj')
	.then(response => response.text())
	.then(data => {
		const objReadAsString = data;
		const meshData = new webglObjLoader.Mesh(objReadAsString);
		satellite.setVertexPositions(meshData.vertices);
		satellite.setIndices(meshData.indices);
		const r = 0;
		const g = 1; 
		const b = 1;
		satellite.setColor([r,g,b]);
		satellite.transform.scale = [0.05,0.05,0.05];
		satellite.rotateX(1.57);
	})


//Adding Objects to scene
scene.add(axisX);
scene.add(axisY);
scene.add(axisZ);
scene.add(aeroplane);
scene.add(satellite);


//Setting Up the Cameras

//Top View Camera
var cameraPosition1 = [0,0,20];
var cameraUpVector1 = [0,1,0];
var cameraTarget1 = [0,0,0];
var cameraFOV1 = 5.8* Math.PI/180;
var cameraZNear1 = 0.01;
var cameraZFar1 = 2000;

const camera_top = new Camera(cameraPosition1,cameraUpVector1,cameraTarget1,cameraFOV1,cameraZNear1,cameraZFar1);


//3D View Camera
var cameraPosition2 = [0,0,0];
var cameraUpVector2 = [0,0,1];
var cameraTarget2 = [0,0,0];
var cameraFOV2 = 50* Math.PI/180;
var cameraZNear2 = 0.01;
var cameraZFar2 = 2000;

const camera_3d = new Camera(cameraPosition2,cameraUpVector2,cameraTarget2,cameraFOV2,cameraZNear2,cameraZFar2);
camera_3d.translateX(-1.5);
camera_3d.translateY(-1.5);
camera_3d.translateZ(1.5);

//Setting Up the animation object
const objectAnimation = new Animation();


//Main Program Application
var mode_value = 1;
var selectedPrimitiveId = -1;
var cameraMouseDrag = false;
var MouseDownX, MouseDownY;
var selectedCameraRotationAxis = -1;

window.addEventListener("keydown",checkKeyDown,false);
window.addEventListener("mousedown",checkMouseDown,false);
window.addEventListener("mouseup",checkMouseUp,false);
window.addEventListener("mousemove",checkMouseMove,false);

function checkKeyDown(event) {
	console.log("Key Pressed: " + event.key);
	if(event.key == 'c') {
		mode_value = (mode_value+1)%2;
		if(mode_value == 0) {
			selectedCameraRotationAxis = -1;
		}
	}
	else if(event.key == 'a') {
		if(selectedPrimitiveId != -1) {
			objectAnimation.inAnimationMode = true;
		}
	}
	else if(event.key == 'X'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateX(0.01);
		}
	}
	else if (event.key == 'x'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateX(-0.01);
		}
	}
	else if (event.key == 'Y'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateY(0.01);
		}
	}
	else if (event.key == 'y'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateY(-0.01);
		}
	}
	else if (event.key == 'Z'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateZ(0.01);
		}
	}
	else if (event.key == 'z'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].rotateZ(-0.01);
		}
	}
	else if(event.key == 'ArrowRight'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].scale(0.001);
		}
	}
	else if(event.key == 'ArrowLeft'){
		if(selectedPrimitiveId != -1) {
			scene.primitives[selectedPrimitiveId].scale(-0.001);
		}
	}
	else if(event.key == 'ArrowUp') {
		if(mode_value == 0) {
			if(objectAnimation.inAnimation == true) {
				objectAnimation.speedUp();
			}
		}
	}
	else if(event.key == 'ArrowDown') {
		if(mode_value == 0) {
			if(objectAnimation.inAnimation == true) {
				objectAnimation.speedDown();
			}
		}
	}
	else if(event.key == '1') {
		if(mode_value == 1) {
			selectedCameraRotationAxis = 0;
		}
	}
	else if(event.key == '2') {
		if(mode_value == 1) {
			selectedCameraRotationAxis = 1;
		}
	}
	else if(event.key == '3') {
		if(mode_value == 1) {
			selectedCameraRotationAxis = 2;
		}
	}
	else if(event.key == 'r') {
		if(mode_value == 1) {
			camera_3d.reset();
		}
	}
}


function checkMouseDown(event) {
	if(event.button == 0) {
		if(mode_value == 0) {

			//Color of the pixel clicked
			const canvasCoord = renderer.mouseToCanvasCoord(event.clientX,event.clientY,event.target.getBoundingClientRect());
			const px_canvas = canvasCoord[0];
			const py_canvas = canvasCoord[1];

			const colorOfClickedPixel = shader.readPixels(px_canvas,py_canvas);

			if(selectedPrimitiveId != -1 && objectAnimation.inAnimationMode == true && objectAnimation.inAnimation == false) {

				const clipCoord = renderer.mouseToClipCoord(event.pageX,event.pageY);
				const px_clip = clipCoord[0];
				const py_clip = clipCoord[1];
				var pz_clip = (2*0.7*Math.random() - 0.7);
				if(pz_clip == 0) {
					pz_clip = 0.1;
				}

				const worldCoord = camera_top.clipToWorld([px_clip,py_clip,pz_clip]);

				objectAnimation.setPointP0(scene.primitives[selectedPrimitiveId].getUpdatedCentroid());
				
				if(objectAnimation.firstClick == false && objectAnimation.secondClick == false ) {
					objectAnimation.setPointP1(worldCoord);
					objectAnimation.firstClick = true;
				}
				else if(objectAnimation.firstClick == true && objectAnimation.secondClick == false) {
					objectAnimation.setPointP2(worldCoord);
					objectAnimation.secondClick = true;
				}
				
				if(objectAnimation.firstClick == true  && objectAnimation.secondClick == true) {
					objectAnimation.setCurveParameters();
					objectAnimation.inAnimation = true;
				}

			}

			//Picking the Object

			if(objectAnimation.inAnimationMode == false) {
				if(colorOfClickedPixel[0] == 255 && colorOfClickedPixel[1] == 0 && colorOfClickedPixel[2] == 255) {
				
						aeroplane.selected = true;
						satellite.selected = false;
						selectedPrimitiveId = 3;
				}
				else if(colorOfClickedPixel[0] == 0 && colorOfClickedPixel[1] == 255 && colorOfClickedPixel[2] == 255) {
						aeroplane.selected = false;
						satellite.selected = true;
						selectedPrimitiveId = 4;
				}
				else if(colorOfClickedPixel[0] == 0 && colorOfClickedPixel[1] == 0 && colorOfClickedPixel[2] == 0) {

				}
				else {
					aeroplane.selected = false;
					satellite.selected = false;
					selectedPrimitiveId = -1;
				}
			}
			
		}
		else if(mode_value == 1) {

			const clipCoord = renderer.mouseToClipCoord(event.pageX,event.pageY);
			MouseDownX = clipCoord[0];
			MouseDownY = clipCoord[1];

			cameraMouseDrag = true;
		}
	}
}

function checkMouseUp(event) {
	cameraMouseDrag = false;
}


function checkMouseMove(event) {
	if(mode_value == 1 && cameraMouseDrag == true) {
		const clipCoord = renderer.mouseToClipCoord(event.pageX,event.pageY);
		var mouseMoveX = clipCoord[0];
		var mouseMoveY = clipCoord[1];

		if(mouseMoveX > MouseDownX) {
			if(selectedCameraRotationAxis == 0) {
				camera_3d.rotateX(0.09);
			}
			else if(selectedCameraRotationAxis == 1) {
				camera_3d.rotateY(0.09);
			}
			else if(selectedCameraRotationAxis == 2) {
				camera_3d.rotateZ(0.09);
			}
		}
		else if(mouseMoveX < MouseDownX) {
			if(selectedCameraRotationAxis == 0) {
				camera_3d.rotateX(-0.09);
			}
			else if(selectedCameraRotationAxis == 1) {
				camera_3d.rotateY(-0.09);
			}
			else if(selectedCameraRotationAxis == 2) {
				camera_3d.rotateZ(-0.09);
			}
		}

		MouseDownX = mouseMoveX;
	}
}

renderer.setAnimationLoop( animation );

//Draw loop
function animation()
{	
	renderer.clear(0.9,0.9,0.9,1);

	if(objectAnimation.inAnimation == true && selectedPrimitiveId != -1) {

		if(objectAnimation.isFinished() == false) {
			objectAnimation.animate(scene.primitives[selectedPrimitiveId]);
		}
		else {
			objectAnimation.reset();
			scene.primitives[selectedPrimitiveId].selected = false;
			selectedPrimitiveId = -1;
		}
	
	}

	if(mode_value == 0) {
		renderer.render(scene, shader, camera_top);
	}
	else if(mode_value == 1) {
		renderer.render(scene, shader, camera_3d);
	}
	
}

