/**
 * Base Entity Class
 * All game objects inherit from this
 */
export class Entity {
    constructor(x, y, width, height, color = '#fff', speed = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
        this.direction = 'down';
        this.isMoving = false;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
            center: {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            }
        };
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(dt, input, worldBounds) {
        // Override in subclasses
    }
}
