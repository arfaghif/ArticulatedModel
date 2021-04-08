class Shape {
    constructor(shape, center, rotation, scale) {
        this.shape = shape;
        this.center = center || vec3(0, 0, 0);
        this.rotation = rotation || vec3(0, 0, 0);
        this.scale = scale || vec3(1, 1, 1);
        this.isUpToDate = false;
    }

    moveX(dist) {
        this.center[0] += dist;
        this.isUpToDate = false;
    }

    moveY(dist) {
        this.center[1] += dist;
        this.isUpToDate = false;
    }

    moveZ(dist) {
        this.center[2] += dist;
        this.isUpToDate = false;
    }

    moveXYZ(dists) {
        this.center = add(this.center, dists);
        this.isUpToDate = false;
    }

    rotateX(angle) {
        this.rotation[0] += angle;
        this.isUpToDate = false;
    }

    rotateY(angle) {
        this.rotation[1] += angle;
        this.isUpToDate = false;
    }

    rotateZ(angle) {
        this.rotation[2] += angle;
        this.isUpToDate = false;
    }

    rotateXYZ(angles) {
        this.rotation = add(this.rotation, angles);
        this.isUpToDate = false;
    }

    scaleX(k) {
        this.scale[0] *= k;
        this.isUpToDate = false;
    }

    scaleY(k) {
        this.scale[1] *= k;
        this.isUpToDate = false;
    }

    scaleZ(k) {
        this.scale[2] *= k;
        this.isUpToDate = false;
    }

    scaleXYZ(ks) {
        this.scale = mult(this.scale, ks);
        this.isUpToDate = false;
    }

    // TODO setter, co: setCenterX, setRotationY, setScaleZ
    setRotationX(angle) {
        this.rotation[0] = angle;
        this.isUpToDate = false;
    }
    setRotationY(angle) {
        this.rotation[1] = angle;
        this.isUpToDate = false;
    }
    setRotationZ(angle) {
        this.rotation[2] = angle;
        this.isUpToDate = false;
    }

    setCenterX(dist) {
        this.center[0] = dist;
        this.isUpToDate = false;
    }
    setCenterY(dist) {
        this.center[1] = dist;
        this.isUpToDate = false;
    }
    setCenterZ(dist) {
        this.center[2] = dist;
        this.isUpToDate = false;
    }

    setScaleX(scale) {
        this.scale[0] = scale;
        this.isUpToDate = false;
    }
    setScaleY(scale) {
        this.scale[1] = scale;
        this.isUpToDate = false;
    }
    setScaleZ(scale) {
        this.scale[2] = scale;
        this.isUpToDate = false;
    }

    calcTransformationMatrix() {
        var transformationMatrix = mat4();
        transformationMatrix = mult(transformationMatrix, translate(this.center));
        transformationMatrix = mult(transformationMatrix, rotateXYZ(this.rotation));
        transformationMatrix = mult(transformationMatrix, scalem(this.scale));
        return transformationMatrix;
    }

    update(startIdx, updatedArray, isSelected) {
        gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * startIdx, flatten(updatedArray.colors));
        gl.bindBuffer(gl.ARRAY_BUFFER, nBufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 12 * startIdx, flatten(updatedArray.normals));
        gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * startIdx, flatten(updatedArray.points));
        this.isUpToDate = true;
    }
}