function initEventListeners() {
    document.getElementById("followObjectCheckbox").onchange = function (event) { isFollowingObject = event.target.checked };
    document.getElementById("projectionDropdown").onchange = function (event) {
        projectionType = event.target.value;
    };
    document.getElementById("shadingDropdown").onchange = function (event) {
        shaderOn = event.target.value === "ON";
    };
    document.getElementById("clearButton").onclick = function () {
        while (shapes.length) {
            shapes.pop();
        }
    }
    document.getElementById("resetButton").onclick = function () {
        initVariables();
    }

    document.getElementById("saveButton").onclick = function () {
        save();
    }

    document.getElementById("loadButton").onclick = function () {
        while (shapes.length) {
            shapes.pop();
        }
        load()
    }
    document.getElementById("slider1").oninput = function(event) {
        shapes.forEach(shape =>{
            shape.onChangeTheta(1,event.target.value);
        })

    };
    document.getElementById("slider2").oninput = function(event) {
        shapes.forEach(shape =>{
            shape.onChangeTheta(2,event.target.value);
        })
    };

    document.getElementById("hollowCubeButton").onclick = function () {
        shapes.push(new Hand());
    }
    document.getElementById("hollowChairButton").onclick = function () {
        shapes.push(new ChainCube());
    }
    document.getElementById("hollowMineButton").onclick = function () {
        shapes.push(new HollowMine());
    }
    document.getElementById("help").onclick = function () {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
    }
}