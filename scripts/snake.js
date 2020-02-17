var canvas = document.querySelector("#snakeCanvas");
var messageDisplay = document.querySelector("#snakeMsg");
var reset = document.querySelector(".reset");
var easy = document.querySelector(".levelEasy");
var hard = document.querySelector(".levelHard");

var ctx;
var blockSize = 30;
var widthInBlocks = canvas.width/blockSize;
var heightInBlocks = canvas.height/blockSize;
var radius = blockSize/2;
var snake;
var apple;
var gameScore;
var scoreToAdd = 50;
var timeout;
var delay = 500;

init();


// =========================================================
// INIT FUNCTION
// =========================================================

function init(){
  ctx = canvas.getContext("2d");
  start();
}


// =========================================================
// START FUNCTION
// =========================================================

function start(){
  gameScore = 0;
  messageDisplay.textContent = "Score : " + gameScore;
  snake = new Snake();
  apple = new Apple();
  apple.setPosition();
  clearTimeout(timeout);
  refreshCanvas();
}


// =========================================================
// REFRESH CANVAS FUNCTION
// =========================================================

function refreshCanvas(){
  snake.run();
  if(snake.checkCollision()){
    gameOver();
  } else {
    if(snake.isEatingApple(apple)){
      score();
      snake.ateApple = true;
      do{
        apple.setPosition();
      }while(apple.onSnake(snake));
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

function score(){
  gameScore += scoreToAdd;
  messageDisplay.textContent = "Score : " + gameScore;
}



// =========================================================
// DRAW BLOCK FUNCTION
// =========================================================

function drawBlock(ctx, position){
  var x = position[0] * blockSize;
  var y = position[1] * blockSize;
  ctx.fillRect(x, y, blockSize, blockSize);
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
    ctx.fillStyle = "#4682b4";
    for(var i = 0; i < this.body.length; i++){
      drawBlock(ctx, this.body[i]);
    }
  };

  // SNAKE RUNNING
  this.run = function(){
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
  this.setPosition = function(){
    var x = (Math.round(Math.random() * widthInBlocks));
    var y = (Math.round(Math.random() * heightInBlocks));
    this.position = [x, y];
  };

  // DRAW APPLE
  this.draw = function(){
    ctx.fillStyle = "#51a149";
    ctx.beginPath();
    ctx.arc(this.position[0] * blockSize + radius, this.position[1] * blockSize + radius, radius, 0, 2*Math.PI);
    ctx.fill();
  };

  // APPLE ON SNAKE TEST
  this.onSnake = function(curSnake){
    for(var i = 0; i < curSnake.body.length; i++){
      if(this.position[0] === curSnake.body[i][0] && this.position[1] === curSnake.body[i][1]){
        return true;
      }
    }
    return false;
  };
}


// =========================================================
// KEYBOARD EVENTS
// =========================================================

document.onkeydown = function keyDown(e){
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

reset.addEventListener("click", function(){
  start();
});

easy.addEventListener("click", function(){
  this.classList.add("selected");
  hard.classList.remove("selected");
  delay = 500;
  scoreToAdd = 50;
  start();
});

hard.addEventListener("click", function(){
  this.classList.add("selected");
  easy.classList.remove("selected");
  delay = 100;
  scoreToAdd = 100;
  start();
});
