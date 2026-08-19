/**
 * Tilemap Renderer - Phase 1 & 2
 * Renders tile-based maps using the Kenney asset pack
 */

import { CONFIG } from '../core/constants.js';
import { assetManager } from '../core/AssetManager.js';

export class TilemapRenderer {
    constructor() {
        this.tileSize = CONFIG.TILE_SIZE;
        this.tileSpacing = CONFIG.TILE_SPACING;
        this.tileMargin = CONFIG.TILE_MARGIN;
        
        // Map data
        this.layers = [];
        this.width = 0;
        this.height = 0;
        
        // Collision layer (separate from visual)
        this.collisionLayer = null;
    }

    /**
     * Create a new map layer
     * @param {number[][]} tiles - 2D array of tile IDs
     * @returns {number} - Layer index
     */
    addLayer(tiles) {
        this.layers.push(tiles);
        if (tiles.length > 0) {
            this.height = tiles.length;
            this.width = tiles[0].length;
        }
        return this.layers.length - 1;
    }

    /**
     * Set collision data
     * @param {number[][]} collision - 2D array (1 = solid, 0 = passable)
     */
    setCollisionLayer(collision) {
        this.collisionLayer = collision;
        if (collision.length > 0) {
            this.height = Math.max(this.height, collision.length);
            this.width = Math.max(this.width, collision[0].length);
        }
    }

    /**
     * Get tile at position
     * @param {number} x - Tile X coordinate
     * @param {number} y - Tile Y coordinate
     * @param {number} layer - Layer index (default: 0)
     * @returns {number|null}
     */
    getTile(x, y, layer = 0) {
        if (layer < 0 || layer >= this.layers.length) return null;
        if (y < 0 || y >= this.height) return null;
        if (x < 0 || x >= this.width) return null;
        return this.layers[layer][y][x];
    }

    /**
     * Check if a world position is collidable
     * @param {number} worldX 
     * @param {number} worldY 
     * @returns {boolean}
     */
    isCollidable(worldX, worldY) {
        if (!this.collisionLayer) return false;
        
        const tileX = Math.floor(worldX / (this.tileSize + this.tileSpacing));
        const tileY = Math.floor(worldY / (this.tileSize + this.tileSpacing));
        
        if (tileY < 0 || tileY >= this.collisionLayer.length) return false;
        if (tileX < 0 || tileX >= this.collisionLayer[0].length) return false;
        
        return this.collisionLayer[tileY][tileX] === 1;
    }

    /**
     * Render all visible layers
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} cameraY 
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     */
    render(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        // Calculate visible tile range
        const startTileX = Math.floor(cameraX / (this.tileSize + this.tileSpacing));
        const startTileY = Math.floor(cameraY / (this.tileSize + this.tileSpacing));
        const endTileX = startTileX + Math.ceil(canvasWidth / (this.tileSize + this.tileSpacing)) + 1;
        const endTileY = startTileY + Math.ceil(canvasHeight / (this.tileSize + this.tileSpacing)) + 1;

        // Render each layer
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            const layer = this.layers[layerIndex];
            
            for (let y = startTileY; y < endTileY; y++) {
                for (let x = startTileX; x < endTileX; x++) {
                    if (y < 0 || y >= this.height || x < 0 || x >= this.width) continue;
                    
                    const tileId = layer[y][x];
                    if (tileId === null || tileId === -1 || tileId === 0) continue;

                    const screenX = Math.floor(x * (this.tileSize + this.tileSpacing) - cameraX);
                    const screenY = Math.floor(y * (this.tileSize + this.tileSpacing) - cameraY);

                    this.renderTile(ctx, tileId, screenX, screenY);
                }
            }
        }
    }

    /**
     * Render a single tile
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} tileId 
     * @param {number} screenX 
     * @param {number} screenY 
     */
    renderTile(ctx, tileId, screenX, screenY) {
        const imageKey = `tile_${String(tileId).padStart(4, '0')}`;
        const image = assetManager.getImage(imageKey);
        
        if (image) {
            ctx.drawImage(
                image,
                screenX,
                screenY,
                this.tileSize,
                this.tileSize
            );
        } else {
            // Debug: draw placeholder for missing tiles
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        }
    }

    /**
     * Get world width in pixels
     * @returns {number}
     */
    getWorldWidth() {
        return this.width * (this.tileSize + this.tileSpacing);
    }

    /**
     * Get world height in pixels
     * @returns {number}
     */
    getWorldHeight() {
        return this.height * (this.tileSize + this.tileSpacing);
    }

    /**
     * Convert world coordinates to tile coordinates
     * @param {number} worldX 
     * @param {number} worldY 
     * @returns {{tileX: number, tileY: number}}
     */
    worldToTile(worldX, worldY) {
        return {
            tileX: Math.floor(worldX / (this.tileSize + this.tileSpacing)),
            tileY: Math.floor(worldY / (this.tileSize + this.tileSpacing))
        };
    }

    /**
     * Convert tile coordinates to world coordinates
     * @param {number} tileX 
     * @param {number} tileY 
     * @returns {{worldX: number, worldY: number}}
     */
    tileToWorld(tileX, tileY) {
        return {
            worldX: tileX * (this.tileSize + this.tileSpacing),
            worldY: tileY * (this.tileSize + this.tileSpacing)
        };
    }
}
