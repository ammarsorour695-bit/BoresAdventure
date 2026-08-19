/**
 * Main Game Class - Phase 1
 * Orchestrates all game systems
 */

import { CONFIG, GAME_STATE } from './core/constants.js';
import { GameLoop } from './core/GameLoop.js';
import { inputHandler } from './core/Input.js';
import { Camera } from './core/Camera.js';
import { assetManager } from './core/AssetManager.js';
import { World } from './world/World.js';
import { dialogueSystem } from './systems/DialogueSystem.js';
import { InteractionSystem } from './systems/InteractionSystem.js';

export class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Game state
        this.state = GAME_STATE.LOADING;
        this.world = null;
        this.camera = null;
        this.interactionSystem = null;
        
        // Systems
        this.gameLoop = new GameLoop();
        
        // UI Elements
        this.startScreen = document.getElementById('start-screen');
        this.questLog = document.getElementById('quest-log');
        this.debugInfo = document.getElementById('debug-info');
        this.fpsCounter = document.getElementById('fps-counter');
        this.playerPosEl = document.getElementById('player-pos');
        
        // Bind methods
        this.setupInputs = this.setupInputs.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.start = this.start.bind(this);
        
        // Setup
        this.setupInputs();
        this.setupStartButton();
    }

    /**
     * Setup input handlers
     */
    setupInputs() {
        // Handle interaction key
        window.addEventListener('keydown', (e) => {
            if (e.code === 'KeyE' && !dialogueSystem.isDialogueActive()) {
                this.tryInteract();
            }
            
            if ((e.code === 'Space' || e.code === 'Enter') && dialogueSystem.isDialogueActive()) {
                dialogueSystem.advance();
            }
        });
    }

    /**
     * Setup start button
     */
    setupStartButton() {
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', () => {
            this.start();
        });
    }

    /**
     * Initialize and start the game
     */
    async start() {
        // Hide start screen
        this.startScreen.classList.add('hidden');
        
        // Load assets
        await this.loadAssets();
        
        // Create world
        this.world = new World();
        
        // Setup camera
        this.camera = new Camera(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        this.camera.setTarget(this.world.getPlayer());
        this.camera.setWorldBounds(this.world.width, this.world.height);
        
        // Setup interaction system
        this.interactionSystem = new InteractionSystem(this.world);
        
        // Setup game loop callbacks
        this.gameLoop.onUpdate = this.update;
        this.gameLoop.onRender = this.render;
        
        // Start loop
        this.state = GAME_STATE.PLAYING;
        this.gameLoop.start();
        
        console.log('Game started!');
    }

    /**
     * Load all game assets
     */
    async loadAssets() {
        console.log('Loading assets...');
        
        // Register tile assets (tile_0000.png through tile_0485.png)
        for (let i = 0; i <= 485; i++) {
            const paddedId = String(i).padStart(4, '0');
            assetManager.addImage(`tile_${paddedId}`, `assets/tile_${paddedId}.png`);
        }
        
        // Show loading progress
        assetManager.onProgress = (loaded, total) => {
            console.log(`Loading: ${loaded}/${total}`);
        };
        
        // Wait for all assets to load
        await assetManager.loadAll();
        
        console.log('Assets loaded!');
    }

    /**
     * Try to interact with nearby entity
     */
    tryInteract() {
        if (!this.world || !this.world.getPlayer()) return;
        
        const player = this.world.getPlayer();
        this.interactionSystem.tryInteract(player);
    }

    /**
     * Update game state
     * @param {number} dt - Delta time in milliseconds
     */
    update(dt) {
        if (this.state !== GAME_STATE.PLAYING) return;
        
        // Don't update player movement during dialogue
        if (!dialogueSystem.isDialogueActive()) {
            this.world.update(dt, inputHandler);
        } else {
            // Still update animations during dialogue
            const player = this.world.getPlayer();
            if (player) {
                player.update(dt, { getMovementDirection: () => ({ x: 0, y: 0 }) }, { width: this.world.width, height: this.world.height });
            }
        }
        
        // Update camera
        this.camera.update(dt);
        
        // Update interaction system
        if (!dialogueSystem.isDialogueActive()) {
            this.interactionSystem.update(this.world.getPlayer());
        }
        
        // Clear transient input states
        inputHandler.clearTransientStates();
        
        // Update debug info
        this.updateDebugInfo();
    }

    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.world) {
            // Render world through camera
            this.world.render(
                this.ctx,
                this.camera.x,
                this.camera.y,
                this.canvas.width,
                this.canvas.height
            );
        }
        
        // Render interaction prompt
        this.renderInteractionPrompt();
    }

    /**
     * Render interaction prompt
     */
    renderInteractionPrompt() {
        if (!this.interactionSystem || !this.interactionSystem.hasNearbyInteractable()) {
            return;
        }
        
        const prompt = this.interactionSystem.getPromptText();
        const npc = this.interactionSystem.getNearbyInteractable();
        
        if (npc) {
            // Draw prompt above NPC
            const screenX = npc.x + npc.width / 2 - this.camera.x;
            const screenY = npc.y - 20 - this.camera.y;
            
            this.ctx.save();
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(prompt, screenX, screenY);
            this.ctx.fillText(prompt, screenX, screenY);
            this.ctx.restore();
        }
    }

    /**
     * Update debug information
     */
    updateDebugInfo() {
        if (!CONFIG.DEBUG_MODE) return;
        
        this.debugInfo.classList.remove('hidden');
        this.fpsCounter.textContent = this.gameLoop.getFPS();
        
        if (this.world && this.world.getPlayer()) {
            const player = this.world.getPlayer();
            this.playerPosEl.textContent = `${Math.floor(player.x)}, ${Math.floor(player.y)}`;
        }
    }
}

// Create and export game instance
export const game = new Game();
