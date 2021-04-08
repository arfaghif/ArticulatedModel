class Person extends CompositeShape {
    constructor(center, rotation, scale) {
        var shapes = [];
        var k = 0.2;
        var skinColor = mult(vec4(169, 125, 100, 255), 1 / 255);
        var clothesColor = mult(vec4(14, 174, 174, 255), 1 / 255);
        var pantsColor = mult(vec4(73, 70, 151, 255), 1 / 255);
        var shoesColor = mult(vec4(107, 107, 107, 255), 1 / 255);
        var head = new Cube(skinColor, vec3(0, 2 * k, 0), undefined, vec3(k, k, k));
        var body = new Cube(clothesColor, vec3(0, 0.75 * k, 0), undefined, vec3(0.5 * k, 1.5 * k, k));
        var lShoulder = new Cube(clothesColor, vec3(0, (2 - 0.5 - 0.25) * k, (0.5 + 0.25) * k), undefined, vec3(0.5 * k, 0.5 * k, 0.5 * k));
        var rShoulder = new Cube(clothesColor, vec3(0, (2 - 0.5 - 0.25) * k, -(0.5 + 0.25) * k), undefined, vec3(0.5 * k, 0.5 * k, 0.5 * k));
        var lHand = new Cube(skinColor, vec3(0, (2 - 0.5 - 0.5 - 0.6) * k, -(0.5 + 0.25) * k), undefined, vec3(0.5 * k, 1.2 * k, 0.5 * k));
        var rHand = new Cube(skinColor, vec3(0, (2 - 0.5 - 0.5 - 0.6) * k, +(0.5 + 0.25) * k), undefined, vec3(0.5 * k, 1.2 * k, 0.5 * k));
        var lLeg = new Cube(pantsColor, vec3(0, -0.8 * k, 0.25 * k), undefined, vec3(0.5 * k, 1.6 * k, 0.5 * k));
        var rLeg = new Cube(pantsColor, vec3(0, -0.8 * k, -0.25 * k), undefined, vec3(0.5 * k, 1.6 * k, 0.5 * k));
        var lShoe = new Cube(shoesColor, vec3(0, -(1.6 + 0.2) * k, 0.25 * k), undefined, vec3(0.5 * k, 0.4 * k, 0.5 * k));
        var rShoe = new Cube(shoesColor, vec3(0, -(1.6 + 0.2) * k, -0.25 * k), undefined, vec3(0.5 * k, 0.4 * k, 0.5 * k));
        shapes.push(head, body, lShoulder, rShoulder, lHand, rHand, lLeg, rLeg, lShoe, rShoe);
        super('person', shapes, center, rotation, scale);
        this.k = k;

        this.walking = 0;
    }

    animateWalk() {
        this.shapes[6].setRotationZ(Math.sin(this.walking) * 30);
        this.shapes[6].setCenterX(Math.sin(this.walking) * this.k / 2);
        this.shapes[7].setRotationZ(-Math.sin(this.walking) * 30);
        this.shapes[7].setCenterX(-Math.sin(this.walking) * this.k / 2);
        this.shapes[8].setRotationZ(Math.sin(this.walking) * 30);
        this.shapes[8].setCenterX(Math.sin(this.walking) * this.k);
        this.shapes[9].setRotationZ(-Math.sin(this.walking) * 30);
        this.shapes[9].setCenterX(-Math.sin(this.walking) * this.k);
    }

    update(startIdx, transformationMatrix, isSelected) {
        if (isSelected) {
            if ([...keypressed].filter(x => new Set(['w', 'a', 's', 'd']).has(x)).length > 0) {
                this.walking += 0.2;
                this.animateWalk();
                super.update(startIdx, transformationMatrix, isSelected);
                return;
            }
        }
        if (this.walking > 0) {
            this.walking = 0;
            this.animateWalk();
        }
        super.update(startIdx, transformationMatrix, isSelected);
    }
}