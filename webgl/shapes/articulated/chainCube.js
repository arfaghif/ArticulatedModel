class ChainCube extends ArticulatedShape {
    constructor(color, center, rotation, scale) {
        var colors = new Array(6).fill(color ?? RANDOM_COLOR());
        var baseCenter = vec3(0 , 0, 0);
        var baseRotation = vec3(0, 0, 0);
        var baseScale = vec3(0.5, 0.5,0.5);  
        super('chain-cube', new Cube(colors, baseCenter, baseRotation,baseScale), 0, [0,1,0], [0,0,0], center, rotation, scale);
        colors = new Array(6).fill(color ?? RANDOM_COLOR());
        var childCenter = vec3(0.4 , 0.4, 0);
        var childRotation = vec3(0, 0, 0);
        var childScale = vec3(0.3, 0.3,0.3);
        var translate = [0.25,0.25,0];
        this.addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, childCenter, childRotation,childScale), 1, [0,0,1], translate, center, rotation, scale));
        childCenter = vec3(-0.4,-0.4,0);
        translate = [-0.25,-0.25,0];
        this.addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, childCenter, childRotation,childScale), 1, [0,0,1], translate, center, rotation, scale));
        
        colors = new Array(6).fill(color ?? RANDOM_COLOR());
        var nextChildCenter = vec3(0.6 , 0.6, 0);
        var nextChildRotation = vec3(0, 0, 0);
        var nextChildScale = vec3(0.1, 0.1,0.1);
        translate = [0.55,0.55,0];
        this.child[0].addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, nextChildCenter, nextChildRotation,nextChildScale), 2, [0,0,1], translate, center, rotation, scale))
        var nextChildCenter = vec3(-0.6 , -0.6, 0);
        translate = [-0.55,-0.55,0];
        this.child[1].addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, nextChildCenter, nextChildRotation,nextChildScale), 2, [0,0,1], translate, center, rotation, scale))
    }




}