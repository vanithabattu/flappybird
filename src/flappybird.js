// Board
let board; // Canvas element for the game
let boardWidth = 360; // Width of the game board
let boardHeight = 640; // Height of the game board
let context; // Canvas rendering context (2D)

// Bird
let birdWidth = 34; // Width of the bird sprite
let birdHeight = 24; // Height of the bird sprite
let birdX = boardWidth / 8; // Initial horizontal position of the bird
let birdY = boardHeight / 2; // Initial vertical position of the bird
let birdImg; // Image object for the bird

let bird = {
  x: birdX, // Bird's x-coordinate
  y: birdY, // Bird's y-coordinate
  width: birdWidth, // Bird's width
  height: birdHeight, // Bird's height
};

// Pipes
let pipeArray = []; // Array to hold all pipes
let pipeWidth = 64; // Width of each pipe
let pipeHeight = 512; // Height of each pipe
let pipeX = boardWidth; // Initial horizontal position for new pipes

let topPipeImg; // Image for top pipe
let bottomPipeImg; // Image for bottom pipe

// Physics
let velocityX = -2; // Speed at which pipes move left
let velocityY = 0; // Vertical speed of the bird
let gravity = 0.4; // Gravity pulling the bird down
let gameOver = false; // Game over flag
let score = 0; // Player score
let pipeInterval = null; // Interval ID for pipe generation

window.onload = initializeGame;

function initializeGame() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // Load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  // Start game
  requestAnimationFrame(update);
  pipeInterval = setInterval(placePipes, 1500);
  document.addEventListener("keydown", moveBird);
}

// Main game loop
function update() {
  // requestAnimationFrame(update); // Keep loop running
  context.clearRect(0, 0, board.width, board.height); // Clear canvas

  if (!gameOver) {
    // Apply gravity to bird
    applyGravityToBird();
    // Ground collision
    checkGroundCollision();
  }
  // Move and draw pipes
  updateAndDrawPipes();
  renderGame();
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
function updateAndDrawPipes() {
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
// Inside updateAndDrawPipes(), before moving pipes:
let currentSpeed = velocityX - Math.floor(score / 3) * 0.5; // Speed up every 3 points

if (!gameOver) pipe.x += currentSpeed;


   // if (!gameOver) pipe.x += velocityX; // Move pipe left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Draw pipe
    // Score increment when bird passes pipe

    if ( !pipe.passed && pipe.img === bottomPipeImg &&  // only count bottom pipes
      bird.x > pipe.x + pipe.width
    ) {
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
function renderGame() {
  drawBird(); // Draw bird
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("" + score, 10, 25); // Display score at top-left
      console.log("Score: " + score);

}

// Draw bird on canvas
function drawBird() {
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Create new pipes
function placePipes() {
  if (gameOver) return; // Stop creating pipes if game over

  let randomPipeY = -pipeHeight / 4 - Math.random() * (pipeHeight / 2); // Random vertical position for top pipe
  let openingSpace = boardHeight / 4; // Space between top and bottom pipes

  // Top pipe
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false, // Has bird passed this pipe for scoring?
  };
  pipeArray.push(topPipe); // Add to array

  // Bottom pipe
  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe); // Add to array
}

// Jump controls
function moveBird(e) {
  if (gameOver) {
    resetGame(); // Restart game on key press after Game Over
    return;
  }

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
    velocityY = -6; // Make bird jump
  }
}

// Check collision between bird and pipe
function detectCollision(bird, pipe) {
  return (
    bird.x < pipe.x + pipe.width &&
    bird.x + bird.width > pipe.x &&
    bird.y < pipe.y + pipe.height &&
    bird.y + bird.height > pipe.y
  );
}

// Display Game Over screen
function showGameOver() {
  context.fillStyle = "rgba(0,0,0,0.5)"; // Semi-transparent overlay
  context.fillRect(0, 0, boardWidth, boardHeight); // Cover canvas

  context.fillStyle = "white";
  context.font = "bold 48px Arial";
  context.textAlign = "center";
  context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 10); // Game over text

  context.font = "16px Arial";
  context.fillText(
    "Press Space to restart",
    boardWidth / 2,
    boardHeight / 2 + 30
  ); // Restart instruction
}

// Reset game after Game Over
function resetGame() {
  bird.y = boardHeight / 2; // Reset bird position
  velocityY = 0; // Reset vertical speed
  pipeArray = []; // Clear all pipes
  score = 0; // Reset score
  gameOver = false; // Clear game over state
  pipeInterval = setInterval(placePipes, 1500); // Restart pipe generation
}
