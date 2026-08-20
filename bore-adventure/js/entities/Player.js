/**
 * Player Entity - Bore, the main character
 */
export default class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24; // Slightly taller than wide for character proportion
        this.speed = 100; // Pixels per second
        this.direction = 'down';
        this.isMoving = false;
        this.animationTimer = 0;
        this.animationFrame = 0;
    }

    update(dt, input, tilemap) {
        const direction = input.getMovementDirection();
        this.isMoving = direction.x !== 0 || direction.y !== 0;
        
        if (this.isMoving) {
            // Update direction based on movement
            if (Math.abs(direction.x) > Math.abs(direction.y)) {
                this.direction = direction.x > 0 ? 'right' : 'left';
            } else {
                this.direction = direction.y > 0 ? 'down' : 'up';
            }
            
            // Calculate new position
            const newX = this.x + direction.x * this.speed * dt;
            const newY = this.y + direction.y * this.speed * dt;
            
            // Check collision before moving
            let canMoveX = true;
            let canMoveY = true;
            
            // Check horizontal collision
            if (direction.x !== 0) {
                const checkX = direction.x > 0 ? newX + this.width : newX;
                const checkY1 = this.y;
                const checkY2 = this.y + this.height - 1;
                
                if (tilemap.isSolid(checkX, checkY1) || tilemap.isSolid(checkX, checkY2)) {
                    canMoveX = false;
                }
            }
            
            // Check vertical collision
            if (direction.y !== 0) {
                const checkY = direction.y > 0 ? newY + this.height : newY;
                const checkX1 = this.x;
                const checkX2 = this.x + this.width - 1;
                
                if (tilemap.isSolid(checkX1, checkY) || tilemap.isSolid(checkX2, checkY)) {
                    canMoveY = false;
                }
            }
            
            // Apply movement if not colliding
            if (canMoveX) {
                this.x = newX;
            }
            if (canMoveY) {
                this.y = newY;
            }
            
            // Update animation
            this.animationTimer += dt;
            if (this.animationTimer > 0.15) { // Switch frames every 150ms
                this.animationFrame = (this.animationFrame + 1) % 2;
                this.animationTimer = 0;
            }
        } else {
            this.animationFrame = 0;
        }
    }

    render(ctx, camera, assetManager) {
        // For now, render as a colored rectangle
        // We'll replace this with actual sprite rendering later
        const screenX = Math.floor(this.x - camera.x);
        const screenY = Math.floor(this.y - camera.y);
        
        // Draw Bore's body (blue shirt)
        ctx.fillStyle = '#3498db';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw head
        ctx.fillStyle = '#f5d0a9'; // Skin tone
        ctx.fillRect(screenX + 2, screenY - 4, 12, 10);
        
        // Draw eyes based on direction
        ctx.fillStyle = '#000';
        let eyeOffsetX = 0;
        let eyeOffsetY = 0;
        
        if (this.direction === 'left') eyeOffsetX = -2;
        if (this.direction === 'right') eyeOffsetX = 2;
        if (this.direction === 'up') eyeOffsetY = -2;
        if (this.direction === 'down') eyeOffsetY = 2;
        
        ctx.fillRect(screenX + 4 + eyeOffsetX, screenY - 2 + eyeOffsetY, 2, 2);
        ctx.fillRect(screenX + 10 + eyeOffsetX, screenY - 2 + eyeOffsetY, 2, 2);
        
        // Simple walking animation bob
        if (this.isMoving && this.animationFrame === 1) {
            // Slight bounce when walking
        }
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
