/**
 * Player (Bore) - Phase 1 & 3
 * The main player character with movement and animations
 */

import { Entity } from './Entity.js';
import { Animation, AnimationController } from '../rendering/Animation.js';
import { DIRECTION, CONFIG } from '../core/constants.js';
import { inputHandler } from '../core/Input.js';
import { assetManager } from '../core/AssetManager.js';

export class Player extends Entity {
    constructor(x, y) {
        super({
            x,
            y,
            width: CONFIG.PLAYER_WIDTH,
            height: CONFIG.PLAYER_HEIGHT,
            speed: CONFIG.PLAYER_SPEED,
            name: 'Bore',
            direction: DIRECTION.DOWN
        });
        
        // Setup animations using available tile assets
        this.setupAnimations();
        
        // Start with idle animation
        this.playAnimation('idle_down');
    }

    /**
     * Setup player animations using Kenney assets
     * Using character tiles for different directions and states
     */
    setupAnimations() {
        // For Phase 1, we'll use simple tile-based animations
        // The actual character sprites will be defined based on available assets
        
        // Find character-related tiles (typically in certain ID ranges)
        // Using placeholder animation frames - these will be updated when we identify the exact character tiles
        
        // Idle animations (single frame or subtle animation)
        const idleFrames = [1]; // Placeholder - will use actual character tile
        
        // Walk animations (multiple frames)
        const walkFrames = [1, 2, 3, 4]; // Placeholder - will use actual walking frames
        
        // Create directional animations
        // Down direction
        this.addAnimation('idle_down', new Animation('idle_down', [1], 200, true));
        this.addAnimation('walk_down', new Animation('walk_down', [1, 2, 1, 3], 150, true));
        
        // Up direction
        this.addAnimation('idle_up', new Animation('idle_up', [1], 200, true));
        this.addAnimation('walk_up', new Animation('walk_up', [1, 2, 1, 3], 150, true));
        
        // Left direction
        this.addAnimation('idle_left', new Animation('idle_left', [1], 200, true));
        this.addAnimation('walk_left', new Animation('walk_left', [1, 2, 1, 3], 150, true));
        
        // Right direction
        this.addAnimation('idle_right', new Animation('idle_right', [1], 200, true));
        this.addAnimation('walk_right', new Animation('walk_right', [1, 2, 1, 3], 150, true));
        
        // Note: We'll update these frame numbers once we identify the actual character sprite tiles
    }

    /**
     * Update player based on input
     * @param {number} dt - Delta time in milliseconds
     * @param {import('../core/Input.js').InputHandler} input 
     * @param {{width: number, height: number}} worldBounds 
     */
    update(dt, input, worldBounds) {
        const dir = input.getMovementDirection();
        
        this.isMoving = dir.x !== 0 || dir.y !== 0;
        this.vx = dir.x * this.speed;
        this.vy = dir.y * this.speed;
        
        if (this.isMoving) {
            // Determine direction based on movement
            if (Math.abs(dir.x) > Math.abs(dir.y)) {
                // Horizontal movement
                if (dir.x > 0) {
                    this.direction = DIRECTION.RIGHT;
                    this.playAnimation('walk_right');
                } else {
                    this.direction = DIRECTION.LEFT;
                    this.playAnimation('walk_left');
                }
            } else {
                // Vertical movement
                if (dir.y > 0) {
                    this.direction = DIRECTION.DOWN;
                    this.playAnimation('walk_down');
                } else {
                    this.direction = DIRECTION.UP;
                    this.playAnimation('walk_up');
                }
            }
            
            // Apply movement
            const seconds = dt / 1000;
            const newX = this.x + this.vx * seconds;
            const newY = this.y + this.vy * seconds;
            
            // Clamp to world bounds
            this.x = Math.max(0, Math.min(newX, worldBounds.width - this.width));
            this.y = Math.max(0, Math.min(newY, worldBounds.height - this.height));
        } else {
            // Play idle animation based on current direction
            this.playAnimation(`idle_${this.direction}`);
        }
        
        // Update sprite (for animations)
        super.update(dt);
    }

    /**
     * Get interaction prompt for player
     * @returns {string}
     */
    getInteractionPrompt() {
        return 'Talk';
    }
}
