import { TILE_TYPES, CONSTANTS } from './constants.js';

/**
 * GameMap - Handles the tile-based map system
 */
export class GameMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.solidTiles = new Set([
            TILE_TYPES.BUILDING_WALL,
            TILE_TYPES.BUILDING_WINDOW,
            TILE_TYPES.TREE,
            TILE_TYPES.WATER,
            TILE_TYPES.FENCE,
            TILE_TYPES.LAMP_POST,
            TILE_TYPES.TRASH_CAN,
            TILE_TYPES.CAR
        ]);
    }

    /**
     * Initialize the map with default terrain
     */
    initialize() {
        // Create a city-like map
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.getTileAt(x, y);
            }
        }
    }

    /**
     * Get tile type at position based on procedural generation
     */
    getTileAt(x, y) {
        // Create roads (horizontal and vertical)
        const isRoadHorizontal = y >= Math.floor(this.height / 2) - 1 && 
                                  y <= Math.floor(this.height / 2) + 1;
        const isRoadVertical = x >= Math.floor(this.width / 2) - 1 && 
                                x <= Math.floor(this.width / 2) + 1;

        if (isRoadHorizontal || isRoadVertical) {
            return TILE_TYPES.ROAD;
        }

        // Create buildings in blocks
        const blockSize = 8;
        const blockX = Math.floor(x / blockSize);
        const blockY = Math.floor(y / blockSize);

        // Leave some blocks empty for parks
        if ((blockX + blockY) % 3 === 0) {
            return TILE_TYPES.GRASS;
        }

        // Building edges
        const isInBuildingBlock = (x % blockSize) === 0 || 
                                   (x % blockSize) === blockSize - 1 ||
                                   (y % blockSize) === 0 || 
                                   (y % blockSize) === blockSize - 1;

        if (isInBuildingBlock && !isRoadHorizontal && !isRoadVertical) {
            // Add windows randomly
            if (Math.random() > 0.7) {
                return TILE_TYPES.BUILDING_WINDOW;
            }
            return TILE_TYPES.BUILDING_WALL;
        }

        // Sidewalks next to roads
        const nearRoad = Math.abs(y - Math.floor(this.height / 2)) === 2 ||
                         Math.abs(x - Math.floor(this.width / 2)) === 2;
        
        if (nearRoad) {
            return TILE_TYPES.SIDEWALK;
        }

        // Default to grass
        return TILE_TYPES.GRASS;
    }

    /**
     * Get tile at grid coordinates
     */
    getTile(gridX, gridY) {
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return TILE_TYPES.BUILDING_WALL; // Out of bounds is solid
        }
        return this.tiles[gridY][gridX];
    }

    /**
     * Set tile at grid coordinates
     */
    setTile(gridX, gridY, tileType) {
        if (gridX >= 0 && gridX < this.width && gridY >= 0 && gridY < this.height) {
            this.tiles[gridY][gridX] = tileType;
        }
    }

    /**
     * Check collision at pixel coordinates
     */
    checkCollision(x, y, width, height) {
        const tileSize = CONSTANTS.TILE_SIZE;
        
        // Check all four corners
        const corners = [
            { x: x, y: y },
            { x: x + width - 1, y: y },
            { x: x, y: y + height - 1 },
            { x: x + width - 1, y: y + height - 1 }
        ];

        for (const corner of corners) {
            const gridX = Math.floor(corner.x / tileSize);
            const gridY = Math.floor(corner.y / tileSize);
            const tile = this.getTile(gridX, gridY);

            if (this.solidTiles.has(tile)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Render the visible portion of the map
     */
    render(ctx, cameraX, cameraY, assetManager) {
        const tileSize = CONSTANTS.TILE_SIZE;
        const startX = Math.floor(cameraX / tileSize);
        const startY = Math.floor(cameraY / tileSize);
        const endX = startX + Math.ceil(ctx.canvas.width / tileSize) + 1;
        const endY = startY + Math.ceil(ctx.canvas.height / tileSize) + 1;

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.getTile(x, y);
                if (tile !== TILE_TYPES.EMPTY) {
                    const screenX = x * tileSize - cameraX;
                    const screenY = y * tileSize - cameraY;
                    
                    const tileImage = assetManager.getTileByType(tile);
                    
                    if (tileImage) {
                        ctx.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
                    } else {
                        // Fallback colored tiles
                        ctx.fillStyle = this.getTileColor(tile);
                        ctx.fillRect(screenX, screenY, tileSize, tileSize);
                    }
                }
            }
        }
    }

    /**
     * Get color for tile type (fallback rendering)
     */
    getTileColor(tileType) {
        const colors = {
            [TILE_TYPES.GRASS]: '#2d5a27',
            [TILE_TYPES.SIDEWALK]: '#888888',
            [TILE_TYPES.ROAD]: '#444444',
            [TILE_TYPES.BUILDING_WALL]: '#654321',
            [TILE_TYPES.BUILDING_WINDOW]: '#87ceeb',
            [TILE_TYPES.BUILDING_DOOR]: '#8b4513',
            [TILE_TYPES.TREE]: '#228b22',
            [TILE_TYPES.WATER]: '#4169e1',
            [TILE_TYPES.BRIDGE]: '#deb887',
            [TILE_TYPES.ROOF]: '#8b0000',
            [TILE_TYPES.FENCE]: '#a0522d',
            [TILE_TYPES.LAMP_POST]: '#708090',
            [TILE_TYPES.BENCH]: '#8b4513',
            [TILE_TYPES.CAR]: '#dc143c',
            [TILE_TYPES.TRASH_CAN]: '#2f4f4f'
        };
        return colors[tileType] || '#000000';
    }

    /**
     * Get the center position of a walkable area
     */
    getSpawnPoint() {
        // Find a road or sidewalk tile for spawning
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.getTile(x, y);
                if (tile === TILE_TYPES.ROAD || tile === TILE_TYPES.SIDEWALK || tile === TILE_TYPES.GRASS) {
                    return {
                        x: x * CONSTANTS.TILE_SIZE,
                        y: y * CONSTANTS.TILE_SIZE
                    };
                }
            }
        }
        return { x: 100, y: 100 };
    }
}
