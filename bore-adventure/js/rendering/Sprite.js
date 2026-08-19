/**
 * Sprite - Phase 1
 * Base sprite class for rendering entities
 */

import { assetManager } from '../core/AssetManager.js';
import { AnimationController } from './Animation.js';
import { DIRECTION } from '../core/constants.js';

export class Sprite {
    constructor(options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 32;
        this.height = options.height || 32;
        this.imageKey = options.imageKey || null;
        
        // For tile-based sprites
        this.tileId = options.tileId || null;
        this.tileSize = options.tileSize || 16;
        
        // Animation
        this.animationController = new AnimationController();
        this.direction = options.direction || DIRECTION.DOWN;
        
        // Rendering options
        this.flipX = false;
        this.flipY = false;
        this.opacity = 1;
        this.visible = true;
        
        // Offset for positioning
        this.offsetX = options.offsetX || 0;
        this.offsetY = options.offsetY || 0;
    }

    /**
     * Add an animation to the sprite
     * @param {string} name 
     * @param {import('./Animation.js').Animation} animation 
     */
    addAnimation(name, animation) {
        this.animationController.addAnimation(name, animation);
    }

    /**
     * Play an animation
     * @param {string} name 
     * @param {boolean} force 
     */
    playAnimation(name, force = false) {
        this.animationController.play(name, force);
    }

    /**
     * Update sprite (including animations)
     * @param {number} dt - Delta time in milliseconds
     */
    update(dt) {
        this.animationController.update(dt);
    }

    /**
     * Get the current image/frame to render
     * @returns {HTMLImageElement|null}
     */
    getCurrentImage() {
        // If using animation, get the current frame
        const frame = this.animationController.getCurrentFrame();
        
        if (frame !== null) {
            // Frame could be a tile ID or image key
            if (typeof frame === 'number') {
                return assetManager.getImage(`tile_${String(frame).padStart(4, '0')}`);
            } else if (typeof frame === 'string') {
                return assetManager.getImage(frame);
            }
        }
        
        // Otherwise use the base image
        if (this.imageKey) {
            return assetManager.getImage(this.imageKey);
        }
        
        if (this.tileId !== null) {
            return assetManager.getImage(`tile_${String(this.tileId).padStart(4, '0')}`);
        }
        
        return null;
    }

    /**
     * Render the sprite
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX - Camera X position
     * @param {number} cameraY - Camera Y position
     */
    render(ctx, cameraX, cameraY) {
        if (!this.visible) return;

        const screenX = this.x + this.offsetX - cameraX;
        const screenY = this.y + this.offsetY - cameraY;

        const image = this.getCurrentImage();
        
        if (image) {
            ctx.save();
            
            // Apply transformations
            ctx.globalAlpha = this.opacity;
            
            let drawWidth = this.width;
            let drawHeight = this.height;
            
            // Handle flipping
            if (this.flipX) {
                ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
                ctx.scale(-1, 1);
                ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            } else if (this.flipY) {
                ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
                ctx.scale(1, -1);
                ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            } else {
                ctx.drawImage(image, screenX, screenY, drawWidth, drawHeight);
            }
            
            ctx.restore();
        } else {
            // Debug: draw placeholder rectangle
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
    }

    /**
     * Set direction and flip accordingly
     * @param {string} direction 
     */
    setDirection(direction) {
        this.direction = direction;
        this.flipX = direction === DIRECTION.LEFT;
    }

    /**
     * Get world bounds
     * @returns {{left: number, right: number, top: number, bottom: number}}
     */
    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    /**
     * Get center position
     * @returns {{x: number, y: number}}
     */
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
}
