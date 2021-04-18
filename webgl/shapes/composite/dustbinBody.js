class DustbinBody extends CompositeShape {
    constructor(color, center, rotation, scale) {
        var shapes = [];
        var centersLocal = [
            vec3(0, -0.275, 0),
            vec3(-0.175,0,0),
            vec3(0.175,0,0),
            vec3(0,0,-0.175),
            vec3(0,0,0.175)
        ]
        var scalesLocal = [
            vec3(0.3, 0.05, 0.3),
            vec3(0.05, 0.6,0.3),
            vec3(0.05, 0.6,0.3),
            vec3(0.3, 0.6,0.05),
            vec3(0.3, 0.6,0.05)
        ]
        var colors = new Array(6).fill(color ?? RANDOM_COLOR())
        for (let i = 0; i < 5; i++) {
            let rotationLocal = vec3(0.0, 0.0, 0.0);
            shapes.push(new Cube(colors, centersLocal[i], rotationLocal, scalesLocal[i]));
        };
        super('hollow-cube', shapes, center, rotation, scale);
    }
}