var sketchColor = "#000000";

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
