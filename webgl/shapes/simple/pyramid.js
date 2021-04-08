class Pyramid extends SimpleShape {
    static unitVertices = [
        vec4(1, -1 / Math.sqrt(6), -1 / Math.sqrt(3), 1.0),
        vec4(-1, -1 / Math.sqrt(6), - 1 / Math.sqrt(3), 1.0),
        vec4(0, - 1 / Math.sqrt(6), 2 / Math.sqrt(3), 1.0),
        vec4(0, 3 / Math.sqrt(6), 0, 1.0),
    ];

    static tri = (a, b, c) => [
        Pyramid.unitVertices[a],
        Pyramid.unitVertices[b],
        Pyramid.unitVertices[c],
    ];

    static norm = (a, b, c, d) =>
        Array(4).fill(
            vec3(cross(subtract(Pyramid.unitVertices[b], Pyramid.unitVertices[a]), subtract(Pyramid.unitVertices[c], Pyramid.unitVertices[b])))
        );
    
    static normShape = [
        ...Pyramid.norm(0, 1, 2),
        ...Pyramid.norm(0, 3, 2),
        ...Pyramid.norm(0, 3, 1),
        ...Pyramid.norm(1, 2, 3),
    ]

    static unitShape = [
        // 0 puncak, 123 alas cloclwise
        ...Pyramid.tri(0, 1, 2),
        ...Pyramid.tri(0, 3, 2),
        ...Pyramid.tri(0, 3, 1),
        ...Pyramid.tri(1, 2, 3),
    ];

    constructor(colors, center, rotation, scale) {
        super('pyramid', 4, 3, colors, center, rotation, scale);
    }

    update(startIdx, transformationMatrix, isSelected) {
        super.update(startIdx, {
            points: Pyramid.unitShape.map(vertice => mult(mult(transformationMatrix || mat4(), this.calcTransformationMatrix()), vertice)),
            colors: this.colorShape(),
            normals: Pyramid.normShape,
        });
    }
}