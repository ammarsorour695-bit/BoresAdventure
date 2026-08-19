/**
 * Game Loop - Phase 1
 * Manages the main game loop with delta time
 */

export class GameLoop {
    constructor() {
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        this.onUpdate = null;
        this.onRender = null;
        this.onFixedUpdate = null;
        
        // Fixed timestep for physics (60 updates per second)
        this.fixedTimestep = 1000 / 60;
        this.accumulator = 0;
        
        // FPS tracking
        this.frameCount = 0;
        this.fpsTime = 0;
        this.fps = 0;
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.accumulator = 0;
        
        requestAnimationFrame((time) => this.loop(time));
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Main loop function
     * @param {number} currentTime - Current time in milliseconds
     */
    loop(currentTime) {
        if (!this.isRunning) return;

        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 250) {
            this.deltaTime = 250;
        }

        // Update FPS counter
        this.frameCount++;
        this.fpsTime += this.deltaTime;
        if (this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;
        }

        // Accumulate time for fixed updates
        this.accumulator += this.deltaTime;

        // Perform fixed updates (physics, etc.)
        while (this.accumulator >= this.fixedTimestep) {
            if (this.onFixedUpdate) {
                this.onFixedUpdate(this.fixedTimestep);
            }
            this.accumulator -= this.fixedTimestep;
        }

        // Call update with delta time
        if (this.onUpdate) {
            this.onUpdate(this.deltaTime);
        }

        // Call render
        if (this.onRender) {
            this.onRender();
        }

        requestAnimationFrame((time) => this.loop(time));
    }

    /**
     * Get current FPS
     * @returns {number}
     */
    getFPS() {
        return this.fps;
    }

    /**
     * Get delta time in milliseconds
     * @returns {number}
     */
    getDeltaTime() {
        return this.deltaTime;
    }

    /**
     * Get delta time as a multiplier (1 = 60fps)
     * @returns {number}
     */
    getDeltaMultiplier() {
        return this.deltaTime / (1000 / 60);
    }
}
