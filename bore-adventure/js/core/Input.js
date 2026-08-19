/**
 * Input Handler - Phase 1
 * Handles keyboard input for player controls
 */

export class InputHandler {
    constructor() {
        this.keys = new Map();
        this.justPressed = new Map();
        this.justReleased = new Map();
        
        // Bind event listeners
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        const code = e.code;
        
        // Only register as just pressed if it wasn't already down
        if (!this.keys.get(code)) {
            this.justPressed.set(code, true);
        }
        
        this.keys.set(code, true);
    }

    handleKeyUp(e) {
        const code = e.code;
        this.keys.set(code, false);
        this.justReleased.set(code, true);
    }

    /**
     * Check if a key is currently held down
     * @param {string} code - Key code (e.g., 'ArrowUp', 'KeyW')
     * @returns {boolean}
     */
    isDown(code) {
        return !!this.keys.get(code);
    }

    /**
     * Check if a key was just pressed this frame
     * @param {string} code - Key code
     * @returns {boolean}
     */
    isJustPressed(code) {
        return !!this.justPressed.get(code);
    }

    /**
     * Check if a key was just released this frame
     * @param {string} code - Key code
     * @returns {boolean}
     */
    isJustReleased(code) {
        return !!this.justReleased.get(code);
    }

    /**
     * Get movement direction as a normalized vector
     * @returns {{x: number, y: number}}
     */
    getMovementDirection() {
        let x = 0;
        let y = 0;

        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) {
            x -= 1;
        }
        if (this.isDown('ArrowRight') || this.isDown('KeyD')) {
            x += 1;
        }
        if (this.isDown('ArrowUp') || this.isDown('KeyW')) {
            y -= 1;
        }
        if (this.isDown('ArrowDown') || this.isDown('KeyS')) {
            y += 1;
        }

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    /**
     * Clear the just pressed/released states (call once per frame)
     */
    clearTransientStates() {
        this.justPressed.clear();
        this.justReleased.clear();
    }

    /**
     * Check if any movement key is pressed
     * @returns {boolean}
     */
    isMoving() {
        const dir = this.getMovementDirection();
        return dir.x !== 0 || dir.y !== 0;
    }
}

// Singleton instance
export const inputHandler = new InputHandler();
