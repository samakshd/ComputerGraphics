export class Animation {
    constructor() {

        this.time = 0;
        this.time_step = 0.001;
        this.firstClick = false;
        this.secondClick = false;
        this.inAnimationMode = false;
        this.inAnimation = false;

        //Curve Points
        this.p0 = [];
        this.p1 = [];
        this.p2 = [];

        //Curve Parameters
        this.a = [];
        this.b = [];
        this.c = [];
    }

    findDistance(p1,p2) {
        return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]) + (p1[2]-p2[2])*(p1[2]-p2[2]));
    }

    setCurveParameters() {
        var t1 = 0.5;
        t1 = this.findDistance(this.p0,this.p1)/(this.findDistance(this.p0,this.p1) + this.findDistance(this.p1,this.p2));
        // t1 = d(p0p1)/[d(p0p1) + d(p1p2)]


        this.a = [(this.p1[0]-this.p0[0] + this.p0[0]*t1 - this.p2[0]*t1)/(t1*t1 - t1),
                  (this.p1[1]-this.p0[1] + this.p0[1]*t1 - this.p2[1]*t1)/(t1*t1 - t1),
                  (this.p1[2]-this.p0[2] + this.p0[2]*t1 - this.p2[2]*t1)/(t1*t1 - t1) ];
        
        this.b = [(this.p1[0]-this.p0[0] + this.p0[0]*t1*t1 - this.p2[0]*t1*t1)/(t1 - t1*t1),
                  (this.p1[1]-this.p0[1] + this.p0[1]*t1*t1 - this.p2[1]*t1*t1)/(t1 - t1*t1),
                  (this.p1[2]-this.p0[2] + this.p0[2]*t1*t1 - this.p2[2]*t1*t1)/(t1 - t1*t1)] ;
        
        this.c = new Float32Array(this.p0);
    }

    animate(model) {
        model.transform.translate[0] = this.a[0]*this.time*this.time + this.b[0]*this.time + this.c[0];
        model.transform.translate[1] = this.a[1]*this.time*this.time + this.b[1]*this.time + this.c[1];
        model.transform.translate[2] = this.a[2]*this.time*this.time + this.b[2]*this.time + this.c[2];

        this.time += this.time_step;
    }

    setPointP0(point) {
        this.p0 = new Float32Array(point);
    }

    setPointP1(point) {
        this.p1 = new Float32Array(point);
    }

    setPointP2(point) {
        this.p2 = new Float32Array(point);
    }

    isFinished() {
        if(this.time > 1) {
            return true;
        }  
        else {
            return false;
        }
    }

    speedUp() {
        this.time_step += 0.0001;
    }

    speedDown() {
        this.time_step -= 0.0001;
        if(this.time_step < 0) {
            this.time_step = 0;
        }
    }

    reset() {
        this.time = 0;
        this.time_step = 0.001;
        this.firstClick = false;
        this.secondClick = false;
        this.inAnimationMode = false;
        this.inAnimation = false;
        this.p0 = [];
        this.p1 = [];
        this.p2 = [];
        this.a = [];
        this.b = [];
        this.c = [];
    }

}