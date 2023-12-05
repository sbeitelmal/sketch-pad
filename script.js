"use strict";
const CANVAS_SIZE = 640;
const CANVAS_SIZES = [480, 720, 960];
const SIZE_LABELS = ["100%", "150%", "200%"];
//const COLORS = ["red", "green", "blue", "black", "white"];
const COLORS = ["#a12507", "#eaac11", "#38c508","#0acde5" , "black", "white"];
const POSSIBLE_SIZES = [8,16,32,64];
const content = document.querySelector("#content");
const canvas = document.createElement("div")

let currentCanvasResolution = 16;
let currentCanvasSize =720;
let currentBackgroundColor = "white";
let drawColor = "black";
let drawState = false;
let rainbowDraw = false;
let rainbowColors = COLORS;

//content.addEventListener("mouseenter", leaveCanvas());
//canvas.addEventListener("mouseleave", leaveCanvas());
function handleFileSelect(event) {
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
  console.log(event);
  //document.getElementById('fileContent').textContent = event.target.result;
  canvas.innerHTML = event.target.result;
  for(const activeDiv of document.querySelectorAll("#block")){
    activeDiv.addEventListener("mousedown", function(e) {
      toggleDraw();
      draw(e.target);
    })
    activeDiv.addEventListener("mouseup", () => {toggleDraw()})
    activeDiv.addEventListener("mouseenter", function(e) {
      if(drawState)
      {
        draw(e.target);
      }
    })
  }
}

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

canvas.id = "canvas";

canvas.style.height = currentCanvasSize;
canvas.style.width = currentCanvasSize;
canvas.style.display = "flex";
canvas.style.flexDirection = "column";
canvas.style.alignItems = "center";
//canvas.style.border = "solid blue 5px";

content.appendChild(canvas);
function toggleDraw()
{
  drawState = !drawState;
}

function setDrawMode(color, rainbow){
  if(rainbow){
    rainbowDraw = true;
    setRainbowColors(currentBackgroundColor);
    document.querySelector("#rainbowButton").style.backgroundColor = "#888888";
  }
  else{
    rainbowDraw = false;
    drawColor = color;
    document.querySelector("#rainbowButton").style.backgroundColor = "#eeeeee";
  }
}
function draw(element)
{
  if(rainbowDraw){
    element.style.backgroundColor = rainbowColors[Math.floor(Math.random() * COLORS.length)];
  }
  else{
    element.style.backgroundColor = drawColor;
  }
}

function setRainbowColors(excludedColor){
  rainbowColors = [];
    for(const color of COLORS){
      if(color != excludedColor){
        rainbowColors.push(color);
        console.log(rainbowColors);
      }
    }
}
function leaveCanvas(){
  //alert("left canvas");
  console.log("leave");
  drawState = false;
  //canvas.addEventListener("mouseleave", leaveCanvas())
}

/*
  *---------------------------->
  *----------------------------> 
  *GENERATE CANVAS ---- GENERATE CANVAS
  *---------------------------->
  *---------------------------->
*/
function generateCanvas(size, canvasElement)
{
  //while(canvasElement.firstChild){
    //canvasElement.removeChild(canvasElement.firstChild);
  //}
  console.log("canvas generated");
  canvasElement.innerHTML = ""
  for(let i = 0; i<size; i++)
  {
    const activeRow = document.createElement("div");
    canvasElement.appendChild(activeRow);
    activeRow.style.display = "flex";
    //activeRow.style.border = "solid red 1px"
    for(let i = 0; i<size; i++)
    {
      const activeDiv = document.createElement("div");
      activeDiv.style.height = `${currentCanvasSize/size}px`;
      activeDiv.style.width= `${currentCanvasSize/size}px`;
      //activeDiv.style.border ="solid red 1px";
      activeDiv.id = "block";
      activeDiv.style.backgroundColor = "white";
      activeDiv.addEventListener("mousedown", function(e) {
        toggleDraw();
        draw(e.target);
      })
      activeDiv.addEventListener("mouseup", () => {toggleDraw()})
      activeDiv.addEventListener("mouseenter", function(e) {
        if(drawState)
        {
          draw(e.target);
        }
      })
      activeRow.appendChild(activeDiv);
    }
  }
}

/*
  *---------------------------->
  *----------------------------> 
  *GENERATE TOOLBAR ---- GENERATE TOOLBAR
  *---------------------------->
  *---------------------------->
*/

function generateToolbar(colorArray){
  const toolBar = document.createElement("div");
  toolBar.id = "toolBar";

  const rainbowButton = document.createElement("button")
  rainbowButton.textContent = "rainbow";
  rainbowButton.id = "rainbowButton"
  rainbowButton.addEventListener("click", () =>{
    setDrawMode(drawColor,!rainbowDraw);
  })
  toolBar.appendChild(rainbowButton);

  for(const color of colorArray){
    const colorButton = document.createElement("button");
    colorButton.id = "color";
    colorButton.style.backgroundColor = color;
    
    if(drawColor == color){
      colorButton.classList.add("activeColor");
      //colorButton.style.border = "solid red 4px;";
      //colorButton.style.backgroundColor = "red";
      colorButton.id = "activeColor";
      console.log("border set");
      console.log(colorButton);
      console.log(colorButton.style);
    }
    //colorButton.textContent = " . ";
    colorButton.addEventListener("click", function(e){
      document.querySelector("#activeColor").id = "color";
      setDrawMode(color, false);      
      e.target.id = "activeColor"
    })
    toolBar.appendChild(colorButton);
  }
  content.prepend(toolBar);
  const clearButton = document.createElement("button");
  clearButton.textContent = "clear";
  clearButton.id = "clear";
  clearButton.addEventListener("click", () =>{
    const blocks = document.querySelectorAll("#block");
    for(const block of blocks){
      block.style.backgroundColor = "white"
    }
  })
  toolBar.appendChild(clearButton);
}

/*
  *---------------------------->
  *----------------------------> 
  *GENERATE SETTINGS ---- GENERATE SETTINGS
  *---------------------------->
  *---------------------------->
*/
function generateCanvasSettings(){
  const settingsBar = document.createElement("div");
  settingsBar.id = "canvas-setting";

  //----------> SIZE SETTINGS
  const sizeBar = document.createElement("div");
  sizeBar.id = "size-setting"
  const sizeText = document.createElement("div");
  sizeText.textContent = "canvas size:";
  sizeBar.appendChild(sizeText);
  for (const size of POSSIBLE_SIZES)
  {
    const sizeButton = document.createElement("button");
    sizeButton.id = "sizeButton";
    sizeButton.textContent = String(size);
    sizeButton.addEventListener("click", () => {
      generateCanvas(size, canvas);
    });
    sizeBar.appendChild(sizeButton);
  }
  const sizeWarning = document.createElement("div");
  sizeWarning.textContent = "Warning: changing  will CLEAR canvas"
  sizeBar.appendChild(sizeWarning);
  settingsBar.appendChild(sizeBar);

  //---------> BACKGROUND SETTINGS
  const backgroundColorBar = document.createElement("div");
  backgroundColorBar.id = "background-setting";
  const backgroundColorText= document.createElement("div");
  backgroundColorText.textContent = "Background color:";
  backgroundColorBar.appendChild(backgroundColorText);
  for(const color of COLORS){
    const backgroundColorButton = document.createElement("button");
    backgroundColorButton.style.background = color;
    backgroundColorButton.id = "backgroundColorButton";
    backgroundColorButton.addEventListener("click", ()=>{
      currentBackgroundColor = color;
      setRainbowColors(currentBackgroundColor);
      for(const block of document.querySelectorAll("#block")){
        block.style.backgroundColor = color;
      }
    })
    backgroundColorBar.appendChild(backgroundColorButton);
  }
  const backgroundColorWarning = document.createElement("div");
  backgroundColorWarning.textContent = "Warning: changing  will CLEAR canvas"
  backgroundColorBar.appendChild(backgroundColorWarning);

  settingsBar.appendChild(backgroundColorBar);
  content.after(settingsBar);
  //--------------> ZOOM SETTINGS
  //const zoomBar = document.createElement("div");
  //zoomBar.id = "zoom-setting";
  //const zoomText = document.createElement("div");
  //zoomText.textContent = "Zoom level";
  //zoomBar.appendChild(zoomText);


  //for(const size of CANVAS_SIZES){
    //const zoomButton = document.createElement("button");
    //zoomButton.id = "zoom-setting";
    //zoomButton.textContent = `${(size/CANVAS_SIZES[0])*100}%`;
    //zoomButton.addEventListener("click", () => {
      //currentCanvasSize = size;
      //content.style.padding= "0 0 34px 0";
      //content.style.height = `${currentCanvasSize+60}px`;
      //canvas.style.height = `${currentCanvasSize+20}px`;
      //canvas.style.width = `${currentCanvasSize}px`;
      //content.style.height = `${currentCanvasSize}px`;
      //console.log(canvas.style.height);
      //for(const block of document.querySelectorAll("#block")){
        //block.style.height = `${currentCanvasSize/currentCanvasResolution}px`; 
        //block.style.width = `${currentCanvasSize/currentCanvasResolution}px`; 
        ////console.log(block);
        ////console.log(currentCanvasSize);
      //}
    //})
    //zoomBar.appendChild(zoomButton);
  //}
  //settingsBar.appendChild(zoomBar);
  const saveButton = document.createElement("button");
  saveButton.textContent = "save";
  saveButton.addEventListener("click", () => {
    const text = canvas.innerHTML;

    downloadToFile(text, `drawing.txt`, `text/plain`);
  })
  settingsBar.appendChild(saveButton);
  const upload = document.createElement("div");
  upload.innerHTML = `<input id="fileInput" type="file" name="file" />
  <pre id="fileContent"></pre>`;
  settingsBar.appendChild(upload);
  document.getElementById('fileInput').addEventListener('change', handleFileSelect, false); 
}

generateCanvas(currentCanvasResolution, canvas);
generateToolbar(COLORS);
generateCanvasSettings();
document.body.onmouseup = function() {
  drawState = false;
  //console.log("afafaf");
  //console.log(drawState);
}
