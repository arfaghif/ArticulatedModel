var canvas;
var gl;
var texSize = 256;
var numChecks = 8;
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
var cBufferId, vBufferId, nBufferId, tBufferId;
var modelScaleMatrix, modelRotateMatrix, modelViewMatrix, projectionMatrix;
var modelScaleMatrixLoc, modelRotateMatrixLoc, modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var ambientProductLoc, diffuseProductLoc, specularProductLoc, lightPositionLoc, shininessLoc,shaderOnLoc, textureOnLoc;
var at;
const up = vec3(0.0, 1.0, 0.0);

var red = new Uint8Array([255, 0, 0, 255]);
var green = new Uint8Array([0, 255, 0, 255]);
var blue = new Uint8Array([0, 0, 255, 255]);
var cyan = new Uint8Array([0, 255, 255, 255]);
var magenta = new Uint8Array([255, 0, 255, 255]);
var yellow = new Uint8Array([255, 255, 0, 255]);

var xPos = new Image();
xPos.src = 'cubeMap/pos-x.jpg';
var yPos = new Image();
yPos.src = 'cubeMap/pos-y.jpg';
var zPos = new Image();
zPos.src = 'cubeMap/pos-z.jpg';
var xNeg = new Image();
xNeg.src = 'cubeMap/neg-x.jpg';
var yNeg = new Image();
yNeg.src = 'cubeMap/neg-y.jpg';
var zNeg = new Image();
zNeg.src = 'cubeMap/neg-z.jpg';

var cubeMap;
var image1 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var patchx = Math.floor(i/(texSize/numChecks));
            var patchy = Math.floor(j/(texSize/numChecks));
            if(patchx%2 ^ patchy%2) c = 255;
            else c = 0;
            //c = 255*(((i & 0x8) == 0) ^ ((j & 0x8)  == 0))
            image1[4*i*texSize+4*j] = c;
            image1[4*i*texSize+4*j+1] = c;
            image1[4*i*texSize+4*j+2] = c;
            image1[4*i*texSize+4*j+3] = 255;
        }
    }

var image2 = new Uint8Array(4*texSize*texSize);

    // Create a checkerboard pattern
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            image2[4*i*texSize+4*j] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+1] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+2] = 127+127*Math.sin(0.1*i*j);
            image2[4*i*texSize+4*j+3] = 255;
           }
    }

// Bump Data
var data = new Array()
    for (var i = 0; i<= texSize; i++)  data[i] = new Array();
    for (var i = 0; i<= texSize; i++) for (var j=0; j<=texSize; j++)
        data[i][j] = 0.0;
    for (var i = texSize/4; i<3*texSize/4; i++) for (var j = texSize/4; j<3*texSize/4; j++)
        data[i][j] = 1.0;

// Bump Map Normals
var normalst = new Array()
    for (var i=0; i<texSize; i++)  normalst[i] = new Array();
    for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++)
        normalst[i][j] = new Array();
    for (var i=0; i<texSize; i++) for ( var j = 0; j < texSize; j++) {
        normalst[i][j][0] = data[i][j]-data[i+1][j];
        normalst[i][j][1] = data[i][j]-data[i][j+1];
        normalst[i][j][2] = 1;
    }

// Scale to Texture Coordinates
    for (var i=0; i<texSize; i++) for (var j=0; j<texSize; j++) {
       var d = 0;
       for(k=0;k<3;k++) d+=normalst[i][j][k]*normalst[i][j][k];
       d = Math.sqrt(d);
       for(k=0;k<3;k++) normalst[i][j][k]= 0.5*normalst[i][j][k]/d + 0.5;
    }

// Normal Texture Array
var image3 = new Uint8Array(3*texSize*texSize);

    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            for(var k =0; k<3; k++) {
                image3[3*texSize*i+3*j+k] = 255*normalst[i][j][k];
            }
        }
    }
        

    var texCoordsArray = [];

    var texCoord = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ];



function configureCubeMap() {

    cubeMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
    const cubeImage = [
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
          url: './cubeMap/pos-x.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
          url: './cubeMap/neg-x.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
          url: './cubeMap/pos-y.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
          url: './cubeMap/neg-y.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
          url: './cubeMap/pos-z.jpg',
        },
        {
          target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
          url: './cubeMap/neg-z.jpg',
        },
      ];
      cubeImage.forEach((cubeImg) => {
        const {target, url} = cubeImg;
       
        gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
       
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.crossOrigin = "Anonymous";
        image.addEventListener('load', function() {
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
          gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        });
      });
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }


function configureTexture() {
    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image1);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // texture3 = gl.createTexture();
    // gl.bindTexture( gl.TEXTURE_2D, texture3 );
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image2);
    // gl.generateMipmap( gl.TEXTURE_2D );
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
    //                   gl.NEAREST_MIPMAP_LINEAR );
    // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture3 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texSize, texSize, 0, gl.RGB, gl.UNSIGNED_BYTE, image3);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

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

    tBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 2 * maxNumVertices, gl.STATIC_DRAW);
    

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    configureTexture();
    configureCubeMap();


    gl.activeTexture( gl.TEXTURE0 );


    gl.uniform1i(gl.getUniformLocation(program, "texMap"),0);

    gl.activeTexture( gl.TEXTURE1 )
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 1);

    gl.activeTexture( gl.TEXTURE2 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 2);

    gl.activeTexture( gl.TEXTURE3 );
    gl.bindTexture( gl.TEXTURE_2D, texture3 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex2"), 3);

    objTangentLoc = gl.getUniformLocation(program, "objTangent");
    normalLoc = gl.getUniformLocation(program, "normal");
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation(program, "specularProduct");
    lightPositionLoc = gl.getUniformLocation(program, "lightPosition");
    shininessLoc = gl.getUniformLocation(program, "shininess");
    shaderOnLoc = gl.getUniformLocation(program, "shaderOn");
    textureOnLoc = gl.getUniformLocation(program, "textureOn");
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
    var normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

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
    // var normal, tangent
    var normal = vec4(0.0, 1.0, 0.0, 0.0);
    var tangent = vec3(1.0, 0.0, 0.0);

    
    gl.uniform4fv( normalLoc,  
       flatten(normal));
    gl.uniform3fv( objTangentLoc,
       flatten(tangent));
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
    gl.uniform1i(textureOnLoc,textureOn);
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


