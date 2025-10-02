//board
let board;
let _boardwidth = 360;
let _boardHeight = 640;
let context;

//bird
let _birdWidth = 34;
let _birdHeight = 24;
let _birdx = _birdWidth / 8;
let _birdY = _birdHeight / 2;
let birdImg;

//pipes
let _pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let _pipeHeight = 512;
let _pipeX = _boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

window.load = function () {
  board = document.getElementById("board");
  board.height = _boardHeight;
  board.width = _boardwidth;
  context = board.getcontext("2d");

  //draw falppy bird
  context.fillstyle = "green";
  context.fillRect(100, 100, 50, 30);

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, 100, 100, 50, 30);
  };
};
