import { CONSTANTS, GAME_STATE } from '../core/constants.js';

/**
 * Dialogue System - Manages NPC conversations and story progression
 */
export class DialogueSystem {
    constructor() {
        this.currentDialogue = null;
        this.dialogueQueue = [];
        this.isShowing = false;
        this.typewriterIndex = 0;
        this.typewriterTimer = 0;
        this.typewriterSpeed = 30; // ms per character
        this.onDialogueEnd = null;
    }

    /**
     * Start a new dialogue
     */
    startDialogue(lines, onEnd = null) {
        if (typeof lines === 'string') {
            this.dialogueQueue = [lines];
        } else {
            this.dialogueQueue = [...lines];
        }
        this.currentDialogue = this.dialogueQueue[0];
        this.typewriterIndex = 0;
        this.isShowing = true;
        this.onDialogueEnd = onEnd;
    }

    /**
     * Advance to next dialogue line
     */
    advance() {
        if (this.typewriterIndex < this.currentDialogue.length) {
            // Show full text immediately if user presses during typewriter effect
            this.typewriterIndex = this.currentDialogue.length;
            return;
        }

        this.dialogueQueue.shift();
        
        if (this.dialogueQueue.length > 0) {
            this.currentDialogue = this.dialogueQueue[0];
            this.typewriterIndex = 0;
        } else {
            this.endDialogue();
        }
    }

    /**
     * End the current dialogue
     */
    endDialogue() {
        this.isShowing = false;
        this.currentDialogue = null;
        this.dialogueQueue = [];
        this.typewriterIndex = 0;
        
        if (this.onDialogueEnd) {
            this.onDialogueEnd();
            this.onDialogueEnd = null;
        }
    }

    /**
     * Get the current display text (with typewriter effect)
     */
    getDisplayText(deltaTime) {
        if (!this.currentDialogue) return '';

        if (this.typewriterIndex < this.currentDialogue.length) {
            this.typewriterTimer += deltaTime;
            if (this.typewriterTimer >= this.typewriterSpeed) {
                this.typewriterIndex++;
                this.typewriterTimer = 0;
            }
        }

        return this.currentDialogue.substring(0, this.typewriterIndex);
    }

    /**
     * Update dialogue system
     */
    update(deltaTime) {
        if (this.isShowing && this.currentDialogue) {
            this.getDisplayText(deltaTime);
        }
    }
}

/**
 * Predefined dialogues for NPCs
 */
export const DIALOGUES = {
    INTRO: [
        "Welcome to the city!",
        "This is a great place to live.",
        "Feel free to explore and meet people."
    ],
    ELDERLY_NEIGHBOR: [
        "Oh hello dear! You must be the new neighbor.",
        "I've lived here for 40 years.",
        "The city has changed so much...",
        "But it's still home."
    ],
    SHOP_KEEPER: [
        "Welcome to my shop!",
        "Looking for anything special?",
        "Just browsing? That's fine too!"
    ],
    KID_IN_PARK: [
        "Hi! Want to play tag?",
        "My cat ran away somewhere...",
        "Have you seen a orange cat?"
    ],
    BUSINESS_PERSON: [
        "Late again...",
        "Need coffee ASAP!",
        "Do you know where the nearest cafe is?"
    ],
    TOURIST: [
        "Excuse me, I'm lost.",
        "Where is the train station?",
        "Thanks for your help!"
    ],
    POLICE_OFFICER: [
        "Keep the peace.",
        "Report any suspicious activity.",
        "Have a safe day!"
    ]
};
