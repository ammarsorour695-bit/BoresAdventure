/**
 * Main Game Class
 * Orchestrates all game systems
 */
import { InputHandler } from './Input.js';
import { Camera } from './Camera.js';
import { Player } from '../entities/Player.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { InteractionSystem } from '../systems/InteractionSystem.js';
import { DialogueUI } from '../ui/DialogueUI.js';
import { CityMap } from '../world/CityMap.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game dimensions
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Systems
        this.input = new InputHandler();
        this.collisionSystem = new CollisionSystem();
        this.interactionSystem = new InteractionSystem();
        this.dialogueUI = new DialogueUI();
        
        // World
        this.world = new CityMap();
        this.collisionSystem.setMap(this.world);
        
        // Camera
        this.camera = new Camera(this.width, this.height, this.world.width, this.world.height);
        
        // Player
        this.player = new Player(150, 150);
        
        // Game State
        this.lastTime = 0;
        this.isPlaying = false;
        this.isPaused = false;
        
        // Bind methods
        this.loop = this.loop.bind(this);
        
        // Setup
        this.setupInputs();
        this.showStartScreen();
    }

    setupInputs() {
        console.log('Setting up input handlers...');
        
        window.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;

            // Handle dialogue advancement
            if ((e.code === 'Space' || e.code === 'Enter') && this.dialogueUI.isActive) {
                e.preventDefault();
                this.dialogueUI.advance();
                return;
            }

            // Handle interaction
            if (e.code === 'KeyE' && !this.dialogueUI.isActive) {
                const interaction = this.interactionSystem.interact();
                if (interaction) {
                    this.dialogueUI.startDialogue(
                        interaction.speaker,
                        interaction.lines,
                        interaction.quest,
                        interaction.onComplete
                    );
                }
            }
        });

        // Start button - attach listener immediately
        const startBtn = document.getElementById('start-btn');
        console.log('Start button element:', startBtn);
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                console.log('Start button clicked!');
                this.start();
            });
            
            // Also add touch support for mobile
            startBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('Start button touched!');
                this.start();
            });
        } else {
            console.error('ERROR: Start button not found!');
        }
    }

    showStartScreen() {
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.display = 'flex';
        }
    }

    hideStartScreen() {
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.style.display = 'none';
        }
    }

    start() {
        this.hideStartScreen();
        this.isPlaying = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    update(dt) {
        if (this.dialogueUI.isActive) {
            return; // Pause game during dialogue
        }

        // Update player
        this.player.update(
            dt / 1000, // Convert to seconds
            this.input,
            { width: this.world.width, height: this.world.height },
            this.collisionSystem
        );

        // Update camera to follow player
        this.camera.follow(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2
        );

        // Update NPCs
        for (const npc of this.world.npcs) {
            npc.update(
                dt / 1000,
                { width: this.world.width, height: this.world.height },
                this.player,
                this.collisionSystem
            );
        }

        // Update interaction system
        this.interactionSystem.update(this.player, this.world.npcs, this.world.objects);

        // Clear transient input states
        this.input.clearTransientStates();
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Save context for camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Draw world
        this.world.draw(this.ctx, this.camera.x, this.camera.y);

        // Sort entities by Y position for depth
        const entities = [this.player, ...this.world.npcs];
        entities.sort((a, b) => (a.y + a.height) - (b.y + b.height));

        // Draw all entities
        for (const entity of entities) {
            entity.draw(this.ctx);
        }

        // Restore context
        this.ctx.restore();

        // Draw interaction prompt (in screen space)
        this.drawInteractionPrompt();
    }

    drawInteractionPrompt() {
        const prompt = this.interactionSystem.getPrompt();
        if (prompt && !this.dialogueUI.isActive) {
            const screenPos = this.camera.worldToScreen(prompt.x, prompt.y);
            
            this.ctx.save();
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Courier New';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'center';
            
            this.ctx.strokeText(prompt.text, screenPos.x, screenPos.y);
            this.ctx.fillText(prompt.text, screenPos.x, screenPos.y);
            
            this.ctx.restore();
        }
    }

    loop(timestamp) {
        if (!this.isPlaying) return;

        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop);
    }
}
