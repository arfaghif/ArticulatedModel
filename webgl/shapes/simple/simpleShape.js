class SimpleShape extends Shape {
    constructor(shape, numSides, numVerticePerSide, colors, center, rotation, scale) {
        super('simple-' + shape, center, rotation, scale);
        if (Array.isArray(colors) && !Array.isArray(colors[0]) && colors.length == 4) {
            // only provide 1 color
            this.colors = Array(numSides).fill(colors);
        } else if (Array.isArray(colors) && Array.isArray(colors[0]) && colors.length >= numSides) {
            // provide all colors needed
            this.colors = colors.slice(0, numSides);
        } else {
            // not provide color, assign random color
            this.colors = Array(numSides).fill().map(c => RANDOM_COLOR());
        }
        this.colors.map(color => vec4(color));
        this.numSides = numSides;
        this.numVerticePerSide = numVerticePerSide;
        this.numVertices = numSides * numVerticePerSide;
    }

    colorShape = () => {
        var result = [];
        this.colors.forEach(c => result.push(...Array(this.numVerticePerSide).fill(c)));
        return result;
    };
}