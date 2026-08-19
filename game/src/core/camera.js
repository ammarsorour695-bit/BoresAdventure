import { CONSTANTS, GAME_STATE } from './constants.js';

/**
 * Camera - Handles view following and screen shake effects
 */
export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.target = null;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.smoothing = 0.1;
        this.bounds = {
            minX: 0,
            minY: 0,
            maxX: Infinity,
            maxY: Infinity
        };
    }

    /**
     * Set the target to follow
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * Set camera bounds
     */
    setBounds(minX, minY, maxX, maxY) {
        this.bounds.minX = minX;
        this.bounds.minY = minY;
        this.bounds.maxX = maxX;
        this.bounds.maxY = maxY;
    }

    /**
     * Update camera position
     */
    update(deltaTime) {
        if (this.target) {
            // Smooth follow
            const targetX = this.target.x - this.width / 2 + this.target.width / 2;
            const targetY = this.target.y - this.height / 2 + this.target.height / 2;

            this.x += (targetX - this.x) * this.smoothing;
            this.y += (targetY - this.y) * this.smoothing;
        }

        // Apply bounds
        this.x = Math.max(this.bounds.minX, Math.min(this.x, this.bounds.maxX - this.width));
        this.y = Math.max(this.bounds.minY, Math.min(this.y, this.bounds.maxY - this.height));

        // Apply shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
            if (this.shakeDuration <= 0) {
                this.shakeIntensity = 0;
            }
        }
    }

    /**
     * Get the current camera offset with shake applied
     */
    getOffset() {
        let shakeX = 0;
        let shakeY = 0;

        if (this.shakeDuration > 0) {
            shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
            shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
        }

        return {
            x: this.x + shakeX,
            y: this.y + shakeY
        };
    }

    /**
     * Trigger a screen shake effect
     */
    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    /**
     * Check if a point is visible on screen
     */
    isVisible(x, y, width = 0, height = 0) {
        const offset = this.getOffset();
        return !(x + width < offset.x ||
                 x > offset.x + this.width ||
                 y + height < offset.y ||
                 y > offset.y + this.height);
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        const offset = this.getOffset();
        return {
            x: screenX + offset.x,
            y: screenY + offset.y
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        const offset = this.getOffset();
        return {
            x: worldX - offset.x,
            y: worldY - offset.y
        };
    }
}
