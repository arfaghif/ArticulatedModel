var canvas;
var gl;

//shading
// var viewerPos;
// var thetaLoc;

// projection
var near = 0.3;
var far = 3.0;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var z = 0.1;
var dr = 5.0 * Math.PI / 180.0;

// perspective
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect = 1.0;       // Viewport aspect ratio

// ortho
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;

// webgl matrices
const maxNumVertices = 20000;
var cBufferId, vBufferId, nBufferId;
var modelScaleMatrix, modelRotateMatrix, modelViewMatrix, projectionMatrix;
var modelScaleMatrixLoc, modelRotateMatrixLoc, modelViewMatrixLoc, projectionMatrixLoc;
var ambientProductLoc, diffuseProductLoc, specularProductLoc, lightPositionLoc, shininessLoc,shaderOnLoc;
var at;
const up = vec3(0.0, 1.0, 0.0);

function initWebGL() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * maxNumVertices, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    nBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 3 * maxNumVertices, gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    
    vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // thetaLoc = gl.getUniformLocation(program, "theta");
    // viewerPos = vec3(0.0, 0.0, -20.0 );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    shaderOnLoc = gl.getUniformLocation(program, "shaderOn");
}

function renderWebGL() {
    // -- model view
    modelViewMatrix = mat4();
    // translate and rotate
    updateCamera();
    if (isFollowingObject) {
        // mengikuti benda (lebih enak pake slider)
        if (selectedIdx === -1) selectedIdx = 0;
        at = shapes[selectedIdx].center;
        eye = add(at, mult(normalize(add(vec3(0, 0, 0.0001), shapes[selectedIdx].rotation)), 2));
        modelViewMatrix = lookAt(eye, at, up);
    } else {
        // tidak mengikuti benda (lebih enak pake menggunakan keyboard)
        modelViewMatrix = mult(modelViewMatrix, translate(cameraXYZ));
        modelViewMatrix = mult(modelViewMatrix, rotateXYZ(rotationXYZ));
    }

    // scale
    modelViewMatrix = mult(modelViewMatrix, scalem(scalingXYZ));

    // -- projection
    projectionMatrix = mat4();
    if (projectionType === "oblique") {
        var x = 110; // yang bagus: 60-120, TODO: bikin slidernya
        projectionMatrix = mult(projectionMatrix, oblique(x, x));
        projectionMatrix = mult(projectionMatrix, translate(-1 / x, -1 / x, 0));
        projectionMatrix = mult(projectionMatrix, ortho(left, right, bottom, ytop, near, far));
    } else if (projectionType === "orthographic") {
        projectionMatrix = mult(projectionMatrix, ortho(left, right, bottom, ytop, near, far));
    } else if (projectionType === "perspective") {
        projectionMatrix = mult(projectionMatrix, perspective(fovy, aspect, near, far * 5));
    }

    //shading
    var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
    var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
    var lightDiffuse = vec4( 0.72, 0.7, 0.66, 1.0 );
    var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

    var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
    var materialDiffuse = vec4( 1.0, 1.0, 0.0, 1.0);
    var materialSpecular = vec4( 1.0, 1.0, 0.0, 1.0 );
    var materialShininess = 120.0;
    // var ambientColor, diffuseColor, specularColor;
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(ambientProductLoc,
       flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLoc,
       flatten(diffuseProduct) );
    gl.uniform4fv(specularProductLoc,
       flatten(specularProduct) );
    gl.uniform4fv(lightPositionLoc,
       flatten(lightPosition) );

    gl.uniform1f(shininessLoc,materialShininess);
    gl.uniform1f(shaderOnLoc,shaderOn);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    // webgl stuffs
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // render
    var totalVectices = 0;
    shapes.forEach((shape, i) => {
        if (!shape.isUpToDate) {
            shape.update(totalVectices, mat4(), selectedIdx === i);
        }
        totalVectices += shape.numVertices;
    });
    gl.drawArrays(gl.TRIANGLES, 0, totalVectices);
}
