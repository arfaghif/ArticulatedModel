class Hand extends ArticulatedShape {
    constructor(color, center, rotation, scale) {
        var colors = new Array(6).fill(color ?? RANDOM_COLOR());
        var baseCenter = vec3(0 , 0, 0);
        var baseRotation = vec3(0, 0, 0);
        var baseScale = vec3(0.65, 0.1,0.5);  
        super('hand', new Cube(colors, baseCenter, baseRotation,baseScale), 0,0, 0, [0,1,0], [0,0,0], center, rotation, scale, 1);
        this.makeFinger(color, center, rotation, scale
            
            );
        
    }

    makeFinger(color, center, rotation, scale){
        // fingerCenter = vec3()
        var fingerColors = new Array(6).fill(color ?? RANDOM_COLOR())
        var fingerScale = vec3(0.1, 0.1, 0.2);
        var fingerRotation = vec3(0,0,0);
        var fingerCenter = vec3(-0.25, 0, 0.35);
        var translate = [-0.25,0,0.25];
        this.fingers = [];
        for(let i=0;i<4;++i){
            this.fingers.push(new ArticulatedShape('finger', new Cube(fingerColors, fingerCenter, fingerRotation, fingerScale),0,160,1,[-1,0,0], translate,center,rotation,scale ));
            this.addChild(this.fingers[i]);
            fingerCenter = add(fingerCenter, vec3(0.15,0,0));
            translate[0] += 0.15 ;
        }
        console.log(this.child); 
        
        //thumb
        fingerScale = vec3(0.15, 0.1, 0.15);
        fingerCenter = vec3(0.4, 0, 0);
        translate= [0.325,0,0];
        this.lastFinger = new ArticulatedShape('finger', new Cube(fingerColors, fingerCenter, fingerRotation, fingerScale),0,160,1,[0,0,1], translate,center,rotation,scale, 1)
        this.addChild(this.lastFinger);
        this.makeSubFinger(color, center, rotation, scale);
    } 


    makeSubFinger(color, center, rotation, scale){
        var subFingerColors = new Array(6).fill(color ?? RANDOM_COLOR())
        var subFingerScale = vec3(0.1, 0.1, 0.15);
        var subFingerRotation = vec3(0,0,0);
        var subFingerCenter = vec3(-0.25, 0, 0.525);
        var translate = [-0.25,0,0.45];
        this.fingers.forEach(finger => {
            var subFinger = new ArticulatedShape('sub-finger', new Cube(subFingerColors, subFingerCenter, subFingerRotation, subFingerScale),0,160,2,[-1,0,0], translate,center,rotation,scale, 1);
            finger.addChild(subFinger);
            subFingerCenter = add(subFingerCenter, vec3(0.15,0,0));
            translate[0] += 0.15 ;
        });

        var subFingerScale = vec3(0.08, 0.1, 0.15);
        var subFingerCenter = vec3(0.515, 0, 0);
        translate = [0.475,0,0];
        var subFinger = new ArticulatedShape('sub-finger', new Cube(subFingerColors, subFingerCenter, subFingerRotation, subFingerScale),0,160,2,[0,0,1], translate,center,rotation,scale, 1);
        this.lastFinger.addChild(subFinger);

    }


}