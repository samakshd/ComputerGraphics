export class Scene
{
	constructor()
	{
		this.primitives = []
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
		}
	}

	centroid()
	{
		// @ToDo : Return the centroid as per the requirements of mode-2
		var Xs = [];
		var Ys = [];

		this.primitives.forEach( function (primitive) {
			var points = primitive.getUpdatedVertices();
			let len = points.length;
			for(let i=0;i<len;i++) {
				const x = points[i][0];
				const y = points[i][1];

				Xs.push(x);
				Ys.push(y);
			}
		});

		var xMax = Math.max.apply(Math, Xs);
		var xMin = Math.min.apply(Math, Xs);
		var yMin = Math.min.apply(Math, Ys);
		var yMax = Math.max.apply(Math, Ys);

		return new Float32Array([(xMax+xMin)/2,(yMax+yMin)/2]);

	}

	setCentroid() {
		this.centroid_final = this.centroid();
	}

	switchCentroid() {

		const cent = new Float32Array(this.centroid_final);
		this.primitives.forEach( function (primitive) {
			primitive.transform.saveState();
			primitive.transform.reset();
			primitive.transform.setCentroid(cent);
		});
	}

	moveUp(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.moveUp();
		});

		this.centroid_final[1] += step;
    }

    moveDown(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.moveDown();
		});

		this.centroid_final[1] -= step;
    }
    
    moveRight(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.moveRight();
		});

		this.centroid_final[0] += step;
    }

    moveLeft(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.moveLeft();
		});

		this.centroid_final[0] -= step;
    }

	scaleUp(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.scaleUp();
		});
	}

	scaleDown(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.scaleDown();
		});
	}

	rotateClockwise(step = 0.01) {
        this.primitives.forEach( function (primitive) {
			primitive.rotateClockwise();
		});
	}

	rotateCounterClockwise(step = 0.01) {
		this.primitives.forEach( function (primitive) {
			primitive.rotateCounterClockwise();
		});

	}

	explodeState() {

		this.primitives.forEach( function (primitive) {
			primitive.explodeState();
		});

	}


	reset() {
		this.primitives.forEach( function (primitive) {
			primitive.transform.reset();
		});
	}

}
