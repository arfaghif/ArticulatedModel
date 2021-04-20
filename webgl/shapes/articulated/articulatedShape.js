class ArticulatedShape extends Shape {
    constructor(shapeName, shape, minAngle, maxAngle, thetaSlider, axisRotate, vTranslate, center, rotation, scale, texture) {
        super('articulated-' + shapeName, center, rotation, scale);
        this.baseShape = shape;
        this.numVertices = shape.numVertices;
        this.child = [];
        this.theta = 0;
        this.thetaSlider = thetaSlider
        this.axisRotate = axisRotate;
        this.vTranslate = vTranslate;
        this.isUpToDate = false;
        this.isBase = true;
        this.animation = false;
        this.texture = texture;
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
        this.sign = 1;
        this.autoAnimate();
    }


    onChangeTheta(numSlider,value){
        if(numSlider === this.thetaSlider){
            if(value < this.minAngle){
                this.theta = this.minAngle;
            }else if(value > this.maxAngle){
                this.theta = this.maxAngle;
            }else{
                this.theta = value;
            }

        }
        this.child.forEach(shape =>{
            shape.onChangeTheta(numSlider,value);
        });
    }

    addChild(shape){
        this.child.push(shape);
        shape.isBase = false;
        shape.parentTR = mat4();
    }

    calcTransformationMatrix(){
        if (this.isBase){
            return super.calcTransformationMatrix();
        }else{
            var t = mult(this.parentTR, translate(...this.vTranslate));
            var r = mult(t,rotate(this.theta,...this.axisRotate));
            return mult(r,translate(negate(vec3(...this.vTranslate))));
        }
    }

    chageAnimate=()=>{
        if (this.theta<=this.minAngle){
            this.sign = 1;
        }else if(this.theta>=this.maxAngle){
            this.sign = -1;

        }
        if(this.animation){
            if(this.thetaSlider === 1){
                this.theta += this.sign * 10;
                console.log("tes");
            }
            if(this.thetaSlider === 2){
                this.theta += this.sign * 15;
            }
        }
    }

    autoAnimate(){
        setInterval(this.chageAnimate
        , 100);
        this.child.forEach(shape =>{
            shape.autoAnimate();
        });
    }

    setAnimation(value){
        this.animation = value;
        console.log(this.animation);
        this.child.forEach(shape =>{
            shape.setAnimation(value);
        });
    }

    update(startIdx, transformationMatrix, isSelected) {
        var totalVectices = 0;
        this.baseShape.update(startIdx, mult(transformationMatrix || mat4(), this.calcTransformationMatrix(), isSelected));
        totalVectices += this.baseShape.numVertices;
        this.child.forEach(shape => {
            if (!this.isUpToDate) {
                shape.parentTR = this.calcTransformationMatrix();
                shape.update(startIdx + totalVectices, transformationMatrix || mat4(), isSelected);
            }
            totalVectices += shape.numVertices;
            this.numVertices = Math.max(this.numVertices,totalVectices);
        });
    }
}