/**
 * Camera System
 * Follows the player and handles viewport transformation
 */
export class Camera {
    constructor(width, height, worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.smoothness = 0.1; // 0 = instant, 1 = no movement
        this.targetX = 0;
        this.targetY = 0;
    }

    follow(targetX, targetY) {
        // Center camera on target
        this.targetX = targetX - this.width / 2;
        this.targetY = targetY - this.height / 2;
        
        // Smooth camera movement
        this.x += (this.targetX - this.x) * this.smoothness;
        this.y += (this.targetY - this.y) * this.smoothness;
        
        // Clamp to world bounds
        this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    isVisible(x, y, width, height) {
        return x < this.x + this.width &&
               x + width > this.x &&
               y < this.y + this.height &&
               y + height > this.y;
    }
}
