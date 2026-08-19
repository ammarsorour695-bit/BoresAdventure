/**
 * Player Class - Bore
 * Main character controller with movement and animation
 */
import { Entity } from './Entity.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 48, '#3498db', 200); // speed in pixels per second
        this.name = "Bore";
        this.direction = 'down';
        this.state = 'idle'; // idle, walk
        this.frameTimer = 0;
        this.frameIndex = 0;
    }

    update(dt, input, worldBounds, collisionSystem) {
        const oldX = this.x;
        const oldY = this.y;
        
        this.vx = 0;
        this.vy = 0;
        let moving = false;

        // Get input
        if (input.isDown('ArrowUp') || input.isDown('KeyW')) {
            this.vy = -this.speed;
            this.direction = 'up';
            moving = true;
        } else if (input.isDown('ArrowDown') || input.isDown('KeyS')) {
            this.vy = this.speed;
            this.direction = 'down';
            moving = true;
        }
        
        if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
            this.vx = -this.speed;
            this.direction = 'left';
            moving = true;
        } else if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
            this.vx = this.speed;
            this.direction = 'right';
            moving = true;
        }

        // Normalize diagonal movement
        if (this.vx !== 0 && this.vy !== 0) {
            const factor = 1 / Math.sqrt(2);
            this.vx *= factor;
            this.vy *= factor;
        }

        // Apply movement with collision check
        if (moving) {
            this.x += this.vx * dt;
            if (collisionSystem.checkCollision(this.x, this.y, this.width, this.height, worldBounds)) {
                this.x = oldX;
            }
            
            this.y += this.vy * dt;
            if (collisionSystem.checkCollision(this.x, this.y, this.width, this.height, worldBounds)) {
                this.y = oldY;
            }
            
            this.state = 'walk';
        } else {
            this.state = 'idle';
        }

        // Update animation
        this.updateAnimation(dt);
    }

    updateAnimation(dt) {
        if (this.state === 'walk') {
            this.frameTimer += dt;
            if (this.frameTimer > 150) { // Change frame every 150ms
                this.frameIndex = (this.frameIndex + 1) % 2;
                this.frameTimer = 0;
            }
        } else {
            this.frameIndex = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Draw body with animation bounce
        let bounce = 0;
        if (this.state === 'walk' && this.frameIndex === 1) {
            bounce = -2;
        }
        
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 4, this.y + 10 + bounce, 24, 28);
        
        // Head
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(this.x + 6, this.y + 2 + bounce, 20, 18);
        
        // Eyes based on direction
        ctx.fillStyle = 'black';
        if (this.direction === 'down' || this.direction === 'up') {
            ctx.fillRect(this.x + 10, this.y + 8 + bounce, 2, 2);
            ctx.fillRect(this.x + 20, this.y + 8 + bounce, 2, 2);
        } else if (this.direction === 'left') {
            ctx.fillRect(this.x + 8, this.y + 8 + bounce, 2, 2);
        } else if (this.direction === 'right') {
            ctx.fillRect(this.x + 20, this.y + 8 + bounce, 2, 2);
        }
        
        // Legs animation
        ctx.fillStyle = '#333';
        if (this.state === 'walk' && this.frameIndex === 0) {
            ctx.fillRect(this.x + 6, this.y + 38, 8, 10);
            ctx.fillRect(this.x + 18, this.y + 38, 8, 10);
        } else if (this.state === 'walk' && this.frameIndex === 1) {
            ctx.fillRect(this.x + 6, this.y + 36, 8, 12);
            ctx.fillRect(this.x + 18, this.y + 40, 8, 8);
        } else {
            ctx.fillRect(this.x + 6, this.y + 38, 8, 10);
            ctx.fillRect(this.x + 18, this.y + 38, 8, 10);
        }
        
        ctx.restore();
    }

    getInteractionPoint() {
        // Return the point in front of the player for interaction checks
        const offset = 40;
        switch(this.direction) {
            case 'up': return { x: this.x + 16, y: this.y - offset };
            case 'down': return { x: this.x + 16, y: this.y + 48 + offset };
            case 'left': return { x: this.x - offset, y: this.y + 24 };
            case 'right': return { x: this.x + 32 + offset, y: this.y + 24 };
            default: return { x: this.x + 16, y: this.y + 48 };
        }
    }
}
