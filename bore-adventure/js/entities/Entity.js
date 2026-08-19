/**
 * Entity - Phase 1
 * Base entity class for all game objects
 */

import { Sprite } from '../rendering/Sprite.js';
import { DIRECTION, CONFIG } from '../core/constants.js';

export class Entity extends Sprite {
    constructor(options = {}) {
        super(options);
        
        // Movement
        this.vx = 0;
        this.vy = 0;
        this.speed = options.speed || CONFIG.PLAYER_SPEED;
        this.isMoving = false;
        
        // State
        this.name = options.name || 'Entity';
        this.solid = options.solid || false;
        this.interactable = options.interactable || false;
        
        // Interaction callback
        this.onInteract = options.onInteract || null;
    }

    /**
     * Update entity state
     * @param {number} dt - Delta time in milliseconds
     * @param {import('../core/Input.js').InputHandler} input 
     * @param {{width: number, height: number}} worldBounds 
     */
    update(dt, input, worldBounds) {
        // Override in subclasses
        this.isMoving = false;
        this.vx = 0;
        this.vy = 0;
        
        // Update sprite animations
        super.update(dt);
    }

    /**
     * Move entity with collision checking
     * @param {number} newX 
     * @param {number} newY 
     * @param {Function} collisionCheck - Function to check if position is valid
     * @returns {{x: number, y: number}} - Actual position after collision
     */
    moveWithCollision(newX, newY, collisionCheck) {
        let finalX = newX;
        let finalY = newY;
        
        // Check X movement
        if (collisionCheck && collisionCheck(newX, this.y)) {
            finalX = this.x;
        }
        
        // Check Y movement
        if (collisionCheck && collisionCheck(finalX, newY)) {
            finalY = this.y;
        }
        
        return { x: finalX, y: finalY };
    }

    /**
     * Check if another entity is in interaction range
     * @param {Entity} other 
     * @param {number} range 
     * @returns {boolean}
     */
    isInInteractionRange(other, range = CONFIG.INTERACTION_RANGE) {
        const myCenter = this.getCenter();
        const otherCenter = other.getCenter();
        
        const dx = myCenter.x - otherCenter.x;
        const dy = myCenter.y - otherCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < range;
    }

    /**
     * Handle interaction
     * @returns {any} - Result of interaction
     */
    interact() {
        if (this.onInteract) {
            return this.onInteract(this);
        }
        return null;
    }

    /**
     * Get interaction prompt text
     * @returns {string}
     */
    getInteractionPrompt() {
        return 'Interact';
    }
}
