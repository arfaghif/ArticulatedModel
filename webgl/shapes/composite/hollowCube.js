class HollowCube extends CompositeShape {
    constructor(color, center, rotation, scale) {
        var shapes = [];
        var centersLocal = [
            vec3(0.45, 0, 0.45),
            vec3(0.45, 0, -0.45),
            vec3(-0.45, 0, 0.45),
            vec3(-0.45, 0, -0.45),
            vec3(0, 0.45, 0.45),
            vec3(0, 0.45, -0.45),
            vec3(0, -0.45, 0.45),
            vec3(0, -0.45, -0.45),
            vec3(0.45, 0.45, 0),
            vec3(0.45, -0.45, 0),
            vec3(-0.45, 0.45, 0),
            vec3(-0.45, -0.45, 0),
        ]
        var scalesLocal = [
            vec3(0.1, 1.0, 0.1),
            vec3(0.1, 1.0, 0.1),
            vec3(0.1, 1.0, 0.1),
            vec3(0.1, 1.0, 0.1),
            vec3(0.8, 0.1, 0.1),
            vec3(0.8, 0.1, 0.1),
            vec3(0.8, 0.1, 0.1),
            vec3(0.8, 0.1, 0.1),
            vec3(0.1, 0.1, 0.8),
            vec3(0.1, 0.1, 0.8),
            vec3(0.1, 0.1, 0.8),
            vec3(0.1, 0.1, 0.8),
        ]
        var colors = new Array(6).fill(color ?? RANDOM_COLOR())
        for (let i = 0; i < 12; i++) {
            let rotationLocal = vec3(0.0, 0.0, 0.0);
            shapes.push(new Cube(colors, centersLocal[i], rotationLocal, scalesLocal[i]));
        };
        super('hollow-cube', shapes, center, rotation, scale);
    }
}