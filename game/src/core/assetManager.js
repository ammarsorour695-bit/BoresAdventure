import { CONSTANTS, TILE_TYPES } from './constants.js';

/**
 * Asset Manager - Loads and manages game assets (tiles, sprites, audio)
 */
export class AssetManager {
    constructor() {
        this.tiles = new Map();
        this.sprites = new Map();
        this.audio = new Map();
        this.loaded = false;
        this.loadingProgress = 0;
    }

    /**
     * Load all tile images from the assets folder
     */
    async loadTiles(tileCount = 50) {
        const promises = [];
        
        // Load only essential tiles for faster startup
        const essentialTiles = [15, 22, 30, 45, 46, 47, 60, 80, 100, 105, 120, 130, 135, 140, 150, 200];
        
        for (const tileId of essentialTiles) {
            const paddedNum = String(tileId).padStart(4, '0');
            const promise = this.loadImage(`tile_${paddedNum}`, `assets/tiles/tile_${paddedNum}.png`);
            promises.push(promise);
        }

        await Promise.all(promises);
        console.log(`Loaded ${essentialTiles.length} essential tiles`);
    }

    /**
     * Load a single image
     */
    loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.tiles.set(name, img);
                resolve(img);
            };
            img.onerror = () => {
                // Create a placeholder colored rectangle if image fails to load
                const canvas = document.createElement('canvas');
                canvas.width = CONSTANTS.TILE_SIZE;
                canvas.height = CONSTANTS.TILE_SIZE;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#666';
                ctx.fillRect(0, 0, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
                this.tiles.set(name, canvas);
                resolve(canvas);
            };
            img.src = path;
        });
    }

    /**
     * Get a tile by its ID number
     */
    getTile(tileId) {
        const paddedId = String(tileId).padStart(4, '0');
        return this.tiles.get(`tile_${paddedId}`) || null;
    }

    /**
     * Get tile for a specific tile type
     */
    getTileByType(tileType) {
        // Map tile types to tile IDs based on common tilemap conventions
        const tileMap = {
            [TILE_TYPES.EMPTY]: null,
            [TILE_TYPES.GRASS]: 15,
            [TILE_TYPES.SIDEWALK]: 22,
            [TILE_TYPES.ROAD]: 30,
            [TILE_TYPES.BUILDING_WALL]: 45,
            [TILE_TYPES.BUILDING_WINDOW]: 46,
            [TILE_TYPES.BUILDING_DOOR]: 47,
            [TILE_TYPES.TREE]: 60,
            [TILE_TYPES.WATER]: 100,
            [TILE_TYPES.BRIDGE]: 105,
            [TILE_TYPES.ROOF]: 80,
            [TILE_TYPES.FENCE]: 120,
            [TILE_TYPES.LAMP_POST]: 130,
            [TILE_TYPES.BENCH]: 135,
            [TILE_TYPES.CAR]: 150,
            [TILE_TYPES.TRASH_CAN]: 140
        };

        const tileId = tileMap[tileType];
        if (tileId !== undefined && tileId !== null) {
            return this.getTile(tileId);
        }
        return null;
    }

    /**
     * Load player sprite
     */
    async loadPlayerSprite() {
        // Use one of the available tiles as a placeholder for the player
        await this.loadImage('player', 'assets/tiles/tile_0200.png');
        this.sprites.set('player', this.tiles.get('tile_0200'));
    }

    /**
     * Get a sprite by name
     */
    getSprite(name) {
        return this.sprites.get(name) || null;
    }

    /**
     * Check if all assets are loaded
     */
    isReady() {
        return this.loaded;
    }
}
