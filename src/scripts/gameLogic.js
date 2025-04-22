const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const barWidth = 100;
const barHeight = 20;
let barX = (canvas.width - barWidth) / 2;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2;
let ballDY = -2;

const blockRows = 5;
const blockCols = 10;
const blockWidth = canvas.width / blockCols;
const blockHeight = 20;
const blocks = [];
let score = 0;

// Movement variables
let moveLeft = false;
let moveRight = false;
const barSpeed = 2.75;

// Initialize blocks
for (let row = 0; row < blockRows; row++) {
  blocks[row] = [];
  for (let col = 0; col < blockCols; col++) {
    blocks[row][col] = {
      x: col * blockWidth,
      y: row * blockHeight,
      hit: false,
      value: (row + 1) * 10,
    };
  }
}

// Draw the bar
function drawBar() {
  ctx.fillStyle = "#00f";
  ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

// Draw the blocks
function drawBlocks() {
  blocks.forEach((row) => {
    row.forEach((block) => {
      if (!block.hit) {
        ctx.fillStyle = "#0f0";
        ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(block.x, block.y, blockWidth, blockHeight);
      }
    });
  });
}

// Draw the score
function drawScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}
function update() {
  // Ball movement
  ballX += ballDX;
  ballY += ballDY;

  // Ball collision with walls
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballDX = -ballDX;
    normalizeBallSpeed();
  }
  if (ballY - ballRadius < 0) {
    ballDY = -ballDY;
    normalizeBallSpeed();
  }

  // Ball collision with bar
  if (
    ballY + ballRadius >= canvas.height - barHeight && // Ball is at the bar's height
    ballX > barX && // Ball is within the bar's left edge
    ballX < barX + barWidth // Ball is within the bar's right edge
  ) {
    // Adjust the ball's vertical direction
    ballDY = -Math.abs(ballDY);

    // Adjust the ball's horizontal direction based on where it hits the bar
    const hitPosition = (ballX - barX) / barWidth; // Normalize hit position (0 to 1)
    const angle = ((hitPosition - 0.5) * Math.PI) / 3; // Map to an angle (-60° to 60°)
    ballDX = Math.sin(angle);
    ballDY = -Math.cos(angle);

    // Normalize the velocity to maintain constant speed
    normalizeBallSpeed();
  }

  // Ball collision with blocks
  blocks.forEach((row) => {
    row.forEach((block) => {
      if (!block.hit) {
        if (
          ballX > block.x &&
          ballX < block.x + blockWidth &&
          ballY - ballRadius < block.y + blockHeight &&
          ballY + ballRadius > block.y
        ) {
          ballDY = -ballDY;
          block.hit = true;
          score += block.value;

          // Normalize the velocity to maintain constant speed
          normalizeBallSpeed();
        }
      }
    });
  });

  // Ball out of bounds
  if (ballY + ballRadius > canvas.height) {
    alert("Game Over!");
    document.location.reload();
  }

  // Bar movement
  if (moveLeft) {
    barX = Math.max(0, barX - barSpeed);
  }
  if (moveRight) {
    barX = Math.min(canvas.width - barWidth, barX + barSpeed);
  }
}

// Normalize the ball's speed to maintain a constant velocity
function normalizeBallSpeed() {
  const speed = 3; // Reduce the speed to make the ball slower
  const magnitude = Math.sqrt(ballDX * ballDX + ballDY * ballDY);
  ballDX = (ballDX / magnitude) * speed;
  ballDY = (ballDY / magnitude) * speed;
}

// Render the game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBar();
  drawBall();
  drawBlocks();
  drawScore();
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  if (event.key === "a" || event.key === "A") {
    moveLeft = true;
  } else if (event.key === "d" || event.key === "D") {
    moveRight = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "a" || event.key === "A") {
    moveLeft = false;
  } else if (event.key === "d" || event.key === "D") {
    moveRight = false;
  }
});

// Start the game
gameLoop();
