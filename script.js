var shapes = [];

// translate, rotation, scaling
var cameraXYZ;
var rotationXYZ;
var scalingXYZ;

// interactivity
const walkSpeed = 0.02;
const rotSpeed = 1;
const zoomSpeed = 0.02;
var keypressed;
var projectionType;
var isFollowingObject;
var selectedIdx;
var shaderOn;
var textureOn;

function initVariables() {
    cameraXYZ = vec3(0, 0, -3);
    rotationXYZ = vec3(0, 0, 0);
    scalingXYZ = vec3(1, 1, 1);
    projectionType = "perspective";
    shaderOn = true;
    keypressed = new Set();
    isFollowingObject = false;
    selectedIdx = -1;
    at = vec3(0, 0, 0);
}

window.onload = function setup() {
    initWebGL();
    initEventListeners();
    initVariables();
    loop();
}

function updateCamera() {
    if (keypressed.has('w')) {
        if (selectedIdx === -1) cameraXYZ[1] -= walkSpeed;
        else shapes[selectedIdx].moveY(walkSpeed);
    }
    if (keypressed.has('s')) {
        if (selectedIdx === -1) cameraXYZ[1] += walkSpeed;
        else shapes[selectedIdx].moveY(-walkSpeed);
    }
    if (keypressed.has('a')) {
        if (selectedIdx === -1) cameraXYZ[0] += walkSpeed;
        else shapes[selectedIdx].moveX(-walkSpeed);
    }
    if (keypressed.has('d')) {
        if (selectedIdx === -1) cameraXYZ[0] -= walkSpeed;
        else shapes[selectedIdx].moveX(walkSpeed);
    }
    if (keypressed.has('e')) {
        if (selectedIdx === -1) cameraXYZ[2] -= walkSpeed;
        else shapes[selectedIdx].moveZ(walkSpeed);
    }
    if (keypressed.has('q')) {
        if (selectedIdx === -1) cameraXYZ[2] += walkSpeed;
        else shapes[selectedIdx].moveZ(-walkSpeed);
        
    }


    if (keypressed.has('i')) {
        if (selectedIdx === -1) rotationXYZ[0] += rotSpeed;
        else shapes[selectedIdx].rotateX(-rotSpeed);
    }
    if (keypressed.has('k')) {
        if (selectedIdx === -1) rotationXYZ[0] -= rotSpeed;
        else shapes[selectedIdx].rotateX(rotSpeed);
    }
    if (keypressed.has('j')) {
        if (selectedIdx === -1) rotationXYZ[1] += rotSpeed;
        else shapes[selectedIdx].rotateY(-rotSpeed);
    }
    if (keypressed.has('l')) {
        if (selectedIdx === -1) rotationXYZ[1] -= rotSpeed;
        else shapes[selectedIdx].rotateY(rotSpeed);
    }
    if (keypressed.has('u')) {
        if (selectedIdx === -1) rotationXYZ[2] -= rotSpeed;
        else shapes[selectedIdx].rotateZ(rotSpeed);
    }
    if (keypressed.has('o')) {
        if (selectedIdx === -1) rotationXYZ[2] += rotSpeed;
        else shapes[selectedIdx].rotateZ(-rotSpeed);
    }


    if (keypressed.has('ArrowUp')) {
        if (selectedIdx === -1) {
            scalingXYZ[0] += zoomSpeed;
            scalingXYZ[1] += zoomSpeed;
            scalingXYZ[2] += zoomSpeed;
        } else {
            shapes[selectedIdx].scaleXYZ(vec3(1 + zoomSpeed, 1 + zoomSpeed, 1 + zoomSpeed));
        }
    }
    if (keypressed.has('ArrowDown')) {
        if (selectedIdx === -1) {
            scalingXYZ[0] -= zoomSpeed;
            scalingXYZ[1] -= zoomSpeed;
            scalingXYZ[2] -= zoomSpeed;
        } else {
            shapes[selectedIdx].scaleXYZ(vec3(1 - zoomSpeed, 1 - zoomSpeed, 1 - zoomSpeed));
        }
    }
    if (keypressed.has('z')) {
        far -= 0.05;
        far = Math.max(near, far);
    }
    if (keypressed.has('x')) {
        far += 0.05;
    }
}

document.onkeyup = (e) => {
    keypressed.delete(e.key);
    if (e.key === 'ArrowLeft') {
        if (selectedIdx > -1) selectedIdx -= 1;
    }
    if (e.key === 'ArrowRight') {
        if (selectedIdx < shapes.length - 1) selectedIdx += 1;
    }
    if (e.key == 'h') {
        shaderOn = !shaderOn;
    }
    if (e.key == 'r') {
        initVariables();
    }
    if (e.key == 'c'){
        while (shapes.length) {
            shapes.pop();
        }
    }
}

document.onkeydown = (e) => {
    keypressed.add(e.key);
}

function loop() {
    renderWebGL();
    requestAnimFrame(loop);
}
