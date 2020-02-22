// jshint esversion:6

var canvas = document.querySelector("#snakeCanvas");
var messageDisplay = document.querySelector("#snakeMsg");
var reset = document.querySelector(".reset");
var easy = document.querySelector(".levelEasy");
var hard = document.querySelector(".levelHard");
var bg = document.querySelector("body");

var ctx;
var blockSize = 30;
var widthInBlocks = canvas.width/blockSize;
var heightInBlocks = canvas.height/blockSize;
var radius = blockSize/2;
var snake;
var apple;
var gameScore = 0;
var scoreToAdd;
var timeout;
var delay;
var levelEasy = true;

run();


// =========================================================
// INIT FUNCTION
// =========================================================

function run(){
  ctx = canvas.getContext("2d");
  start();
}


// =========================================================
// START FUNCTION
// =========================================================

function start(){
  init();
  refreshCanvas();
}


// =========================================================
// INIT FUNCTION
// =========================================================

function init(){
  if(levelEasy){
    easy.classList.add("selected");
    hard.classList.remove("selected");
    scoreToAdd = 50;
    delay = 150;
  }else{
    hard.classList.add("selected");
    easy.classList.remove("selected");
    scoreToAdd = 100;
    delay = 90;
  }

  score(0);
  bg.classList.remove("game-over");
  snake = new Snake();
  apple = new Apple();
  do{
    apple.setPosition();
  }while(apple.onSnake(snake.body));
  clearTimeout(timeout);
}


// =========================================================
// REFRESH CANVAS FUNCTION
// =========================================================

function refreshCanvas(){
  snake.nextMove();
  if(snake.checkCollision()){
    gameOver();
  } else {
    if(snake.isEatingApple(apple)){
      score(scoreToAdd);
      snake.ateApple = true;
      do{
        apple.setPosition();
      }while(apple.onSnake(snake.body));
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    apple.draw();
    timeout = setTimeout(refreshCanvas, delay);
  }
}


// =========================================================
// GAME OVER FUNCTION
// =========================================================

function gameOver(){
  // Red Background
  bg.classList.add("game-over");

  // Text Styling
  ctx.fillStyle = "#232323";
  ctx.textAlign = "center";
  ctx.font = "bold 70px sans-serif";
  ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 40);
  ctx.font = "20px sans-serif";
  ctx.fillText("Press Enter to play again", canvas.width/2, canvas.height/2);
}


// =========================================================
// SCORE FUNCTION
// =========================================================

function score(currScoreToAdd){
  // Init new game
  if(currScoreToAdd === 0){
    gameScore = 0;
  // Adding score
  }else{
    gameScore += currScoreToAdd;
  }
  // Displaying the score
  messageDisplay.textContent = "Score : " + gameScore;
}



// =========================================================
// DRAW BLOCK FUNCTION
// =========================================================

function drawBlock(ctx, position, color){
  ctx.fillStyle = color;
  var x = position[0] * blockSize;
  var y = position[1] * blockSize;
  ctx.fillRect(x, y, blockSize, blockSize);
}

// =========================================================
// DRAW CIRCLE FUNCTION
// =========================================================

function drawCircle(ctx, position, color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(position[0] * blockSize + radius, position[1] * blockSize + radius, radius, 0, 2*Math.PI);
  ctx.fill();
}


// =========================================================
// SNAKE OBJECT
// =========================================================

function Snake(){

  this.body = [[3,2],[2,2],[1,2]];
  this.direction = "right";
  this.ateApple = false;

  // DRAW SNAKE
  this.draw = function(){
    for(var i = 0; i < this.body.length; i++){
      drawBlock(ctx, this.body[i], "#ED7E70");
    }
  };

  // SNAKE RUNNING
  this.nextMove = function(){
    var nextPosition = this.body[0].slice();

    switch(this.direction){
      case "left":
        nextPosition[0] -= 1;
        break;
      case "right":
        nextPosition[0] += 1;
        break;
      case "up":
        nextPosition[1] -= 1;
        break;
      case "down":
        nextPosition[1] += 1;
        break;
      default:
        break;
    }

    this.body.unshift(nextPosition);
    if(!this.ateApple) {
      this.body.pop();
    } else {
      this.ateApple = false;
    }
  };

  // SETTING DIRECTION OF SNAKE
  this.setDirection = function(newDirection){
    switch(this.direction){
      case "right":
      case "left":
        if(newDirection === "up" || newDirection === "down") this.direction = newDirection;
        break;
      case "up":
      case "down":
        if(newDirection === "right" || newDirection === "left") this.direction = newDirection;
        break;
      default:
        break;
    }
  };

  // CHECKING COLLISION
  this.checkCollision = function(){
    var wallCollision = false;
    var snakeCollision = false;

    if(this.body[0][0] < 0 || this.body[0][1] < 0 || this.body[0][0] > widthInBlocks - 1 || this.body[0][1] > heightInBlocks - 1){
      wallCollision = true;
    }

    for(var i = 1; i < this.body.length; i++){
      if(this.body[0][0] === this.body[i][0] && this.body[0][1] === this.body[i][1]){
        snakeCollision = true;
      }
    }

    return wallCollision || snakeCollision;
  };

  // SNAKE IS EATING APPLE
  this.isEatingApple = function(curApple){
    if(this.body[0][0] === curApple.position[0] && this.body[0][1] === curApple.position[1]){
      return true;
    } else {
      return false;
    }
  };
}


// =========================================================
// APPLE OBJECT
// =========================================================

function Apple(){

  this.position = [];

  // SET APPLE POSITION
  this.setPosition = () => {
    var x = Math.round(Math.random() * (widthInBlocks - 1));
    var y = Math.round(Math.random() * (heightInBlocks - 1));
    this.position = [x, y];
  };

  // DRAW APPLE
  this.draw = () => {
    drawCircle(ctx, this.position, "#51a149");
  };

  // APPLE ON SNAKE TEST
  this.onSnake = curSnake => {
    curSnake.forEach(snakeBlock => {
      if(this.position[0] === snakeBlock[0] && this.position[1] === snakeBlock[1]){
        return true;
      }
    });
    return false;
  };
}


// =========================================================
// KEYBOARD EVENTS
// =========================================================

document.onkeydown = e => {
  switch(e.keyCode){
    case 37:
      snake.setDirection("left");
      break;
    case 38:
      snake.setDirection("up");
      break;
    case 39:
      snake.setDirection("right");
      break;
    case 40:
      snake.setDirection("down");
      break;
    case 13:
      start();
      break;
    default:
      break;
  }
};


// =========================================================
// BUTTONS EVENTS
// =========================================================

reset.addEventListener("click", () => start());

easy.addEventListener("click", () => {
  levelEasy = true;
  start();
});

hard.addEventListener("click", () => {
  levelEasy = false;
  start();
});
