function save() {
  json_file = JSON.stringify(shapes, null, 2);
  console.log(json_file);
  blob = new Blob([json_file], { type: 'text/plain' }), anchor = document.createElement('a');
  anchor.download = "file.json";
  anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
  anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
  anchor.click();
}

function loadEachShape(item) {
  if (item.shape === "articulated-hand") {;
    temp_load = new Hand(item.baseShape.colors[0], item.center, item.rotation, item.scale);
    temp_load.child.forEach(shape=>{
      shape.baseShape.colors = item.child[0].baseShape.colors;
      shape.theta = item.child[0].theta;
      shape.child.forEach(shape2=>{
        shape2.baseShape.colors=item.child[0].child[0].baseShape.colors;
        shape2.theta = item.child[0].child[0].theta;
      });
    });
    shapes.push(temp_load);
  }
  else  if (item.shape === "articulated-chain-cube") {
    temp_load = new ChainCube(item.baseShape.colors[0], item.center, item.rotation, item.scale);
    temp_load.child.forEach(shape=>{
      shape.baseShape.colors = item.child[0].baseShape.colors;
      shape.theta = item.child[0].theta;
      shape.child.forEach(shape2=>{
        shape2.baseShape.colors=item.child[0].child[0].baseShape.colors;
        shape2.theta = item.child[0].child[0].theta;
      });
    });
    shapes.push(temp_load);
  }else  if (item.shape === "articulated-dustbin") {
    temp_load = new Dustbin(item.baseShape.shapes[0].colors[0], item.center, item.rotation, item.scale);
    temp_load.child.forEach(shape=>{
      shape.baseShape.colors = item.child[0].child[0].baseShape.colors;
      shape.theta = item.child[0].child[0].theta;
    });
    temp_load.child[0].baseShape.shapes.forEach(shape =>{
      shape.colors = item.child[0].baseShape.shapes[0].colors;
    })
    temp_load.child[0].theta = item.child[0].theta;
    temp_load.child[0].child[0].baseShape.colors = item.child[0].child[0].baseShape.colors;
    temp_load.child[0].child[0].theta = item.child[0].child[0].theta;

    shapes.push(temp_load);
  }
  
}

function load() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileSelector');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    let lines = e.target.result;
    console.log(lines);
    var newArr = JSON.parse(lines);
    newArr.forEach(loadEachShape);
  }
}