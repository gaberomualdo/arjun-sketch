var sketchColor = "#000000";
var sketchHistory = [];
var sketchHistoryCount = 0;
var previousSketchTimeAndCoords = false;

$(function(){
  var sketchColorPicker = $('#colorPicker');
  sketchColorPicker.tinycolorpicker();
  sketchColorPicker.data("plugin_tinycolorpicker").setColor(sketchColor);
  sketchColorPicker.bind("change", function(){
    sketchColor = (sketchColorPicker.data("plugin_tinycolorpicker").colorHex);
  });
});

var canvas = document.querySelector("div.container > canvas");
canvas.width = canvas.offsetWidth;
canvas.height = (canvas.width / 4) * 3;
var context = canvas.getContext("2d");

clearCanvas();

var mouseDown = false;

canvas.onmousedown = function(){
  mouseDown = true;
}
canvas.onmouseup = function(){
  mouseDown = false;
}

function clearCanvas(){
  context.fillStyle = "#ffffff";
  context.fillRect(0,0,canvas.width, canvas.height);
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function drawPixel(coords){
  if(sketchHistoryCount == 0){
    sketchHistory.push(canvas.toDataURL());
  }
  sketchHistoryCount += 1;
  sketchHistoryCount = sketchHistoryCount % 10;
  context.fillStyle = sketchColor;
  context.beginPath();
  console.log(sketchColor);
  if(sketchColor == "#FFFFFF") {
    context.arc(coords[0],coords[1],15,0, 2 * Math.PI);
  }else{
    context.arc(coords[0],coords[1],5,0, 2 * Math.PI);
  }
  context.fill();

  var d = new Date();
  var sketchTimeAndCoords = {
    time: d.getTime(),
    coords: coords
  };
  if(!previousSketchTimeAndCoords || sketchTimeAndCoords.time - previousSketchTimeAndCoords.time > 250){
    previousSketchTimeAndCoords = sketchTimeAndCoords;
  }else{
    context.strokeStyle = sketchColor;
    context.lineWidth = 10;
    if(sketchColor == "#FFFFFF") {
      context.lineWidth = 30;
    }
    context.beginPath();
    context.moveTo(previousSketchTimeAndCoords.coords[0], previousSketchTimeAndCoords.coords[1]);
    context.lineTo(sketchTimeAndCoords.coords[0], sketchTimeAndCoords.coords[1]);
    context.stroke();
    previousSketchTimeAndCoords = sketchTimeAndCoords;
  }
}

canvas.onmousemove = function(e){
  if(mouseDown){
    var coords = [e.clientX - (canvas.getBoundingClientRect().left), e.clientY - (canvas.getBoundingClientRect().top)];
    drawPixel(coords);
  }
}
canvas.onclick = function(e){
  var coords = [e.clientX - (canvas.getBoundingClientRect().left), e.clientY - (canvas.getBoundingClientRect().top)];
  drawPixel(coords);
}

document.querySelector("div.container div.toolbar div.right button.clear").onclick = clearCanvas;
document.querySelector("div.container div.toolbar div.right button.download").onclick = function(){
  downloadURI(canvas.toDataURL(), "sketch.png");
}
document.querySelector("div.container div.toolbar div.right button.undo").onclick = function(){
  sketchHistory.pop();
  var undoedSketch = new Image;
  undoedSketch.onload = function(){
    context.drawImage(undoedSketch,0,0); // Or at whatever offset you like
  };
  undoedSketch.src = sketchHistory[sketchHistory.length - 1];
}
