/**
 * Interaction System - Phase 1 & 9
 * Handles player interactions with NPCs and objects
 */

import { CONFIG } from '../core/constants.js';
import { dialogueSystem } from './DialogueSystem.js';

export class InteractionSystem {
    constructor(world) {
        this.world = world;
        this.nearbyInteractable = null;
        this.showPrompt = false;
    }

    /**
     * Update interaction system
     * @param {import('../entities/Player.js').Player} player 
     */
    update(player) {
        // Find nearby interactable entities
        this.nearbyInteractable = this.world.findNearestInteractable(player);
        this.showPrompt = this.nearbyInteractable !== null;
        
        // Update UI prompt if needed
        this.updatePrompt();
    }

    /**
     * Update the interaction prompt UI
     */
    updatePrompt() {
        // Could add a visual prompt near the player or NPC
        // For now, we'll just track the state
    }

    /**
     * Try to interact with nearby entity
     * @param {import('../entities/Player.js').Player} player 
     * @returns {boolean} - Whether interaction occurred
     */
    tryInteract(player) {
        if (!this.nearbyInteractable) {
            return false;
        }

        const npc = this.nearbyInteractable;
        
        // Start dialogue
        dialogueSystem.startDialogue(npc, () => {
            // Callback when dialogue ends
            this.onDialogueEnd(npc);
        });

        return true;
    }

    /**
     * Called when dialogue ends
     * @param {import('../entities/NPC.js').NPC} npc 
     */
    onDialogueEnd(npc) {
        // Could trigger quest updates or other events here
        console.log(`Dialogue ended with ${npc.name}`);
    }

    /**
     * Check if there's a nearby interactable
     * @returns {boolean}
     */
    hasNearbyInteractable() {
        return this.showPrompt;
    }

    /**
     * Get the nearby interactable entity
     * @returns {import('../entities/NPC.js').NPC|null}
     */
    getNearbyInteractable() {
        return this.nearbyInteractable;
    }

    /**
     * Get interaction prompt text
     * @returns {string}
     */
    getPromptText() {
        if (this.nearbyInteractable) {
            return `[E] ${this.nearbyInteractable.getInteractionPrompt()}`;
        }
        return '';
    }
}
