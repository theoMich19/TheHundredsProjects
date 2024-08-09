const canvas = document.getElementById("pongCanvas");
const context = canvas.getContext("2d");

// Paddle settings
const paddleWidth = 10;
const paddleHeight = 75;
const paddleSpeed = 8;

// Ball settings
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Player paddles
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

// Player scores
let player1Score = 0;
let player2Score = 0;

// Key press states
const keys = {
    up: false,
    down: false,
    w: false,
    s: false,
};

// Event listeners for key presses
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") keys.up = true;
    if (event.key === "ArrowDown") keys.down = true;
    if (event.key === "z") keys.w = true;
    if (event.key === "s") keys.s = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") keys.up = false;
    if (event.key === "ArrowDown") keys.down = false;
    if (event.key === "z") keys.w = false;
    if (event.key === "s") keys.s = false;
});

// Game loop
function gameLoop() {
    movePaddles();
    moveBall();
    drawEverything();
    requestAnimationFrame(gameLoop);
}

function movePaddles() {
    if (keys.w && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    }
    if (keys.s && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += paddleSpeed;
    }
    if (keys.up && paddle2Y > 0) {
        paddle2Y -= paddleSpeed;
    }
    if (keys.down && paddle2Y < canvas.height - paddleHeight) {
        paddle2Y += paddleSpeed;
    }
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= paddleWidth) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            player2Score++;
            resetBall();
        }
    }
    if (ballX >= canvas.width - paddleWidth) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            player1Score++;
            resetBall();
        }
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
}

function drawEverything() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--paddle-color');
    context.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    context.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Draw ball
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ball-color');
    context.beginPath();
    context.arc(ballX, ballY, ballSize, 0, Math.PI * 2, true);
    context.fill();

    // Draw scores
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText(`Player 1: ${player1Score}`, 50, 50);
    context.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 50);
}

// Start the game loop
gameLoop();
