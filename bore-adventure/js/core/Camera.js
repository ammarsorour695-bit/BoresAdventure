/**
 * Camera - Phase 1
 * Handles viewport and camera following
 */

export class Camera {
    constructor(canvasWidth, canvasHeight) {
        this.x = 0;
        this.y = 0;
        this.width = canvasWidth;
        this.height = canvasHeight;
        
        // Target to follow
        this.target = null;
        
        // World bounds
        this.worldWidth = 0;
        this.worldHeight = 0;
        
        // Smooth follow
        this.smoothness = 0.1;
        this.useSmoothFollow = false;
    }

    /**
     * Set the target entity to follow
     * @param {Object} target - Entity with x, y properties
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * Set world bounds for camera clamping
     * @param {number} width 
     * @param {number} height 
     */
    setWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }

    /**
     * Update camera position
     * @param {number} dt - Delta time in milliseconds
     */
    update(dt) {
        if (!this.target) return;

        let targetX, targetY;

        if (this.useSmoothFollow) {
            // Smooth interpolation
            const idealX = this.target.x + this.target.width / 2 - this.width / 2;
            const idealY = this.target.y + this.target.height / 2 - this.height / 2;
            
            this.x += (idealX - this.x) * this.smoothness;
            this.y += (idealY - this.y) * this.smoothness;
        } else {
            // Direct follow (centered on target)
            targetX = this.target.x + this.target.width / 2 - this.width / 2;
            targetY = this.target.y + this.target.height / 2 - this.height / 2;
            
            this.x = targetX;
            this.y = targetY;
        }

        // Clamp to world bounds
        this.clamp();
    }

    /**
     * Clamp camera to world bounds
     */
    clamp() {
        if (this.worldWidth > 0) {
            this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
        }
        if (this.worldHeight > 0) {
            this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));
        }
    }

    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX 
     * @param {number} worldY 
     * @returns {{x: number, y: number}}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX 
     * @param {number} screenY 
     * @returns {{x: number, y: number}}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Check if a world rectangle is visible in the camera
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @returns {boolean}
     */
    isVisible(x, y, width, height) {
        return !(
            x + width < this.x ||
            x > this.x + this.width ||
            y + height < this.y ||
            y > this.y + this.height
        );
    }

    /**
     * Get the visible world bounds
     * @returns {{left: number, right: number, top: number, bottom: number}}
     */
    getVisibleBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}
