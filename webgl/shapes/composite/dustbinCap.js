class DustbinCap extends CompositeShape {
    constructor(color, center, rotation, scale) {
        var shapes = [];
        var centersLocal = [
            vec3(0, 0, 0),
            vec3(0,0,0.3)
        ]
        var scalesLocal = [
            vec3(0.35, 0.05, 0.35),
            vec3(0.1,0.05,0.3)
        ]
        var colors = new Array(6).fill(color ?? RANDOM_COLOR())
        for (let i = 0; i < 2; i++) {
            let rotationLocal = vec3(0.0, 0.0, 0.0);
            shapes.push(new Cube(colors, centersLocal[i], rotationLocal, scalesLocal[i]));
        };
        super('hollow-cube', shapes, center, rotation, scale);
    }
}