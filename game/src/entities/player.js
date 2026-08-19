import { Entity } from './entity.js';
import { DIRECTION } from '../core/constants.js';

/**
 * Player - The main character "Bore"
 */
export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.name = 'Bore';
        this.speed = CONSTANTS.PLAYER_SPEED;
        this.missionsCompleted = 0;
        this.currentMission = null;
        this.dialogueQueue = [];
    }

    /**
     * Update player position and state
     */
    update(deltaTime, input, map) {
        const direction = input.getMovementDirection();
        
        this.isMoving = direction.x !== 0 || direction.y !== 0;
        
        if (this.isMoving) {
            // Determine facing direction
            if (Math.abs(direction.x) > Math.abs(direction.y)) {
                this.direction = direction.x > 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
            } else {
                this.direction = direction.y > 0 ? DIRECTION.DOWN : DIRECTION.UP;
            }

            // Calculate new position
            const newX = this.x + direction.x * this.speed;
            const newY = this.y + direction.y * this.speed;

            // Check collision with map
            if (!map.checkCollision(newX, this.y, this.width, this.height)) {
                this.x = newX;
            }
            if (!map.checkCollision(this.x, newY, this.width, this.height)) {
                this.y = newY;
            }
        }

        this.updateAnimation(deltaTime);
    }

    /**
     * Render the player
     */
    render(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        // Draw player sprite using tile assets
        ctx.save();
        
        // Simple animated sprite representation
        const bounce = this.isMoving ? Math.sin(Date.now() / 100) * 2 : 0;
        
        // Body
        ctx.fillStyle = '#4a9eff';
        ctx.fillRect(screenX + 2, screenY + 4 + bounce, 12, 10);
        
        // Head
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(screenX + 3, screenY + bounce, 10, 8);
        
        // Eyes based on direction
        ctx.fillStyle = '#000';
        if (this.direction === DIRECTION.RIGHT || this.direction === DIRECTION.DOWN) {
            ctx.fillRect(screenX + 9, screenY + 2 + bounce, 2, 2);
        } else if (this.direction === DIRECTION.LEFT) {
            ctx.fillRect(screenX + 5, screenY + 2 + bounce, 2, 2);
        } else {
            ctx.fillRect(screenX + 5, screenY + 2 + bounce, 2, 2);
            ctx.fillRect(screenX + 9, screenY + 2 + bounce, 2, 2);
        }

        ctx.restore();
    }

    /**
     * Add dialogue to queue
     */
    addDialogue(text) {
        this.dialogueQueue.push(text);
    }

    /**
     * Get next dialogue line
     */
    getNextDialogue() {
        return this.dialogueQueue.shift() || null;
    }

    /**
     * Complete a mission
     */
    completeMission() {
        this.missionsCompleted++;
        this.currentMission = null;
    }
}
