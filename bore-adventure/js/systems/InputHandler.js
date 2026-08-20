/**
 * Input Handler - Manages keyboard input
 */
export default class InputHandler {
    constructor() {
        this.keys = new Map();
        this.prevKeys = new Map();
        
        window.addEventListener('keydown', (e) => {
            this.keys.set(e.code, true);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
        });
    }

    isDown(code) {
        return this.keys.get(code) === true;
    }

    isPressed(code) {
        return this.keys.get(code) === true && this.prevKeys.get(code) !== true;
    }

    update() {
        // Store previous key states
        this.prevKeys = new Map(this.keys);
    }

    clearMovement() {
        // Clear movement keys but keep other inputs
        const movementKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'];
        movementKeys.forEach(key => {
            this.keys.set(key, false);
        });
    }

    getMovementDirection() {
        let x = 0;
        let y = 0;
        
        if (this.isDown('ArrowUp') || this.isDown('KeyW')) y -= 1;
        if (this.isDown('ArrowDown') || this.isDown('KeyS')) y += 1;
        if (this.isDown('ArrowLeft') || this.isDown('KeyA')) x -= 1;
        if (this.isDown('ArrowRight') || this.isDown('KeyD')) x += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }
        
        return { x, y };
    }
}
