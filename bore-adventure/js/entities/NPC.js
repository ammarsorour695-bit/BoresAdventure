/**
 * NPC - Phase 1 & 8
 * Non-player characters with dialogue and interactions
 */

import { Entity } from './Entity.js';
import { Animation } from '../rendering/Animation.js';
import { DIRECTION, CONFIG } from '../core/constants.js';

export class NPC extends Entity {
    constructor(options = {}) {
        super({
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || CONFIG.PLAYER_WIDTH,
            height: options.height || CONFIG.PLAYER_HEIGHT,
            name: options.name || 'Villager',
            direction: options.direction || DIRECTION.DOWN,
            interactable: true
        });
        
        // NPC-specific properties
        this.dialogue = options.dialogue || [];
        this.quest = options.quest || null;
        this.tileId = options.tileId || 1;
        
        // Movement pattern (optional)
        this.movementPattern = options.movementPattern || null;
        this.moveTimer = 0;
        this.moveInterval = options.moveInterval || 2000;
        
        // Setup basic animations
        this.setupAnimations();
        
        // Start with idle animation
        this.playAnimation('idle_down');
    }

    /**
     * Setup NPC animations
     */
    setupAnimations() {
        // Simple idle animations for NPCs
        this.addAnimation('idle_down', new Animation('idle_down', [this.tileId], 300, true));
        this.addAnimation('idle_up', new Animation('idle_up', [this.tileId], 300, true));
        this.addAnimation('idle_left', new Animation('idle_left', [this.tileId], 300, true));
        this.addAnimation('idle_right', new Animation('idle_right', [this.tileId], 300, true));
        
        // Walking animations (if NPC moves)
        this.addAnimation('walk_down', new Animation('walk_down', [this.tileId, this.tileId + 1, this.tileId], 200, true));
        this.addAnimation('walk_up', new Animation('walk_up', [this.tileId, this.tileId + 1, this.tileId], 200, true));
        this.addAnimation('walk_left', new Animation('walk_left', [this.tileId, this.tileId + 1, this.tileId], 200, true));
        this.addAnimation('walk_right', new Animation('walk_right', [this.tileId, this.tileId + 1, this.tileId], 200, true));
    }

    /**
     * Update NPC
     * @param {number} dt - Delta time in milliseconds
     * @param {import('../core/Input.js').InputHandler} input 
     * @param {{width: number, height: number}} worldBounds 
     */
    update(dt, input, worldBounds) {
        // Update animations
        super.update(dt);
        
        // Handle optional movement pattern
        if (this.movementPattern && !this.isMoving) {
            this.moveTimer += dt;
            
            if (this.moveTimer >= this.moveInterval) {
                this.moveTimer = 0;
                this.executeMovementPattern(worldBounds);
            }
        }
    }

    /**
     * Execute a movement pattern
     * @param {{width: number, height: number}} worldBounds 
     */
    executeMovementPattern(worldBounds) {
        const patterns = ['up', 'down', 'left', 'right', 'idle'];
        const pattern = this.movementPattern[Math.floor(Math.random() * this.movementPattern.length)];
        
        if (pattern === 'idle') {
            this.playAnimation(`idle_${this.direction}`);
            return;
        }
        
        const speed = 30; // Slow walking speed for NPCs
        let newX = this.x;
        let newY = this.y;
        
        switch (pattern) {
            case 'up':
                this.direction = DIRECTION.UP;
                newY -= speed * 2;
                break;
            case 'down':
                this.direction = DIRECTION.DOWN;
                newY += speed * 2;
                break;
            case 'left':
                this.direction = DIRECTION.LEFT;
                newX -= speed * 2;
                break;
            case 'right':
                this.direction = DIRECTION.RIGHT;
                newX += speed * 2;
                break;
        }
        
        // Check bounds
        if (newX >= 0 && newX <= worldBounds.width - this.width &&
            newY >= 0 && newY <= worldBounds.height - this.height) {
            this.x = newX;
            this.y = newY;
            this.playAnimation(`walk_${this.direction}`);
            
            // Stop after a short walk
            setTimeout(() => {
                this.playAnimation(`idle_${this.direction}`);
            }, 500);
        }
    }

    /**
     * Get dialogue lines
     * @returns {string[]}
     */
    getDialogue() {
        return this.dialogue;
    }

    /**
     * Add dialogue line
     * @param {string} line 
     */
    addDialogue(line) {
        this.dialogue.push(line);
    }

    /**
     * Get interaction prompt
     * @returns {string}
     */
    getInteractionPrompt() {
        return 'Talk';
    }

    /**
     * Check if NPC has a quest
     * @returns {boolean}
     */
    hasQuest() {
        return this.quest !== null;
    }

    /**
     * Get quest data
     * @returns {Object|null}
     */
    getQuest() {
        return this.quest;
    }
}
