class ArticulatedShape extends Shape {
    constructor(shapeName, shape, thetaSlider, axisRotate, vTranslate, center, rotation, scale) {
        super('articulated-' + shapeName, center, rotation, scale);
        this.shape = shape;
        this.numVertices = shape.numVertices;
        this.child = [];
        this.theta = 0;
        this.thetaSlider = thetaSlider
        this.axisRotate = axisRotate;
        this.vTranslate = vTranslate;
        this.isUpToDate = false;
        this.isBase = true;
        this.parent = null;
    }


    onChangeTheta(numSlider,value){
        if(numSlider === this.thetaSlider){
            this.theta = value;
        }
        this.child.forEach(shape =>{
            shape.onChangeTheta(numSlider,value);
        });
    }

    addChild(shape){
        this.child.push(shape);
        shape.isBase = false;
        shape.parent = this;
        var childParent = this;
        while(childParent !== null){
            childParent.numVertices += shape.numVertices;
            childParent = childParent.parent;
        }
    }

    calcTransformationMatrix(){
        if (this.isBase){
            return super.calcTransformationMatrix();
        }else{
            var t = mult(this.parent.calcTransformationMatrix(), translate(...this.vTranslate));
            var r = mult(t,rotate(this.theta,...this.axisRotate));
            return mult(r,translate(negate(vec3(...this.vTranslate))));
        }
    }

    update(startIdx, transformationMatrix, isSelected) {
        var totalVectices = 0;
        this.shape.update(startIdx, mult(transformationMatrix || mat4(), this.calcTransformationMatrix(), isSelected));
        totalVectices += this.shape.numVertices;
        this.child.forEach(shape => {
            if (!this.isUpToDate) {
                shape.update(startIdx + totalVectices, transformationMatrix || mat4(), isSelected);
            }
            totalVectices += shape.numVertices;
        });
    }
}