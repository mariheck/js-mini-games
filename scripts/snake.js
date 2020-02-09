var canvas = document.querySelector("#snakeCanvas");
var messageDisplay = document.querySelector("#snakeMsg");

var ctx;
var score;

init();

function init(){
  ctx = canvas.getContext("2d");
  score = 0;
  messageDisplay.textContent = "Score : " + score;
}
