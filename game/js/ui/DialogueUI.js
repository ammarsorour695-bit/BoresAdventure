/**
 * Dialogue UI Manager
 * Handles displaying dialogue boxes and typewriter text effects
 */
export class DialogueUI {
    constructor() {
        this.uiLayer = document.getElementById('ui-layer');
        this.speakerName = document.getElementById('speaker-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.questTitle = document.getElementById('quest-title');
        this.questDesc = document.getElementById('quest-desc');
        
        this.currentDialogue = [];
        this.lineIndex = 0;
        this.isActive = false;
        this.typewriterTimer = null;
        this.fullText = "";
        this.onCompleteCallback = null;
    }

    startDialogue(speaker, lines, quest = null, onComplete = null) {
        this.isActive = true;
        this.currentDialogue = lines;
        this.lineIndex = 0;
        this.onCompleteCallback = onComplete;
        this.currentQuest = quest;
        
        if (this.uiLayer) {
            this.uiLayer.style.display = 'flex';
            this.uiLayer.classList.add('active');
        }
        
        if (this.speakerName) {
            this.speakerName.textContent = speaker;
        }
        
        this.typeNextLine();
    }

    typeNextLine() {
        if (this.lineIndex >= this.currentDialogue.length) {
            this.endDialogue();
            return;
        }

        const text = this.currentDialogue[this.lineIndex];
        if (this.dialogueText) {
            this.dialogueText.textContent = "";
        }
        this.fullText = text;
        
        let charIndex = 0;
        clearInterval(this.typewriterTimer);
        
        this.typewriterTimer = setInterval(() => {
            if (this.dialogueText) {
                this.dialogueText.textContent += text.charAt(charIndex);
            }
            charIndex++;
            if (charIndex >= text.length) {
                clearInterval(this.typewriterTimer);
            }
        }, 30);
    }

    advance() {
        // If still typing, show full text immediately
        if (this.typewriterTimer && this.dialogueText && 
            this.dialogueText.textContent.length < this.fullText.length) {
            clearInterval(this.typewriterTimer);
            if (this.dialogueText) {
                this.dialogueText.textContent = this.fullText;
            }
            return;
        }

        // Move to next line
        this.lineIndex++;
        this.typeNextLine();
    }

    endDialogue() {
        this.isActive = false;
        if (this.uiLayer) {
            this.uiLayer.style.display = 'none';
            this.uiLayer.classList.remove('active');
        }
        
        if (this.onCompleteCallback) {
            this.onCompleteCallback();
        }
        
        // Handle quest assignment
        if (this.currentQuest && !this.currentQuest.completed) {
            this.updateQuest(this.currentQuest.title, this.currentQuest.description);
            this.currentQuest.completed = true;
        }
        
        clearInterval(this.typewriterTimer);
    }

    updateQuest(title, desc) {
        if (this.questTitle) {
            this.questTitle.textContent = title;
        }
        if (this.questDesc) {
            this.questDesc.textContent = desc;
        }
    }
}
