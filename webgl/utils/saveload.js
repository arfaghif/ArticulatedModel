function save() {
  json_file = JSON.stringify(shapes, null, 2);
  console.log(json_file);
  blob = new Blob([json_file], { type: 'text/plain' }), anchor = document.createElement('a');
  anchor.download = "file.json";
  anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
  anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
  anchor.click();
}

function llla(item) {
  if (item.shape === "composite-hollow-cube") {
    temp_load = new HollowCube(item.shapes[0].colors[0], item.center, item.rotation, item.scale);
    shapes.push(temp_load);
  }
  if (item.shape === "composite-hollow-chair") {
    temp_load = new HollowChair(item.shapes[0].colors[0], item.center, item.rotation, item.scale);
    shapes.push(temp_load);
  }
  if (item.shape === "composite-hollow-mine") {
    temp_load = new HollowMine(undefined, item.center, item.rotation, item.scale);
    shapes.push(temp_load);
  }
  if (item.shape === "simple-cube") {
    temp_load = new Cube(item.colors, item.center, item.rotation, item.scale);
    shapes.push(temp_load);
  }
  if (item.shape === "composite-snake") {
    temp_load = new Snake(item.n, item.center, item.rotation, item.scale);
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
    newArr.forEach(llla);
  }
}