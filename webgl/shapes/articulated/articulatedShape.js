class ArticulatedShape extends Shape {
    constructor(shapeName, shape, theta, axisRotate, vTranslate, center, rotation, scale) {
        super('articulated-' + shapeName, center, rotation, scale);
        this.shape = shape;
        this.numVertices = shape.numVertices;
        this.child = [];
        this.theta = theta;
        this.axisRotate = axisRotate;
        this.vTranslate = vTranslate;
        this.isUpToDate = false;
        this.isBase = true;
        this.parent = null;
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
            return mult(super.calcTransformationMatrix() ,  rotate(this.theta,...this.axisRotate));
        }else{
            return this.parent.calcTransformationMatrix();
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