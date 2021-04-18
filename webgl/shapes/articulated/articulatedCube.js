class ArticulatedCube extends ArticulatedShape {
    constructor(theta, axisRotate, vTranslate, center, rotation, scale) {
        super('articulated-cube', new Cube() ,theta, axisRotate, vTranslate,center, rotation, scale);
    }
}