import {Transform} from './transform.js';

export class Triangle
{
	constructor(x1,y1, x2,y2, x3,y3, id, color)
	{
		this.id = id;
		this.color = color;

		this.referenceVertexPositions = new Float32Array([
			//  x , y,  z 
			x1,y1,
			x2,y2,
			x3,y3,
		]);	

		this.vertexPositions = new Float32Array([
			//  x , y,  z 
			x1,y1,
			x2,y2,
			x3,y3,
		]);		
		
		this.centroid = new Float32Array([(x1+x2+x3)/3, (y1+y2+y3)/3]);
		this.transform = new Transform(this.centroid);
	}

	moveUp(step = 0.01) {
        this.transform.translate[1] += step;
        this.centroid[1] += step;
    }

    moveDown(step = 0.01) {
        this.transform.translate[1] -= step;
        this.centroid[1] -= step;
    }
    
    moveRight(step = 0.01) {
        this.transform.translate[0] += step;
		this.centroid[0] += step;
    }

    moveLeft(step = 0.01) {
        this.transform.translate[0] -= step;
		this.centroid[0] -= step;
    }

	scaleUp(step = 0.01) {
		this.transform.scale[0] += step;
		this.transform.scale[1] += step;
	}

	scaleDown(step = 0.01) {
		this.transform.scale[0] -= step;
		this.transform.scale[1] -= step;
	}

	rotateClockwise(step = 0.01) {
		this.transform.rotationAngle += step;
	}

	rotateCounterClockwise(step = 0.01) {
		this.transform.rotationAngle -= step;
	}


	getUpdatedVertices() {
		
		var m3 = {
		  
			multiply: function(a, b) {
				var ax1 = a[0 * 2 + 0];
				var ay1 = a[0 * 2 + 1];

				var ax2 = a[1 * 2 + 0];
				var ay2 = a[1 * 2 + 1];

				var ax3 = a[2 * 2 + 0];
				var ay3 = a[2 * 2 + 1];

				var b00 = b[0 * 3 + 0];
				var b01 = b[0 * 3 + 1];
				var b02 = b[0 * 3 + 2];
				var b10 = b[1 * 3 + 0];
				var b11 = b[1 * 3 + 1];
				var b12 = b[1 * 3 + 2];
				var b20 = b[2 * 3 + 0];
				var b21 = b[2 * 3 + 1];
				var b22 = b[2 * 3 + 2];


				return [
					[b00 * ax1 + b10 * ay1 + b20 * 1,    b01 * ax1 + b11 * ay1 + b21 * 1],

					[b00 * ax2 + b10 * ay2 + b20 * 1,    b01 * ax2 + b11 * ay2 + b21 * 1],

					[b00 * ax3 + b10 * ay3 + b20 * 1,    b01 * ax3 + b11 * ay3 + b21 * 1],
				];
			}

		}

		return m3.multiply(this.vertexPositions, this.transform.modelTransformMatrix);
	}


	masterReset() {
		this.centroid = new Float32Array( [(this.vertexPositions[0] + this.vertexPositions[2] + this.vertexPositions[4])/3, 
										  (this.vertexPositions[1] + this.vertexPositions[3] + this.vertexPositions[5])/3]);

		this.transform = new Transform(this.centroid);
	}

	explodeState() {

		const centerX = (Math.random()*0.5) - 0.25;
		const centerY = (Math.random()*0.5) - 0.25;

		this.vertexPositions[0] = this.referenceVertexPositions[0] +  centerX;
		this.vertexPositions[1] = this.referenceVertexPositions[1] + centerY;

		this.vertexPositions[2] = this.referenceVertexPositions[2] + centerX;
		this.vertexPositions[3] = this.referenceVertexPositions[3] + centerY;
		
		this.vertexPositions[4] = this.referenceVertexPositions[4] + centerX;
		this.vertexPositions[5] = this.referenceVertexPositions[5] + centerY;

		this.masterReset();
	}

	

}