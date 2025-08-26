const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;
let isPaused = false;
let gameStarted = false;

// 初始化游戏
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    generateFood();
    score = 0;
    dx = 1;
    dy = 0;
    scoreElement.textContent = score;
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // 确保食物不会出现在蛇身上
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            return generateFood();
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    }
    
    // 绘制蛇头
    ctx.fillStyle = '#2E7D32';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 1, gridSize - 1);
    
    // 绘制食物
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

// 更新游戏状态
function update() {
    if (isPaused) return;
    
    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
    
    // 检查游戏结束条件
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= tileCount || 
        head.y >= tileCount ||
        checkCollision()
    ) {
        gameOver();
        return;
    }
    
    draw();
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// 游戏结束
function gameOver() {
    clearInterval(gameInterval);
    alert(`游戏结束！你的得分是: ${score}`);
    gameStarted = false;
    startBtn.textContent = '开始游戏';
    startBtn.disabled = false;
}

// 控制方向
function changeDirection(event) {
    if (!gameStarted || isPaused) return;
    
    const key = event.key;
    
    // 上
    if ((key === 'ArrowUp' || key === 'w') && dy === 0) {
        dx = 0;
        dy = -1;
    }
    // 下
    if ((key === 'ArrowDown' || key === 's') && dy === 0) {
        dx = 0;
        dy = 1;
    }
    // 左
    if ((key === 'ArrowLeft' || key === 'a') && dx === 0) {
        dx = -1;
        dy = 0;
    }
    // 右
    if ((key === 'ArrowRight' || key === 'd') && dx === 0) {
        dx = 1;
        dy = 0;
    }
}

// 开始游戏
function startGame() {
    if (gameStarted) return;
    
    initGame();
    draw();
    gameInterval = setInterval(update, 150);
    gameStarted = true;
    isPaused = false;
    startBtn.textContent = '重新开始';
    pauseBtn.textContent = '暂停';
    pauseBtn.disabled = false;
}

// 暂停游戏
function togglePause() {
    if (!gameStarted) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
}

// 事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
document.addEventListener('keydown', changeDirection);

// 初始化
pauseBtn.disabled = true;