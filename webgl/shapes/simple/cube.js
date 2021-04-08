class Cube extends SimpleShape {
    static unitVertices = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

    static quad = (a, b, c, d) => [
        Cube.unitVertices[a],
        Cube.unitVertices[b],
        Cube.unitVertices[c],
        Cube.unitVertices[a],
        Cube.unitVertices[c],
        Cube.unitVertices[d],
    ];

    static norm = (a, b, c, d) =>
        Array(6).fill(
            vec3(cross(subtract(Cube.unitVertices[b], Cube.unitVertices[a]), subtract(Cube.unitVertices[c], Cube.unitVertices[b])))
        );

    static normShape = [
        ...Cube.norm(1, 0, 3, 2),
        ...Cube.norm(2, 3, 7, 6),
        ...Cube.norm(3, 0, 4, 7),
        ...Cube.norm(6, 5, 1, 2),
        ...Cube.norm(4, 5, 6, 7),
        ...Cube.norm(5, 4, 0, 1),
    ]

    static unitShape = [
        ...Cube.quad(1, 0, 3, 2),
        ...Cube.quad(2, 3, 7, 6),
        ...Cube.quad(3, 0, 4, 7),
        ...Cube.quad(4, 5, 6, 7),
        ...Cube.quad(5, 4, 0, 1),
        ...Cube.quad(6, 5, 1, 2),
    ];

    constructor(colors, center, rotation, scale) {
        super('cube', 6, 6, colors, center, rotation, scale);
    }

    update(startIdx, transformationMatrix, isSelected) {
        super.update(startIdx, {
            points: Cube.unitShape.map(vertice => mult(mult(transformationMatrix || mat4(), this.calcTransformationMatrix()), vertice)),
            colors: this.colorShape(),
            normals: Cube.normShape,
        });
    }
}