class Rectangle extends SimpleShape {
    static unitVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( -0.4,  0.5,  0.5, 1.0 ),
        vec4( -0.4, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( -0.4,  0.5, -0.5, 1.0 ),
        vec4( -0.4, -0.5, -0.5, 1.0 )
    ];

    static quad = (a, b, c, d) => [
        Rectangle.unitVertices[a],
        Rectangle.unitVertices[b],
        Rectangle.unitVertices[c],
        Rectangle.unitVertices[a],
        Rectangle.unitVertices[c],
        Rectangle.unitVertices[d],
    ];

    static norm =(a,b,c,d) => [
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
        vec3(cross(subtract(Rectangle.unitVertices[b],Rectangle.unitVertices[a]),subtract(Rectangle.unitVertices[c],Rectangle.unitVertices[b]))),
    ];

    static normShape = [
        ...Rectangle.norm(1, 0, 3, 2),
        ...Rectangle.norm(2, 3, 7, 6),
        ...Rectangle.norm(3, 0, 4, 7),
        ...Rectangle.norm(6, 5, 1, 2),
        ...Rectangle.norm(4, 5, 6, 7),
        ...Rectangle.norm(5, 4, 0, 1),
    ]

    static unitShape = [
        ...Rectangle.quad(1, 0, 3, 2),
        ...Rectangle.quad(2, 3, 7, 6),
        ...Rectangle.quad(3, 0, 4, 7),
        ...Rectangle.quad(4, 5, 6, 7),
        ...Rectangle.quad(5, 4, 0, 1),
        ...Rectangle.quad(6, 5, 1, 2),
    ];



    constructor(verteces, colors, center, rotation, scale) {
        super('rectangle', 6, 6, colors, center, rotation, scale);
        Rectangle.unitVertices = verteces;
    }

    update(startIdx, transformationMatrix, isSelected) {
        super.update(startIdx, {
            points: Rectangle.unitShape.map(vertice => mult(mult(transformationMatrix || mat4(), this.calcTransformationMatrix()), vertice)),
            colors: this.colorShape(),
            normals: Rectangle.normShape,
        });
    }
}