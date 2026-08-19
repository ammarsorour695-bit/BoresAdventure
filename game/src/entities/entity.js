import { CONSTANTS, DIRECTION } from './constants.js';

/**
 * Entity - Base class for all game entities (player, NPCs, objects)
 */
export class Entity {
    constructor(x, y, width = 16, height = 16) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONSTANTS.PLAYER_SPEED;
        this.direction = DIRECTION.DOWN;
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.visible = true;
    }

    /**
     * Update entity state
     */
    update(deltaTime, input, map) {
        // Override in subclasses
    }

    /**
     * Render the entity
     */
    render(ctx, cameraX, cameraY) {
        if (!this.visible) return;

        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        // Simple placeholder rendering - will be overridden
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(screenX, screenY, this.width, this.height);
    }

    /**
     * Get the bounding box for collision detection
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    /**
     * Check collision with another entity
     */
    collidesWith(other) {
        const a = this.getBounds();
        const b = other.getBounds();

        return !(a.right <= b.left || 
                 a.left >= b.right || 
                 a.bottom <= b.top || 
                 a.top >= b.bottom);
    }

    /**
     * Update animation frame
     */
    updateAnimation(deltaTime) {
        if (this.isMoving) {
            this.animationTimer += deltaTime;
            if (this.animationTimer > 150) {
                this.animationFrame = (this.animationFrame + 1) % 4;
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0;
        }
    }
}
