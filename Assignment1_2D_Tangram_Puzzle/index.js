import { Scene, Triangle, Quadrilateral, WebGLRenderer, Shader } from './lib/threeD.js';
import {vertexShaderSrc} from './shaders/vertex.js';
import {fragmentShaderSrc} from './shaders/fragment.js';


const renderer1 = new WebGLRenderer();
renderer1.setSize( 700, 700 );
renderer1.setBorder("1px","solid green");
document.body.appendChild( renderer1.domElement );


const bigTriangle1_b = new Triangle(0,0,-0.5,0.5, 0.5,0.5,  -1,[1.0,0.64,0.0,1.0]);
const bigTriangle2_b = new Triangle(0,0,0.5,0.5, 0.5,-0.5,  -1,[0,0,1,1]);

const mediumTriangle_b = new Triangle(-0.5,-0.5, -0.5,0, 0,-0.5,  -1,[0,1,0,1]);

const smallTriangle1_b = new Triangle(0,0,-0.25, -0.25, -0.25,0.25,  -1,[0,1,1,1]);
const smallTriangle2_b = new Triangle(0.25,-0.25, 0.0,-0.5, 0.5,-0.5,  -1,[1,1,0,1]);

const square_b = new Quadrilateral(0,0, 0.25,-0.25, -0.25,-0.25, 0,-0.5, -1, [1,0,0,1]);

const parallelogram_b = new Quadrilateral(-0.5,0.5, -0.5,0.0,-0.25,0.25, -0.25,-0.25, -1, [1,0,1,1]);

const scene1 = new Scene();



scene1.add(bigTriangle1_b);
scene1.add(bigTriangle2_b);
scene1.add(mediumTriangle_b);
scene1.add(smallTriangle1_b);
scene1.add(smallTriangle2_b);
scene1.add(square_b);
scene1.add(parallelogram_b);

const shader1 = new Shader(renderer1.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader1.use();

renderer1.clear(1.0,1.0,1.0,1);
renderer1.render(scene1, shader1);	





const renderer2 = new WebGLRenderer();
renderer2.setSize( 700, 700 );
renderer2.setAlignment("720px",720);
renderer2.setBorder("1px","solid red");
document.body.appendChild( renderer2.domElement );


const bigTriangle1 = new Triangle(0,0,-0.5,0.5, 0.5,0.5,  0,[1.0,0.64,0.0,1.0]);
const bigTriangle2 = new Triangle(0,0,0.5,0.5, 0.5,-0.5,  1,[0,0,1,1]);

const mediumTriangle = new Triangle(-0.5,-0.5, -0.5,0, 0,-0.5,  2,[0,1,0,1]);

const smallTriangle1 = new Triangle(0,0,-0.25, -0.25, -0.25,0.25,  3,[0,1,1,1]);
const smallTriangle2 = new Triangle(0.25,-0.25, 0.0,-0.5, 0.5,-0.5,  4,[1,1,0,1]);

const square = new Quadrilateral(0,0, 0.25,-0.25, -0.25,-0.25, 0,-0.5, 5, [1,0,0,1]);

const parallelogram = new Quadrilateral(-0.5,0.5, -0.5,0.0,-0.25,0.25, -0.25,-0.25, 6, [1,0,1,1]);

const scene2 = new Scene();



scene2.add(bigTriangle1);
scene2.add(bigTriangle2);
scene2.add(mediumTriangle);
scene2.add(smallTriangle1);
scene2.add(smallTriangle2);
scene2.add(square);
scene2.add(parallelogram);


const shader2 = new Shader(renderer2.glContext(), vertexShaderSrc, fragmentShaderSrc);
shader2.use();


var mode_value = 0;
var selectedPrimitiveId = -1;




window.addEventListener("keydown",checkKeyDown,false);
window.addEventListener("mousedown",checkMouseDown,false);

function checkKeyDown(event) {

	//m key
	if(event.keyCode == 77) { 
		mode_value = (mode_value+1)%4;

		console.log("Mode Value:" + mode_value);

		if(mode_value == 0) {
			scene2.explodeState();
		}
		else if(mode_value == 2) {
			scene2.setCentroid();
			scene2.switchCentroid();
		}
	}
	//Up key
	else if(event.keyCode == 38) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				if(scene2.primitives[id].centroid[1] < 1) {
					scene2.primitives[id].moveUp();
				}

			}
		}
		else if(mode_value == 2) {

			if(scene2.centroid_final[1] < 1) {
				scene2.moveUp();
			}
			
		}
	}
	//Down Key
	else if(event.keyCode == 40) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				if(scene2.primitives[id].centroid[1] > -1) {
					scene2.primitives[id].moveDown();
				}

			}
		}
		else if(mode_value == 2) {

			if(scene2.centroid_final[1] > -1) {
				scene2.moveDown();
			}
			
		}
	}
	//Right Key 
	else if(event.keyCode == 39) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				if(scene2.primitives[id].centroid[0] < 1) {
					scene2.primitives[id].moveRight();
				}

				

			}
		}
		else if(mode_value == 2) {
			if(scene2.centroid_final[0] < 1) {
				scene2.moveRight();
			}
			
		}
	}
	//Left Key
	else if(event.keyCode == 37) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				if(scene2.primitives[id].centroid[0] > -1) {
					scene2.primitives[id].moveLeft();
				}
			}
		}
		else if(mode_value == 2) {
			if(scene2.centroid_final[0] > -1) {
				scene2.moveLeft();
			}
			
		}
	}
	//+ key
	else if(event.keyCode == 61) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;				
				scene2.primitives[id].scaleUp();

			}
		}
		else if(mode_value == 2) {
			scene2.scaleUp();
		}
	}
	//- key
	else if(event.keyCode == 173) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				scene2.primitives[id].scaleDown();

			}
		}
		else if(mode_value == 2) {
			scene2.scaleDown();
		}
	} 

	// ( key
	else if(event.keyCode == 57) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {
				const id = selectedPrimitiveId;
				scene2.primitives[id].rotateCounterClockwise();

			}
		}
		else if(mode_value == 2) {
			scene2.rotateCounterClockwise();
		}
	} 

	// ) key
	else if(event.keyCode == 48) {
		if(mode_value == 1) {
			if(selectedPrimitiveId >= 0) {

				const id = selectedPrimitiveId;
				scene2.primitives[id].rotateClockwise();

			}
		}
		else if(mode_value == 2) {
			scene2.rotateClockwise();
		}
	} 
}

function checkMouseDown(event) {

	//m key
	if(event.button == 0) { 
		if(mode_value == 1) {
			var minm_dist = 10000;

			const clipCoord = renderer2.mouseToClipCoord(event.pageX,event.pageY);
			const px = clipCoord[0];
			const py = clipCoord[1];


			
			scene2.primitives.forEach( function (primitive) {
				
				const dist = (px-primitive.centroid[0])* (px-primitive.centroid[0]) + (py-primitive.centroid[1])* (py-primitive.centroid[1]);
				
				if(dist < minm_dist) {
					selectedPrimitiveId = primitive.id;
					minm_dist = dist;
				}
			});

		}
	}
}

scene2.explodeState();
renderer2.setAnimationLoop( animation2 );
console.log("Mode Value:" + mode_value);
function animation2()
{	
	renderer2.clear(1.0,1.0,1.0,1);

	if(mode_value == 0) {
		renderer2.render(scene2, shader2);	
		selectedPrimitiveId = -1;
	}
	else if(mode_value == 1) {
		renderer2.render(scene2, shader2);	
	}
	else if(mode_value == 2) {
		renderer2.render(scene2, shader2);	
		selectedPrimitiveId = -1;
	}
	else if(mode_value == 3) {
		selectedPrimitiveId = -1;
	}

	
}








