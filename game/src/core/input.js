/**
 * Input Handler - Manages keyboard input for the game
 */
export class InputHandler {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysPressed[e.code] = true;
            }
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            delete this.keysPressed[e.code];
        });
    }

    /**
     * Check if a key is currently held down
     */
    isKeyDown(keyCode) {
        return this.keys[keyCode] || false;
    }

    /**
     * Check if a key was just pressed (single frame)
     */
    isKeyPressed(keyCode) {
        return this.keysPressed[keyCode] || false;
    }

    /**
     * Get movement direction from arrow keys or WASD
     */
    getMovementDirection() {
        const direction = { x: 0, y: 0 };

        if (this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW')) {
            direction.y = -1;
        }
        if (this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS')) {
            direction.y = 1;
        }
        if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) {
            direction.x = -1;
        }
        if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) {
            direction.x = 1;
        }

        // Normalize diagonal movement
        if (direction.x !== 0 && direction.y !== 0) {
            const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
            direction.x /= length;
            direction.y /= length;
        }

        return direction;
    }

    /**
     * Clear the keysPressed buffer (call once per frame)
     */
    update() {
        this.keysPressed = {};
    }
}
