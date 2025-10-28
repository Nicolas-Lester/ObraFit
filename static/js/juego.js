// Batalla Nutricional - Juego de ObraFit
// ========================================

// Configuración del Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let gameSpeed = 2.5;
let frameCount = 0;

// Jugador (Obrero) - MÁS GRANDE
const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 120,
    width: 80,
    height: 80,
    speed: 10,
    emoji: '👷',
    dx: 0
};

// Alimentos que caen - MÁS GRANDES
let fallingItems = [];

// Definir alimentos saludables y chatarra
const healthyFoods = [
    { emoji: '🥗', name: 'Ensalada', points: 10 },
    { emoji: '🍎', name: 'Manzana', points: 10 },
    { emoji: '🥑', name: 'Palta', points: 15 },
    { emoji: '🍗', name: 'Pollo', points: 15 },
    { emoji: '🥚', name: 'Huevo', points: 10 },
    { emoji: '🥛', name: 'Leche', points: 10 },
    { emoji: '🍌', name: 'Plátano', points: 10 },
    { emoji: '🥕', name: 'Zanahoria', points: 10 },
    { emoji: '🍊', name: 'Naranja', points: 10 },
    { emoji: '🥦', name: 'Brócoli', points: 15 }
];

const junkFoods = [
    { emoji: '🍕', name: 'Pizza', damage: true },
    { emoji: '🍔', name: 'Hamburguesa', damage: true },
    { emoji: '🍟', name: 'Papas Fritas', damage: true },
    { emoji: '🍩', name: 'Dona', damage: true },
    { emoji: '🥤', name: 'Bebida', damage: true },
    { emoji: '🍬', name: 'Dulce', damage: true },
    { emoji: '🍫', name: 'Chocolate', damage: true },
    { emoji: '🌭', name: 'Hot Dog', damage: true }
];

// Función para iniciar el juego
function startGame() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    document.getElementById('gameOver').classList.add('hidden');
    
    // Resetear variables
    score = 0;
    lives = 3;
    gameSpeed = 2.5;
    fallingItems = [];
    frameCount = 0;
    gamePaused = false;
    player.x = canvas.width / 2 - 40;
    
    updateScore();
    updateLives();
    
    gameRunning = true;
    gameLoop();
}

// Función para pausar/reanudar
function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    const btn = document.getElementById('btnPause');
    if (btn) {
        btn.textContent = gamePaused ? '▶️' : '⏸️';
    }
}

// Crear un nuevo item que cae - MÁS GRANDE
function createFallingItem() {
    const isHealthy = Math.random() > 0.4; // 60% saludable, 40% chatarra
    const foodArray = isHealthy ? healthyFoods : junkFoods;
    const food = foodArray[Math.floor(Math.random() * foodArray.length)];
    
    const item = {
        x: Math.random() * (canvas.width - 60),
        y: -60,
        width: 60,
        height: 60,
        speed: gameSpeed + Math.random() * 2,
        emoji: food.emoji,
        isHealthy: isHealthy,
        points: food.points || 0,
        name: food.name
    };
    
    fallingItems.push(item);
}

// Dibujar el jugador - MÁS GRANDE
function drawPlayer() {
    ctx.font = 'bold 70px Arial';
    ctx.fillText(player.emoji, player.x, player.y + 60);
    
    // Sombra para mejor visibilidad
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
}

// Dibujar items que caen - MÁS GRANDES
function drawFallingItems() {
    ctx.font = 'bold 50px Arial';
    fallingItems.forEach(item => {
        // Sombra
        ctx.shadowColor = item.isHealthy ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        ctx.shadowBlur = 8;
        ctx.fillText(item.emoji, item.x, item.y + 45);
    });
    ctx.shadowColor = 'transparent';
}

// Dibujar fondo con nubes
function drawBackground() {
    // Cielo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Nubes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(150, 80, 70, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(800, 120, 90, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(500, 90, 60, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Edificios en construcción (fondo)
    drawBuilding(100, canvas.height - 250, 120, 200, '#95A5A6', '#BDC3C7');
    drawBuilding(250, canvas.height - 300, 100, 250, '#7F8C8D', '#95A5A6');
    drawBuilding(750, canvas.height - 280, 150, 230, '#34495E', '#7F8C8D');
    
    // Grúa de construcción
    drawCrane(400, canvas.height - 350);
    
    // Suelo
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 45, canvas.width, 5);
}

// Dibujar edificio en construcción
function drawBuilding(x, y, width, height, darkColor, lightColor) {
    // Estructura principal
    ctx.fillStyle = darkColor;
    ctx.fillRect(x, y, width, height);
    
    // Ventanas/pisos
    ctx.fillStyle = lightColor;
    const floors = Math.floor(height / 40);
    for (let i = 0; i < floors; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.fillRect(x + 10 + j * 35, y + 10 + i * 40, 25, 30);
        }
    }
    
    // Vigas de construcción
    ctx.strokeStyle = '#E67E22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + width, y + 20);
    ctx.stroke();
}

// Dibujar grúa de construcción
function drawCrane(x, y) {
    // Torre vertical
    ctx.fillStyle = '#E67E22';
    ctx.fillRect(x, y, 15, 300);
    
    // Brazo horizontal
    ctx.fillStyle = '#E67E22';
    ctx.fillRect(x - 80, y - 10, 200, 12);
    
    // Contrapeso
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(x - 90, y - 5, 25, 30);
    
    // Cable
    ctx.strokeStyle = '#2C3E50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 100, y);
    ctx.lineTo(x + 100, y + 60);
    ctx.stroke();
    
    // Gancho
    ctx.fillStyle = '#F39C12';
    ctx.beginPath();
    ctx.arc(x + 100, y + 65, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Actualizar posiciones
function update() {
    if (gamePaused) return;
    
    // Mover jugador
    player.x += player.dx;
    
    // Límites del canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Mover items que caen
    fallingItems.forEach((item, index) => {
        item.y += item.speed;
        
        // Detectar colisión con el jugador
        if (checkCollision(player, item)) {
            if (item.isHealthy) {
                // Alimento saludable
                score += item.points;
                updateScore();
                showFloatingText('+' + item.points + ' 🎉', item.x, item.y, '#22c55e');
                playSound('success');
            } else {
                // Comida chatarra
                lives--;
                updateLives();
                showFloatingText('¡Auch! 💥', item.x, item.y, '#ef4444');
                playSound('damage');
                
                if (lives <= 0) {
                    endGame();
                }
            }
            fallingItems.splice(index, 1);
        }
        
        // Eliminar items que salieron del canvas
        if (item.y > canvas.height) {
            fallingItems.splice(index, 1);
        }
    });
    
    // Aumentar dificultad gradualmente
    if (frameCount % 600 === 0 && gameSpeed < 5) {
        gameSpeed += 0.2;
    }
}

// Detectar colisión
function checkCollision(player, item) {
    return player.x < item.x + item.width &&
           player.x + player.width > item.x &&
           player.y < item.y + item.height &&
           player.y + player.height > item.y;
}

// Mostrar texto flotante - MÁS GRANDE
function showFloatingText(text, x, y, color) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.position = 'fixed';
    textElement.style.left = (x + canvas.getBoundingClientRect().left) + 'px';
    textElement.style.top = (y + canvas.getBoundingClientRect().top) + 'px';
    textElement.style.color = color;
    textElement.style.fontSize = '32px';
    textElement.style.fontWeight = 'bold';
    textElement.style.pointerEvents = 'none';
    textElement.style.zIndex = '1000';
    textElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    textElement.style.animation = 'floatUp 1.5s ease-out';
    
    document.body.appendChild(textElement);
    setTimeout(() => textElement.remove(), 1500);
}

// Sonidos simples
function playSound(type) {
    // En un proyecto real, aquí irían sonidos reales
    console.log('🔊 Sound:', type);
}

// Limpiar canvas
function clear() {
    drawBackground();
}

// Dibujar pausa
function drawPauseScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⏸️ PAUSA', canvas.width / 2, canvas.height / 2);
    ctx.font = 'bold 30px Arial';
    ctx.fillText('Toca ⏸️ para continuar', canvas.width / 2, canvas.height / 2 + 60);
    ctx.textAlign = 'left';
}

// Loop principal del juego
function gameLoop() {
    if (!gameRunning) return;
    
    clear();
    drawPlayer();
    drawFallingItems();
    
    if (!gamePaused) {
        update();
        
        // Crear nuevos items
        frameCount++;
        if (frameCount % 50 === 0) {
            createFallingItem();
        }
    } else {
        drawPauseScreen();
    }
    
    requestAnimationFrame(gameLoop);
}

// Actualizar puntuación
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Actualizar vidas
function updateLives() {
    const hearts = '❤️'.repeat(lives);
    document.getElementById('lives').textContent = hearts || '💀';
}

// Terminar juego
function endGame() {
    gameRunning = false;
    document.getElementById('gameArea').classList.add('hidden');
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
    
    // Mensaje según puntuación
    let message = '';
    if (score >= 200) {
        message = '🏆 ¡Excelente! Eres un maestro de la nutrición saludable.';
    } else if (score >= 100) {
        message = '👍 ¡Muy bien! Conoces los alimentos saludables.';
    } else if (score >= 50) {
        message = '😊 ¡Buen intento! Sigue aprendiendo sobre nutrición.';
    } else {
        message = '💪 ¡No te rindas! Practica más para mejorar.';
    }
    document.getElementById('scoreMessage').textContent = message;
}

// Controles del teclado
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' ||
        e.key === 'd' || e.key === 'D' || e.key === 'a' || e.key === 'A') {
        player.dx = 0;
    }
});

// Controles táctiles para móviles
let touchStartX = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning || gamePaused) return;
    e.preventDefault();
    
    const touchX = e.touches[0].clientX;
    const canvasRect = canvas.getBoundingClientRect();
    const relativeX = touchX - canvasRect.left;
    
    player.x = (relativeX / canvasRect.width) * canvas.width - player.width / 2;
});

canvas.addEventListener('touchend', () => {
    player.dx = 0;
});

// Botones de control
if (document.getElementById('btnLeft')) {
    // Botón izquierda
    document.getElementById('btnLeft').addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gamePaused) player.dx = -player.speed;
    });
    
    document.getElementById('btnLeft').addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!gamePaused) player.dx = -player.speed;
    });
    
    document.getElementById('btnLeft').addEventListener('touchend', () => {
        player.dx = 0;
    });
    
    document.getElementById('btnLeft').addEventListener('mouseup', () => {
        player.dx = 0;
    });
    
    // Botón derecha
    document.getElementById('btnRight').addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!gamePaused) player.dx = player.speed;
    });
    
    document.getElementById('btnRight').addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!gamePaused) player.dx = player.speed;
    });
    
    document.getElementById('btnRight').addEventListener('touchend', () => {
        player.dx = 0;
    });
    
    document.getElementById('btnRight').addEventListener('mouseup', () => {
        player.dx = 0;
    });
    
    // Botón pausa
    document.getElementById('btnPause').addEventListener('click', togglePause);
}

// Ajustar canvas al tamaño de la ventana
function resizeCanvas() {
    const container = document.getElementById('gameArea');
    if (container && !container.classList.contains('hidden')) {
        const maxWidth = Math.min(1000, window.innerWidth - 20);
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (maxWidth * 0.7) + 'px';
    }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

// Agregar animación CSS para texto flotante
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
        100% { transform: translateY(-80px) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(style);
