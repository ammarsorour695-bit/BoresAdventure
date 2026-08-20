// Game Constants
const TILE_SIZE = 48;
const MAP_WIDTH = 80;
const MAP_HEIGHT = 50;

// Tile Types
const TILES = {
    GRASS: 0,
    DIRT: 1,
    WATER: 2,
    TREE: 3,
    STONE: 4,
    PATH: 5,
    FLOWER: 6
};

// Animation states
const ANIM_STATES = {
    IDLE: 'idle',
    WALK: 'walk',
    TALK: 'talk'
};

// Game state
const gameState = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    camera: { x: 0, y: 0 },
    keys: {},
    lastTime: 0,
    dialogActive: false,
    currentDialog: '',
    nearNPC: false
};

// Bore - The Main Character
class Bore {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE * 0.8;
        this.height = TILE_SIZE * 0.9;
        this.speed = 5;
        this.direction = 'down';
        this.animState = ANIM_STATES.IDLE;
        this.animFrame = 0;
        this.animTimer = 0;
        this.color = '#4a9eff';
        this.hatColor = '#ff6b6b';
    }

    update(deltaTime) {
        if (gameState.dialogActive) return;

        let moving = false;
        let newX = this.x;
        let newY = this.y;

        if (gameState.keys['ArrowUp'] || gameState.keys['KeyW']) {
            newY -= this.speed;
            this.direction = 'up';
            moving = true;
        }
        if (gameState.keys['ArrowDown'] || gameState.keys['KeyS']) {
            newY += this.speed;
            this.direction = 'down';
            moving = true;
        }
        if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) {
            newX -= this.speed;
            this.direction = 'left';
            moving = true;
        }
        if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) {
            newX += this.speed;
            this.direction = 'right';
            moving = true;
        }

        // Collision detection with map boundaries
        newX = Math.max(0, Math.min(newX, MAP_WIDTH * TILE_SIZE - this.width));
        newY = Math.max(0, Math.min(newY, MAP_HEIGHT * TILE_SIZE - this.height));

        // Check tile collision
        if (!this.checkTileCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }

        // Update animation
        if (moving) {
            this.animState = ANIM_STATES.WALK;
            this.animTimer += deltaTime;
            if (this.animTimer > 150) {
                this.animFrame = (this.animFrame + 1) % 4;
                this.animTimer = 0;
            }
        } else {
            this.animState = ANIM_STATES.IDLE;
            this.animFrame = 0;
        }
    }

    checkTileCollision(x, y) {
        const tiles = [
            this.getTileAt(x, y),
            this.getTileAt(x + this.width, y),
            this.getTileAt(x, y + this.height),
            this.getTileAt(x + this.width, y + this.height)
        ];

        // Collide with water, trees, and stones
        const collidable = [TILES.WATER, TILES.TREE, TILES.STONE];
        return tiles.some(tile => collidable.includes(tile));
    }

    getTileAt(x, y) {
        const tileX = Math.floor(x / TILE_SIZE);
        const tileY = Math.floor(y / TILE_SIZE);
        if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
            return TILES.STONE;
        }
        return gameMap.getTile(tileX, tileY);
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width/2, screenY + this.height - 2, this.width/2, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body bounce animation
        const bounce = this.animState === ANIM_STATES.WALK ? Math.sin(this.animFrame * Math.PI / 2) * 3 : 0;
        
        // Breathing animation when idle
        const breath = this.animState === ANIM_STATES.IDLE ? Math.sin(Date.now() / 300) * 1 : 0;
        
        // Draw body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(screenX - breath, screenY + bounce, this.width + breath * 2, this.height, 10);
        ctx.fill();

        // Draw eyes based on direction
        ctx.fillStyle = '#ffffff';
        let eyeOffsetX = 0;
        let eyeOffsetY = 0;
        
        switch(this.direction) {
            case 'up':
                eyeOffsetY = -2;
                break;
            case 'down':
                eyeOffsetY = 2;
                break;
            case 'left':
                eyeOffsetX = -3;
                break;
            case 'right':
                eyeOffsetX = 3;
                break;
        }

        // Eyes with blink animation
        const blink = Math.sin(Date.now() / 2000) > 0.95 ? 0.2 : 1;
        const eyeSize = 6 * blink;
        ctx.beginPath();
        ctx.arc(screenX + this.width/3 + eyeOffsetX, screenY + this.height/3 + bounce + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.arc(screenX + this.width*2/3 + eyeOffsetX, screenY + this.height/3 + bounce + eyeOffsetY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(screenX + this.width/3 + eyeOffsetX * 1.5, screenY + this.height/3 + bounce + eyeOffsetY * 1.5, 3, 0, Math.PI * 2);
        ctx.arc(screenX + this.width*2/3 + eyeOffsetX * 1.5, screenY + this.height/3 + bounce + eyeOffsetY * 1.5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Hat with slight tilt
        ctx.fillStyle = this.hatColor;
        ctx.save();
        ctx.translate(screenX + this.width/2, screenY + bounce);
        ctx.rotate(Math.sin(Date.now() / 1000) * 0.05);
        ctx.beginPath();
        ctx.moveTo(-this.width/2 - 5, 0);
        ctx.lineTo(this.width/2 + 5, 0);
        ctx.lineTo(0, -15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Hat band
        ctx.fillStyle = '#ffd93d';
        ctx.fillRect(screenX - 3, screenY + 5 + bounce, this.width + 6, 4);

        ctx.restore();
    }

    speak(text) {
        showDialog(text);
    }
}

// NPC Class
class NPC {
    constructor(x, y, name, color, dialog) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE * 0.7;
        this.height = TILE_SIZE * 0.8;
        this.name = name;
        this.color = color;
        this.dialog = dialog;
        this.animFrame = 0;
        this.animTimer = 0;
        this.direction = 'down';
    }

    update(deltaTime) {
        // Idle animation
        this.animTimer += deltaTime;
        if (this.animTimer > 800) {
            this.animFrame = (this.animFrame + 1) % 2;
            this.animTimer = 0;
            
            // Random direction change
            if (Math.random() < 0.3) {
                const dirs = ['up', 'down', 'left', 'right'];
                this.direction = dirs[Math.floor(Math.random() * dirs.length)];
            }
        }
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Don't draw if off screen
        if (screenX < -50 || screenX > gameState.width + 50 || 
            screenY < -50 || screenY > gameState.height + 50) return;

        ctx.save();

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width/2, screenY + this.height - 2, this.width/2, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Idle bob animation
        const bob = this.animFrame * 2 + Math.sin(Date.now() / 400) * 1;

        // Body with breathing
        const breath = Math.sin(Date.now() / 500) * 0.5;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(screenX - breath, screenY + bob, this.width + breath * 2, this.height, 8);
        ctx.fill();

        // Face
        ctx.fillStyle = '#ffffff';
        const eyeY = screenY + this.height/3 + bob;
        
        // Eyes based on direction
        let eyeOffsetX = 0;
        switch(this.direction) {
            case 'left': eyeOffsetX = -2; break;
            case 'right': eyeOffsetX = 2; break;
        }

        // Blink animation
        const blink = Math.sin(Date.now() / 1500 + this.name.length) > 0.9 ? 0.3 : 1;
        ctx.beginPath();
        ctx.arc(screenX + this.width/3 + eyeOffsetX, eyeY, 5 * blink, 0, Math.PI * 2);
        ctx.arc(screenX + this.width*2/3 + eyeOffsetX, eyeY, 5 * blink, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(screenX + this.width/3 + eyeOffsetX * 1.5, eyeY + 1, 2.5, 0, Math.PI * 2);
        ctx.arc(screenX + this.width*2/3 + eyeOffsetX * 1.5, eyeY + 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX + this.width/2, eyeY + 8, 6, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Name tag with gradient background
        const gradient = ctx.createLinearGradient(screenX - 10, screenY - 20 + bob, screenX + this.width + 20, screenY - 20 + bob);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(30, 30, 50, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX - 10, screenY - 20 + bob, this.width + 20, 18);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenX + this.width/2, screenY - 6 + bob);

        ctx.restore();
    }

    interact() {
        showDialog(`${this.name}: ${this.dialog}`);
    }
}

// Map Class
class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.generate();
    }

    generate() {
        // Initialize with grass
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = TILES.GRASS;
            }
        }

        // Add some paths
        this.createPath(10, 5, 30, 5);
        this.createPath(20, 5, 20, 25);

        // Add water features
        this.addWaterPond(35, 8, 8);
        this.addWaterPond(5, 20, 6);

        // Add trees
        for (let i = 0; i < 80; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (this.tiles[y][x] === TILES.GRASS) {
                this.tiles[y][x] = TILES.TREE;
            }
        }

        // Add flowers
        for (let i = 0; i < 50; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (this.tiles[y][x] === TILES.GRASS) {
                this.tiles[y][x] = TILES.FLOWER;
            }
        }

        // Add stone formations
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (this.tiles[y][x] === TILES.GRASS) {
                this.tiles[y][x] = TILES.STONE;
            }
        }
    }

    createPath(x1, y1, x2, y2) {
        const dx = Math.sign(x2 - x1);
        const dy = Math.sign(y2 - y1);
        
        let x = x1;
        let y = y1;
        
        while (x !== x2 || y !== y2) {
            if (x !== x2) x += dx;
            else if (y !== y2) y += dy;
            
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.tiles[y][x] = TILES.PATH;
            }
        }
    }

    addWaterPond(centerX, centerY, radius) {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    if (dist < radius + Math.random() * 2) {
                        this.tiles[y][x] = TILES.WATER;
                    }
                }
            }
        }
    }

    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TILES.STONE;
        }
        return this.tiles[y][x];
    }

    draw(ctx, cameraX, cameraY) {
        const startCol = Math.floor(cameraX / TILE_SIZE);
        const endCol = startCol + (gameState.width / TILE_SIZE) + 1;
        const startRow = Math.floor(cameraY / TILE_SIZE);
        const endRow = startRow + (gameState.height / TILE_SIZE) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                    this.drawTile(ctx, x, y, cameraX, cameraY);
                }
            }
        }
    }

    drawTile(ctx, x, y, cameraX, cameraY) {
        const tile = this.tiles[y][x];
        const screenX = x * TILE_SIZE - cameraX;
        const screenY = y * TILE_SIZE - cameraY;

        switch(tile) {
            case TILES.GRASS:
                ctx.fillStyle = '#2d5a27';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Add grass detail
                ctx.fillStyle = '#3d6a37';
                for (let i = 0; i < 3; i++) {
                    const gx = screenX + Math.random() * TILE_SIZE;
                    const gy = screenY + Math.random() * TILE_SIZE;
                    ctx.fillRect(gx, gy, 2, 4);
                }
                break;
            case TILES.DIRT:
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                break;
            case TILES.WATER:
                ctx.fillStyle = '#4a9eff';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Water shimmer
                ctx.fillStyle = '#6bb6ff';
                const shimmer = Math.sin(Date.now() / 500 + x) * 3;
                ctx.fillRect(screenX + 5, screenY + 10 + shimmer, 8, 3);
                ctx.fillRect(screenX + 20, screenY + 25 - shimmer, 10, 3);
                break;
            case TILES.TREE:
                ctx.fillStyle = '#2d5a27';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Tree trunk
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(screenX + 18, screenY + 25, 12, 23);
                // Tree top
                ctx.fillStyle = '#228b22';
                ctx.beginPath();
                ctx.moveTo(screenX + 24, screenY + 5);
                ctx.lineTo(screenX + 8, screenY + 30);
                ctx.lineTo(screenX + 40, screenY + 30);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(screenX + 24, screenY + 15);
                ctx.lineTo(screenX + 5, screenY + 38);
                ctx.lineTo(screenX + 43, screenY + 38);
                ctx.closePath();
                ctx.fill();
                break;
            case TILES.STONE:
                ctx.fillStyle = '#2d5a27';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Stone
                ctx.fillStyle = '#808080';
                ctx.beginPath();
                ctx.moveTo(screenX + 10, screenY + 35);
                ctx.lineTo(screenX + 20, screenY + 15);
                ctx.lineTo(screenX + 35, screenY + 20);
                ctx.lineTo(screenX + 38, screenY + 35);
                ctx.closePath();
                ctx.fill();
                break;
            case TILES.PATH:
                ctx.fillStyle = '#c4a574';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Path texture
                ctx.fillStyle = '#b49564';
                for (let i = 0; i < 5; i++) {
                    const px = screenX + Math.random() * TILE_SIZE;
                    const py = screenY + Math.random() * TILE_SIZE;
                    ctx.fillRect(px, py, 3, 3);
                }
                break;
            case TILES.FLOWER:
                ctx.fillStyle = '#2d5a27';
                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                // Flower
                const colors = ['#ff6b6b', '#ffd93d', '#ff88cc', '#ffffff'];
                const color = colors[Math.floor((x + y) % colors.length)];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(screenX + 24, screenY + 24, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffd93d';
                ctx.beginPath();
                ctx.arc(screenX + 24, screenY + 24, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }
}

// Dialog System
function showDialog(text) {
    gameState.dialogActive = true;
    gameState.currentDialog = text;
    
    const dialogBox = document.getElementById('dialog-box');
    const dialogText = document.getElementById('dialog-text');
    
    dialogBox.classList.remove('hidden');
    dialogText.textContent = text;
}

function hideDialog() {
    gameState.dialogActive = false;
    const dialogBox = document.getElementById('dialog-box');
    dialogBox.classList.add('hidden');
}

function updateInteractionPrompt() {
    const prompt = document.getElementById('interaction-prompt');
    if (gameState.nearNPC && !gameState.dialogActive) {
        prompt.classList.add('visible');
    } else {
        prompt.classList.remove('visible');
    }
}

// Initialize game
let bore;
let gameMap;
let npcs = [];

function init() {
    gameState.canvas = document.getElementById('gameCanvas');
    gameState.ctx = gameState.canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Input handling
    window.addEventListener('keydown', (e) => {
        gameState.keys[e.code] = true;
        
        // Close dialog on space or enter
        if (gameState.dialogActive && (e.code === 'Space' || e.code === 'Enter')) {
            hideDialog();
        }
        
        // Interact with NPCs
        if (e.code === 'Space' && !gameState.dialogActive) {
            checkNPCInteraction();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        gameState.keys[e.code] = false;
    });
    
    // Create game world
    gameMap = new GameMap(MAP_WIDTH, MAP_HEIGHT);
    
    // Create Bore
    bore = new Bore(15 * TILE_SIZE, 15 * TILE_SIZE);
    
    // Create NPCs
    npcs.push(new NPC(25 * TILE_SIZE, 10 * TILE_SIZE, 'Elder Sage', '#9b59b6', 'Welcome to our village, young adventurer!'));
    npcs.push(new NPC(30 * TILE_SIZE, 20 * TILE_SIZE, 'Merchant Bob', '#2ecc71', 'Got some fine goods today! Want to trade?'));
    npcs.push(new NPC(12 * TILE_SIZE, 8 * TILE_SIZE, 'Guard Luna', '#e74c3c', 'The forest to the north is dangerous. Be careful!'));
    npcs.push(new NPC(40 * TILE_SIZE, 25 * TILE_SIZE, 'Mysterious Stranger', '#34495e', 'Some say there are treasures hidden in these lands...'));
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    gameState.canvas.width = window.innerWidth;
    gameState.canvas.height = window.innerHeight;
    gameState.width = window.innerWidth;
    gameState.height = window.innerHeight;
}

function checkNPCInteraction() {
    const interactRange = TILE_SIZE * 1.5;
    let foundNPC = false;
    
    for (const npc of npcs) {
        const dx = (bore.x + bore.width/2) - (npc.x + npc.width/2);
        const dy = (bore.y + bore.height/2) - (npc.y + npc.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < interactRange) {
            npc.interact();
            foundNPC = true;
            break;
        }
    }
    
    gameState.nearNPC = !foundNPC && isNearAnyNPC(interactRange);
}

function isNearAnyNPC(range) {
    for (const npc of npcs) {
        const dx = (bore.x + bore.width/2) - (npc.x + npc.width/2);
        const dy = (bore.y + bore.height/2) - (npc.y + npc.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < range) {
            return true;
        }
    }
    return false;
}

function updateCamera() {
    // Center camera on Bore
    gameState.camera.x = bore.x - gameState.width / 2 + bore.width / 2;
    gameState.camera.y = bore.y - gameState.height / 2 + bore.height / 2;
    
    // Clamp camera to map bounds
    gameState.camera.x = Math.max(0, Math.min(gameState.camera.x, MAP_WIDTH * TILE_SIZE - gameState.width));
    gameState.camera.y = Math.max(0, Math.min(gameState.camera.y, MAP_HEIGHT * TILE_SIZE - gameState.height));
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - gameState.lastTime;
    gameState.lastTime = timestamp;
    
    // Clear canvas
    gameState.ctx.fillStyle = '#1a1a2e';
    gameState.ctx.fillRect(0, 0, gameState.width, gameState.height);
    
    // Update
    bore.update(deltaTime);
    npcs.forEach(npc => npc.update(deltaTime));
    updateCamera();
    
    // Check for nearby NPCs
    if (!gameState.dialogActive) {
        gameState.nearNPC = isNearAnyNPC(TILE_SIZE * 1.5);
        updateInteractionPrompt();
    }
    
    // Draw
    gameMap.draw(gameState.ctx, gameState.camera.x, gameState.camera.y);
    
    // Sort entities by Y position for proper depth
    const entities = [...npcs, bore].sort((a, b) => a.y - b.y);
    entities.forEach(entity => entity.draw(gameState.ctx, gameState.camera.x, gameState.camera.y));
    
    requestAnimationFrame(gameLoop);
}

// Polyfill for roundRect if not supported
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        return this;
    };
}

// Start game when page loads
window.addEventListener('load', init);
