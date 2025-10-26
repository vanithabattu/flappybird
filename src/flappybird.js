// Board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;

let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;
let pipeInterval = null;

window.onload = initializeGame;

function initializeGame()
{
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  requestAnimationFrame(update);
  pipeInterval = setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
};

// Main game loop
function update() {
  context.clearRect(0, 0, board.width, board.height); // Clear canvas

  if (!gameOver) {
    applyGravityToBird();
    checkGroundCollision();
  }
  updateAndDrawPipes();
  rendergame();
  requestAnimationFrame(update); // Keep loop running
  // Show Game Over overlay if game ended
  if (gameOver) showGameOver();
}

function applyGravityToBird() {
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // Move bird down, prevent going above canvas
}
function checkGroundCollision() {
  if (bird.y + bird.height >= board.height) {
    bird.y = board.height - bird.height;
    velocityY = 0;
    gameOver = true;
    clearInterval(pipeInterval);
  }
}
function updateAndDrawPipes()
  {
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    if (!gameOver) pipe.x += velocityX; // Move pipe left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Draw pipe
    // Score increment when bird passes pipe
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      pipe.passed = true;
      score++;
    }
    if (detectCollision(bird, pipe)) {
      console.log(bird);
      gameOver = true; // End game if collision
      clearInterval(pipeInterval); // Stop generating new pipes
    }
  }
}
function rendergame() 
{
  drawBird(); // Draw bird
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("" + score, 10, 25); // Display score at top-left
}

// Draw bird
function drawBird() {
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Create pipes
function placePipes() {
  if (gameOver) return;

  let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardHeight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  };
  pipeArray.push(topPipe);

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
