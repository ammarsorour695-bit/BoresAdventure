/**
 * Camera - Follows the player and handles viewport scrolling
 */
export default class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.smoothness = 0.1; // For smooth following (0 = instant, 1 = no movement)
    }

    follow(target, mapWidth, mapHeight) {
        // Target position: center the camera on the target
        const targetX = target.x + target.width / 2 - this.width / 2;
        const targetY = target.y + target.height / 2 - this.height / 2;
        
        // Smooth interpolation
        this.x += (targetX - this.x) * this.smoothness;
        this.y += (targetY - this.y) * this.smoothness;
        
        // Clamp to map bounds
        this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    isVisible(entityX, entityY, entityWidth, entityHeight) {
        // Simple AABB check to see if entity is in camera view
        return (
            entityX < this.x + this.width &&
            entityX + entityWidth > this.x &&
            entityY < this.y + this.height &&
            entityY + entityHeight > this.y
        );
    }
}
