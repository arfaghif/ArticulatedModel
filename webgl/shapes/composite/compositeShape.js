class CompositeShape extends Shape {
    constructor(shapeName, shapes, center, rotation, scale) {
        super('composite-' + shapeName, center, rotation, scale);
        this.shapes = shapes;
        this.numVertices = shapes.map(s => s.numVertices).reduce((a, b) => a + b, 0);
        this.isUpToDate = false;
    }

    update(startIdx, transformationMatrix, isSelected) {
        var totalVectices = 0;
        this.shapes.forEach(shape => {
            if (!this.isUpToDate) {
                shape.update(startIdx + totalVectices, mult(transformationMatrix || mat4(), this.calcTransformationMatrix(), isSelected));
            }
            totalVectices += shape.numVertices;
        });
    }
}