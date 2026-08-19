/**
 * Input Handler
 * Manages keyboard state for player controls
 */
export class InputHandler {
    constructor() {
        this.keys = {};
        this.pressed = {};
        this.released = {};
        
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.pressed[e.code] = true;
            }
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.released[e.code] = true;
            this.keys[e.code] = false;
        });
    }
    
    isDown(code) {
        return !!this.keys[code];
    }
    
    isPressed(code) {
        const result = !!this.pressed[code];
        this.pressed[code] = false;
        return result;
    }
    
    isReleased(code) {
        const result = !!this.released[code];
        this.released[code] = false;
        return result;
    }
    
    clearTransientStates() {
        this.pressed = {};
        this.released = {};
    }
}
