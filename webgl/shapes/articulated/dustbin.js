class Dustbin extends ArticulatedShape {
    constructor(color, center, rotation, scale) {
        super('dustbin', new DustbinBody(color, center, rotation, scale), 0, [0,1,0], [0,0,0], center, rotation, scale);
        var capCenter = vec3(0, 0.325 ,0);
        var translate = [0, 0.325 ,0.15];
        this.addChild(new ArticulatedShape('dustbin-cap', new DustbinCap(color, capCenter, rotation, scale), 1,[1,0,0] , translate, center, rotation, scale));
        var nextChildCenter = vec3(0.225,-0.2,0);
        var nextChildRotation = vec3(45, 0, 0);
        var nextChildScale = vec3(0.05, 0.2,0.2);
        translate = [0.25,-0.2,0];
        var colors = new Array(6).fill(color ?? RANDOM_COLOR());
        this.addChild(new ArticulatedShape('dustbin-comp', new Cube(colors, nextChildCenter, nextChildRotation, nextChildScale), 2,[1,0,0] , translate, center, rotation, scale));
        nextChildCenter = vec3(-0.225,-0.2,0);
        translate = [-0.25,-0.2,0];
        this.addChild(new ArticulatedShape('dustbin-comp', new Cube(colors, nextChildCenter, nextChildRotation, nextChildScale), 2,[1,0,0] , translate, center, rotation, scale));
        nextChildCenter = vec3(0, 0.375 ,0);
        nextChildRotation = vec3(0,0,90);
        translate = [0, 0.375 ,0];
        this.child[0].addChild(new ArticulatedShape('dustbin-comp', new Cube(colors, nextChildCenter, nextChildRotation, nextChildScale), 2,[0,1,0] , translate, center, rotation, scale));
        // childCenter = vec3(-0.4,-0.4,0);
        // translate = [-0.25,-0.25,0];
        // this.addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, childCenter, childRotation,childScale), 1, [0,0,1], translate, center, rotation, scale));
        
        // colors = new Array(6).fill(color ?? RANDOM_COLOR());
        // var nextChildCenter = vec3(0.6 , 0.6, 0);
        // var nextChildRotation = vec3(0, 0, 0);
        // var nextChildScale = vec3(0.1, 0.1,0.1);
        // translate = [0.55,0.55,0];
        // this.child[0].addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, nextChildCenter, nextChildRotation,nextChildScale), 2, [0,0,1], translate, center, rotation, scale))
        // var nextChildCenter = vec3(-0.6 , -0.6, 0);
        // translate = [-0.55,-0.55,0];
        // this.child[1].addChild(new ArticulatedShape('chain-cube-child',new Cube(colors, nextChildCenter, nextChildRotation,nextChildScale), 2, [0,0,1], translate, center, rotation, scale))
    }




}