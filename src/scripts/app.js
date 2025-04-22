const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bar = {
  width: 75,
  height: 10,
  x: (canvas.width - 75) / 2
};

let ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 2,
  dy: -2
};

let blocks = [];
let score = 0;
const blockRowCount = 5;
const blockColumnCount = 3;
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 30;

for (let c = 0; c < blockColumnCount; c++) {
  blocks[c] = [];
  for (let r = 0; r < blockRowCount; r++) {
    blocks[c][r] = { x: 0, y: 0, status: 1, score: (r + 1) * 10 };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "a") {
    bar.x -= 7;
  } else if (e.key === "d") {
    bar.x += 7;
  }
}

function keyUpHandler(e) {
  // No action needed on key up
}

function collisionDetection() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      let b = blocks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + blockWidth && ball.y > b.y && ball.y < b.y + blockHeight) {
          ball.dy = -ball.dy;
          b.status = 0;
          score += b.score;
        }
      }
    }
  }
}

function drawBar() {
  ctx.beginPath();
  ctx.rect(bar.x, canvas.height - bar.height, bar.width, bar.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status === 1) {
        let blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
        let blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;
        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBlocks();
  drawBall();
  drawBar();
  drawScore();
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > bar.x && ball.x < bar.x + bar.width) {
      ball.dy = -ball.dy;
    } else {
      document.location.reload();
    }
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
  requestAnimationFrame(update);
}

update();