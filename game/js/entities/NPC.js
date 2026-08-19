/**
 * NPC Class - Non-Player Character
 * Handles AI behavior, dialogue, and rendering
 */
import { Entity } from './Entity.js';

export class NPC extends Entity {
    constructor(config) {
        super(config.x, config.y, 32, 48, config.color || '#e74c3c', config.speed || 1);
        
        // Identity
        this.name = config.name || "Unknown";
        this.id = config.id || Math.random().toString(36).substr(2, 9);
        
        // Dialogue Data
        this.dialogueTree = config.dialogue || ["Hello there!"];
        this.hasQuest = !!config.quest;
        this.quest = config.quest || null;
        this.questCompleted = false;
        
        // Behavior Configuration
        this.behavior = config.behavior || 'stand'; // 'stand', 'wander', 'patrol'
        this.patrolPoints = config.patrolPoints || [];
        this.currentPatrolIndex = 0;
        
        // Interaction State
        this.isInteracting = false;
        this.interactionRange = config.interactionRange || 50;
        
        // Animation State
        this.state = 'idle';
        this.facing = 'down';
        this.frameTimer = 0;
        this.frameIndex = 0;
        
        // Behavior Timer
        this.behaviorTimer = 0;
    }

    update(dt, worldBounds, player, collisionSystem) {
        if (this.isInteracting) {
            this.state = 'idle';
            return;
        }

        let moving = false;

        // Behavior Logic
        if (this.behavior === 'wander') {
            this.handleWander(dt);
            moving = (this.vx !== 0 || this.vy !== 0);
        } else if (this.behavior === 'patrol') {
            this.handlePatrol(dt);
            moving = (this.vx !== 0 || this.vy !== 0);
        } else {
            this.vx = 0;
            this.vy = 0;
        }

        // Apply Movement with Collision Check
        if (moving) {
            const oldX = this.x;
            const oldY = this.y;
            
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            // Boundary checks
            if (this.x < 0) this.x = 0;
            if (this.y < 0) this.y = 0;
            if (this.x > worldBounds.width - this.width) this.x = worldBounds.width - this.width;
            if (this.y > worldBounds.height - this.height) this.y = worldBounds.height - this.height;

            // Update facing direction
            if (Math.abs(this.vx) > Math.abs(this.vy)) {
                this.facing = this.vx > 0 ? 'right' : 'left';
            } else {
                this.facing = this.vy > 0 ? 'down' : 'up';
            }
            
            this.state = 'walk';
        } else {
            this.state = 'idle';
        }

        // Update animation frame
        this.updateAnimation(dt);
    }

    handleWander(dt) {
        this.behaviorTimer -= dt;
        
        if (this.behaviorTimer <= 0) {
            const action = Math.random();
            const duration = 1000 + Math.random() * 2000;
            this.behaviorTimer = duration;

            if (action < 0.3) {
                this.vx = 0;
                this.vy = 0;
            } else {
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
            }
        }
    }

    handlePatrol(dt) {
        if (this.patrolPoints.length === 0) {
            this.vx = 0;
            this.vy = 0;
            return;
        }

        const target = this.patrolPoints[this.currentPatrolIndex];
        const dx = target.x - (this.x + this.width/2);
        const dy = target.y - (this.y + this.height/2);
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 5) {
            this.behaviorTimer -= dt;
            if (this.behaviorTimer <= 0) {
                this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
                this.behaviorTimer = 1000;
            }
            this.vx = 0;
            this.vy = 0;
        } else {
            const angle = Math.atan2(dy, dx);
            this.vx = Math.cos(angle) * this.speed;
            this.vy = Math.sin(angle) * this.speed;
            this.behaviorTimer = 0;
        }
    }

    updateAnimation(dt) {
        this.frameTimer += dt;
        if (this.frameTimer > 150) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.frameTimer = 0;
        }
    }

    draw(ctx) {
        // Draw body
        ctx.fillStyle = this.color;
        let bounce = 0;
        if (this.state === 'walk' && this.frameIndex === 1) {
            bounce = -2;
        }
        
        // Body
        ctx.fillRect(this.x + 4, this.y + 10 + bounce, 24, 28);
        
        // Head
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(this.x + 6, this.y + 2 + bounce, 20, 18);
        
        // Eyes
        ctx.fillStyle = 'black';
        if (this.facing === 'down' || this.facing === 'up') {
            ctx.fillRect(this.x + 10, this.y + 8 + bounce, 2, 2);
            ctx.fillRect(this.x + 20, this.y + 8 + bounce, 2, 2);
        } else if (this.facing === 'left') {
            ctx.fillRect(this.x + 8, this.y + 8 + bounce, 2, 2);
        } else if (this.facing === 'right') {
            ctx.fillRect(this.x + 20, this.y + 8 + bounce, 2, 2);
        }
        
        // Legs
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
        
        // Name tag
        ctx.fillStyle = 'white';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(this.name, this.x + 16, this.y - 10);
        ctx.fillText(this.name, this.x + 16, this.y - 10);
    }

    interact() {
        this.isInteracting = true;
        return {
            speaker: this.name,
            lines: this.dialogueTree,
            quest: this.quest,
            onComplete: () => {
                this.isInteracting = false;
            }
        };
    }
}
