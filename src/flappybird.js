// Board
let board; //canvas element for the game
let boardWidth = 360; //width of the board
let boardHeight = 640;//height of the board
let context;// canvas rendering context 2D

// Bird
let birdWidth = 34;  //width of the bird sprite 
let birdHeight = 24; //height of thr bird sprite
let birdX = boardWidth / 8; //Initial Horizontal position of the bird
let birdY = boardHeight / 2; //Initial vertical position of the bird
let birdImg; //Image object for the bird

let bird = {
  x: birdX,//bird x coordinate
  y: birdY, //bird y coordinate
  width: birdWidth,//bird width
  height: birdHeight//bird height
};

// Pipes
let pipeArray = [];//Array to hold all pipes
let pipeWidth = 64;//Width od the each pipe
let pipeHeight = 512;//Height of each pipe
let pipeX = boardWidth;//Initial horizontal position of the new pipes

let topPipeImg; //image for the pipe
let bottomPipeImg;//image for the bottom pipe

// Physics
let velocityX = -2;//speed at which pipes move left
let velocityY = 0;//vertical speed of the bird
let gravity = 0.4;//gravity pulling the bird down
let gameOver = false;//game over flag
let score = 0; //player score
let pipeInterval = null;//Interval ID for pipe generation
//run after page load
window.onload = function () {
  board = document.getElementById("board");//get canvas element
  board.height = boardHeight;//set canvas height
  board.width = boardWidth;//set canvas width
  context = board.getContext("2d");//get 2D rendering context

  birdImg = new Image(); //create Image object for the bird
  birdImg.src = "./flappybird.png";// set bird image source

  topPipeImg = new Image(); //create image object for the top pipe
  topPipeImg.src = "./toppipe.png";//set top pipe image source

  bottomPipeImg = new Image();//create image obecjt for the bottom pipe
  bottomPipeImg.src = "./bottompipe.png"; //set bottom pipe image source

  requestAnimationFrame(update);//start main game loop
  pipeInterval = setInterval(placePipes, 1500);//generate pipes every 1.5 seconds
  document.addEventListener("keydown", moveBird);//Listen for key presses
};

// Main game loop
function update() {
  requestAnimationFrame(update);//keep loop runing
  context.clearRect(0, 0, board.width, board.height);//clear canvas

  if (!gameOver) {
    //apply  Gravity to bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);//Move bird down,prevent going above canvas

    // Ground collision
    if (bird.y + bird.height >= board.height) {
      bird.y = board.height - bird.height;//stop bird at ground
      velocityY = 0;//reset vertical speed
      gameOver = true;//End game
      clearInterval(pipeInterval);//stop generating new pipes
    }
  }

  // Move and draw pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];

    if (!gameOver) pipe.x += velocityX;//move pipe left

    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);//draw pipe

    // Score increment when bird passes pipes
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pipe.passed = true;
      score++;
    }

    //check Collision between pipe and bird
    if (detectCollision(bird, pipe)) {
      gameOver = true;//end game if collision
      clearInterval(pipeInterval);//stop generating new pipe
    }
  }

  // Draw bird
  drawBird();

  // Draw score
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("" + score, 10, 25);//display score at top left

  // show Game Over overlay if game ended
  if (gameOver) showGameOver();
}

// Draw bird on canvas
function drawBird() {
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Create new pipes
function placePipes() {
  if (gameOver) return;//stop creating pipes if game over

  let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardHeight / 4;//space between top and bottom pipes
//top pipe
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
  pipeArray.push(topPipe);//add to array
//bottom pipe
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
  pipeArray.push(bottomPipe);
}

// Jump controls
function moveBird(e) {
  if (gameOver) {
    resetGame(); // Press Space after Game Over to restart
    return;
  }

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
    velocityY = -6; 
  }
}

// Collision detection
function detectCollision(bird, pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y < pipe.y + pipe.height &&
    bird.y + bird.height > pipe.y
  );
}

// Game Over overlay
function showGameOver() {
  context.fillStyle = "rgba(0,0,0,0.5)";
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.fillStyle = "white";
  context.font = "bold 48px Arial";
  context.textAlign = "center";
  context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 10);

  context.font = "16px Arial";
  context.fillText("Press Space to restart", boardWidth / 2, boardHeight / 2 + 30);
}

// Reset game after Game Over
function resetGame() {
  bird.y = boardHeight / 2;
  velocityY = 0;
  pipeArray = [];
  score = 0;
  gameOver = false;
  pipeInterval = setInterval(placePipes, 1500);
}
