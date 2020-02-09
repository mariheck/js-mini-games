var canvas = document.querySelector("#snakeCanvas");
var messageDisplay = document.querySelector("#snakeMsg");

var ctx;
var blockSize = 30;
var widthInBlocks = canvas.width/blockSize;
var heightInBlocks = canvas.height/blockSize;
var radius = blockSize/2;
var score;

init();

function init(){
  ctx = canvas.getContext("2d");
  score = 0;
  messageDisplay.textContent = "Score : " + score;
}

function Apple(){
  this.draw = function(){
    var x = (Math.round(Math.random() * widthInBlocks))*blockSize + radius;
    var y = (Math.round(Math.random() * heightInBlocks))*blockSize + radius;

    ctx.fillStyle = "#51a149";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fill();
  };
}
