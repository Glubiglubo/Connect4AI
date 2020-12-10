let game;
let size = 600;
let offset = 100;
let boardsize = 4;
let bckgcol = 0;

function setup() {
  canvas = createCanvas(size, size);
  canvas.position(offset, offset);
  game = new Game(boardsize);
}


function draw() {
  background(bckgcol);
  game.update();
}

function mousePressed() {
  game.getplmove(mouseX, mouseY);
}
