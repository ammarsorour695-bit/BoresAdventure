/**
 * Interaction System
 * Handles player interactions with NPCs and objects
 */
export class InteractionSystem {
    constructor() {
        this.nearbyInteractable = null;
        this.interactionRange = 50;
    }

    update(player, npcs, objects) {
        this.nearbyInteractable = null;

        // Check NPCs
        for (const npc of npcs) {
            const dx = (player.x + player.width/2) - (npc.x + npc.width/2);
            const dy = (player.y + player.height/2) - (npc.y + npc.height/2);
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < this.interactionRange + npc.interactionRange) {
                this.nearbyInteractable = {
                    type: 'npc',
                    entity: npc,
                    prompt: '[E] Talk'
                };
                return;
            }
        }

        // Check objects (future expansion)
        for (const obj of objects) {
            if (obj.interactable) {
                const dx = (player.x + player.width/2) - (obj.x + obj.width/2);
                const dy = (player.y + player.height/2) - (obj.y + obj.height/2);
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < this.interactionRange) {
                    this.nearbyInteractable = {
                        type: 'object',
                        entity: obj,
                        prompt: obj.interactPrompt || '[E] Interact'
                    };
                    return;
                }
            }
        }
    }

    interact() {
        if (this.nearbyInteractable && this.nearbyInteractable.entity) {
            if (this.nearbyInteractable.type === 'npc') {
                return this.nearbyInteractable.entity.interact();
            } else if (this.nearbyInteractable.type === 'object') {
                return this.nearbyInteractable.entity.interact();
            }
        }
        return null;
    }

    getPrompt() {
        if (this.nearbyInteractable) {
            return {
                text: this.nearbyInteractable.prompt,
                x: this.nearbyInteractable.entity.x + this.nearbyInteractable.entity.width/2,
                y: this.nearbyInteractable.entity.y - 15
            };
        }
        return null;
    }
}
