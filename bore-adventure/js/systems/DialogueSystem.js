/**
 * Dialogue System - Phase 1 & 10
 * Handles dialogue display and progression
 */

export class DialogueSystem {
    constructor() {
        this.uiLayer = document.getElementById('ui-layer');
        this.speakerNameEl = document.getElementById('speaker-name');
        this.dialogueTextEl = document.getElementById('dialogue-text');
        
        this.currentDialogue = [];
        this.lineIndex = 0;
        this.isActive = false;
        this.typewriterTimer = null;
        this.fullText = '';
        this.onComplete = null;
        this.typewriterSpeed = 30; // ms per character
    }

    /**
     * Start a dialogue with an NPC
     * @param {import('../entities/NPC.js').NPC} npc 
     * @param {Function} onComplete - Callback when dialogue ends
     */
    startDialogue(npc, onComplete) {
        const dialogue = npc.getDialogue();
        
        if (!dialogue || dialogue.length === 0) {
            return;
        }
        
        this.isActive = true;
        this.currentDialogue = [...dialogue];
        this.lineIndex = 0;
        this.onComplete = onComplete;
        
        // Show UI
        this.uiLayer.classList.remove('hidden');
        this.uiLayer.classList.add('active');
        this.speakerNameEl.textContent = npc.name;
        
        // Start typing first line
        this.typeNextLine();
    }

    /**
     * Type the next dialogue line
     */
    typeNextLine() {
        if (this.lineIndex >= this.currentDialogue.length) {
            this.endDialogue();
            return;
        }

        const text = this.currentDialogue[this.lineIndex];
        this.dialogueTextEl.textContent = '';
        this.fullText = text;
        
        let charIndex = 0;
        
        // Clear any existing timer
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
        }
        
        // Typewriter effect
        this.typewriterTimer = setInterval(() => {
            this.dialogueTextEl.textContent += text.charAt(charIndex);
            charIndex++;
            
            if (charIndex >= text.length) {
                clearInterval(this.typewriterTimer);
                this.typewriterTimer = null;
            }
        }, this.typewriterSpeed);
    }

    /**
     * Advance to next line or complete current line
     */
    advance() {
        // If typewriter is still running, show full text immediately
        if (this.typewriterTimer && this.dialogueTextEl.textContent.length < this.fullText.length) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
            this.dialogueTextEl.textContent = this.fullText;
            return;
        }

        // Move to next line
        this.lineIndex++;
        this.typeNextLine();
    }

    /**
     * End the current dialogue
     */
    endDialogue() {
        this.isActive = false;
        this.uiLayer.classList.remove('active');
        this.uiLayer.classList.add('hidden');
        
        if (this.onComplete) {
            this.onComplete();
        }
        
        this.onComplete = null;
        this.currentDialogue = [];
        this.lineIndex = 0;
    }

    /**
     * Check if dialogue is active
     * @returns {boolean}
     */
    isDialogueActive() {
        return this.isActive;
    }

    /**
     * Set typewriter speed
     * @param {number} speed - Milliseconds per character
     */
    setTypewriterSpeed(speed) {
        this.typewriterSpeed = speed;
    }
}

// Singleton instance
export const dialogueSystem = new DialogueSystem();
