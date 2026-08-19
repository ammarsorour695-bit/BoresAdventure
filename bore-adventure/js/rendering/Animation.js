/**
 * Animation System - Phase 1
 * Handles sprite animations with frames and timing
 */

import { CONFIG } from '../core/constants.js';

export class Animation {
    constructor(name, frames, frameDuration = CONFIG.FRAME_DURATION, loop = true) {
        this.name = name;
        this.frames = frames; // Array of frame data (tile IDs or image sources)
        this.frameDuration = frameDuration;
        this.loop = loop;
        
        this.currentFrame = 0;
        this.timer = 0;
        this.isPlaying = false;
        this.isFinished = false;
    }

    /**
     * Start the animation
     */
    start() {
        this.isPlaying = true;
        this.currentFrame = 0;
        this.timer = 0;
        this.isFinished = false;
    }

    /**
     * Stop the animation
     */
    stop() {
        this.isPlaying = false;
    }

    /**
     * Update animation state
     * @param {number} dt - Delta time in milliseconds
     */
    update(dt) {
        if (!this.isPlaying || this.isFinished) return;

        this.timer += dt;

        if (this.timer >= this.frameDuration) {
            this.timer -= this.frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.isFinished = true;
                    this.isPlaying = false;
                }
            }
        }
    }

    /**
     * Get the current frame data
     * @returns {*} - Current frame data
     */
    getCurrentFrame() {
        if (this.frames.length === 0) return null;
        return this.frames[Math.min(this.currentFrame, this.frames.length - 1)];
    }

    /**
     * Reset animation to first frame
     */
    reset() {
        this.currentFrame = 0;
        this.timer = 0;
        this.isFinished = false;
        if (this.loop) {
            this.isPlaying = true;
        }
    }

    /**
     * Clone this animation
     * @returns {Animation}
     */
    clone() {
        return new Animation(
            this.name,
            [...this.frames],
            this.frameDuration,
            this.loop
        );
    }
}

/**
 * Animation Controller - manages multiple animations for an entity
 */
export class AnimationController {
    constructor() {
        this.animations = new Map();
        this.currentAnimation = null;
    }

    /**
     * Add an animation
     * @param {string} name - Animation name
     * @param {Animation} animation - Animation instance
     */
    addAnimation(name, animation) {
        this.animations.set(name, animation);
    }

    /**
     * Play an animation by name
     * @param {string} name - Animation name
     * @param {boolean} force - Force restart even if already playing
     */
    play(name, force = false) {
        const animation = this.animations.get(name);
        if (!animation) {
            console.warn(`Animation not found: ${name}`);
            return;
        }

        if (this.currentAnimation === animation && !force) {
            return;
        }

        this.currentAnimation = animation;
        animation.start();
    }

    /**
     * Stop the current animation
     */
    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
    }

    /**
     * Update all animations
     * @param {number} dt - Delta time in milliseconds
     */
    update(dt) {
        if (this.currentAnimation && this.currentAnimation.isPlaying) {
            this.currentAnimation.update(dt);
        }
    }

    /**
     * Get the current frame from the active animation
     * @returns {*} - Current frame data
     */
    getCurrentFrame() {
        if (!this.currentAnimation) return null;
        return this.currentAnimation.getCurrentFrame();
    }

    /**
     * Check if an animation exists
     * @param {string} name 
     * @returns {boolean}
     */
    hasAnimation(name) {
        return this.animations.has(name);
    }
}
