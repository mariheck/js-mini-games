// jshint esversion:6

let canvas = document.querySelector("#snakeCanvas");
let messageDisplay = document.querySelector("#snakeMsg");
let resetBtn = document.querySelector(".reset");
let easyBtn = document.querySelector(".levelEasy");
let hardBtn = document.querySelector(".levelHard");
let bodyBackground = document.querySelector("body");

const ctx = canvas.getContext("2d"),
      blockSize = 30,
      widthInBlocks = canvas.width/blockSize,
      heightInBlocks = canvas.height/blockSize,
      radius = blockSize/2;

let levelEasy = true;

let snake, apple;
let gameScore, scoreToAdd;
let timeout, delay;

newStart();



// =========================================================
// NEW START FUNCTION
// =========================================================

function newStart(){
  gameInit();
  refreshCanvas();
}


// =========================================================
// GAME INIT FUNCTION
// =========================================================

function gameInit(){
  // INIT DEPENDING ON SELECTED LEVEL
  if(levelEasy){
    easyBtn.classList.add("selected");
    hardBtn.classList.remove("selected");
    scoreToAdd = 50;
    delay = 150;
  } else {
    hardBtn.classList.add("selected");
    easyBtn.classList.remove("selected");
    scoreToAdd = 100;
    delay = 90;
  }

  // PUT THE GAME BACK TO START CONFIG
  score(0);
  bodyBackground.classList.remove("game-over");
  clearTimeout(timeout);

  // CREATE NEW SNAKE AND APPLE
  snake = new Snake();
  apple = new Apple();
  do {
    apple.setPosition();
  } while(apple.onSnake());
}


// =========================================================
// REFRESH CANVAS FUNCTION
// =========================================================

function refreshCanvas(){
  snake.nextMove();
  if(snake.checkCollision()){
    gameOver();
  } else {
    if(snake.isEatingApple()){
      score(scoreToAdd);
      snake.ateApple = true;
      do{
        apple.setPosition();
      }while(apple.onSnake());
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
  // RED BACKGROUND
  bodyBackground.classList.add("game-over");

  // TEXT STYLING
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
  // INIT NEW GAME
  if(currScoreToAdd === 0){
    gameScore = 0;
  // ADDING SCORE
  } else {
    gameScore += currScoreToAdd;
  }

  // DISPLAYING THE SCORE
  messageDisplay.textContent = "Score : " + gameScore;
}


// =========================================================
// DRAW BLOCK FUNCTION
// =========================================================

function drawBlock(position){
  ctx.fillStyle = "#ED7E70";
  const x = position[0] * blockSize;
  const y = position[1] * blockSize;
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
  this.draw = () => {
    this.body.forEach(bodyBlock => {
      drawBlock(bodyBlock);
    });
  };

  // SNAKE MOVING
  this.nextMove = () => {
    let nextPosition = this.body[0].slice();

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
  this.setDirection = newDirection => {
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
  this.checkCollision = () => {
    let wallCollision = false;
    let snakeCollision = false;

    if(this.body[0][0] < 0 || this.body[0][1] < 0 || this.body[0][0] > widthInBlocks - 1 || this.body[0][1] > heightInBlocks - 1){
      wallCollision = true;
    }

    for(let i = 1; i < this.body.length; i++){
      if(this.body[0][0] === this.body[i][0] && this.body[0][1] === this.body[i][1]){
        snakeCollision = true;
      }
    }

    return wallCollision || snakeCollision;
  };

  // SNAKE IS EATING APPLE
  this.isEatingApple = () => {
    if(this.body[0][0] === apple.position[0] && this.body[0][1] === apple.position[1]){
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
    const x = Math.round(Math.random() * (widthInBlocks - 1));
    const y = Math.round(Math.random() * (heightInBlocks - 1));
    this.position = [x, y];
  };

  // DRAW APPLE
  this.draw = () => {
    ctx.fillStyle = "#51a149";
    ctx.beginPath();
    ctx.arc(this.position[0] * blockSize + radius, this.position[1] * blockSize + radius, radius, 0, 2*Math.PI);
    ctx.fill();
  };

  // APPLE ON SNAKE TEST
  this.onSnake = () => {
    const curSnake = snake.body;
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
      newStart();
      break;
    default:
      break;
  }
};


// =========================================================
// BUTTONS EVENTS
// =========================================================

resetBtn.addEventListener("click", () => newStart());

easyBtn.addEventListener("click", () => {
  if(!levelEasy){
    levelEasy = true;
    newStart();
  }
});

hardBtn.addEventListener("click", () => {
  if(levelEasy){
    levelEasy = false;
    newStart();
  }
});
