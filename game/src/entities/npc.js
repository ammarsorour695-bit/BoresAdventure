import { Entity } from './entity.js';
import { DIRECTION } from '../core/constants.js';

/**
 * NPC - Non-Player Character for giving missions and dialogue
 */
export class NPC extends Entity {
    constructor(x, y, name, dialogue, mission = null) {
        super(x, y, 16, 16);
        this.name = name;
        this.dialogue = dialogue;
        this.mission = mission;
        this.missionGiven = false;
        this.missionCompleted = false;
        this.hasInteraction = true;
        this.color = '#9b59b6';
    }

    /**
     * Update NPC (simple wandering AI)
     */
    update(deltaTime, input, map) {
        // NPCs don't move by default, but can be extended
        this.isMoving = false;
    }

    /**
     * Render the NPC
     */
    render(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;

        ctx.save();

        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX + 2, screenY + 4, 12, 10);

        // Head
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(screenX + 3, screenY, 10, 8);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 5, screenY + 2, 2, 2);
        ctx.fillRect(screenX + 9, screenY + 2, 2, 2);

        // Mission marker if available
        if (this.mission && !this.missionGiven) {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(screenX + 8, screenY - 6);
            ctx.lineTo(screenX + 4, screenY - 2);
            ctx.lineTo(screenX + 12, screenY - 2);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    /**
     * Interact with the NPC
     */
    interact(player) {
        const responses = [];

        // First interaction
        if (!this.missionGiven && this.mission) {
            responses.push(`${this.name}: Hello there! I'm ${this.name}.`);
            responses.push(`${this.name}: I could use some help with something...`);
            responses.push(`${this.name}: ${this.mission.description}`);
            responses.push(`${this.name}: Can you help me? (Press E to accept)`);
            this.missionGiven = true;
            player.currentMission = this.mission;
        } else if (this.mission && this.missionGiven && !this.missionCompleted) {
            // Check if mission is complete
            if (player.currentMission && player.currentMission.isComplete?.()) {
                responses.push(`${this.name}: Wow! You did it! Thank you so much!`);
                responses.push(`${this.name}: Here's your reward.`);
                this.missionCompleted = true;
                player.completeMission();
            } else {
                responses.push(`${this.name}: Have you completed the task yet?`);
                responses.push(`${this.name}: ${this.mission.description}`);
            }
        } else {
            // Random dialogue
            const randomIndex = Math.floor(Math.random() * this.dialogue.length);
            responses.push(`${this.name}: ${this.dialogue[randomIndex]}`);
        }

        return responses;
    }

    /**
     * Set new dialogue
     */
    setDialogue(newDialogue) {
        this.dialogue = newDialogue;
    }

    /**
     * Set a mission for this NPC
     */
    setMission(mission) {
        this.mission = mission;
        this.missionGiven = false;
    }
}
