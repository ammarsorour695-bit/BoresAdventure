/**
 * Tilemap Renderer - Renders the game world using tile-based graphics
 */
export default class TilemapRenderer {
    constructor(assetManager) {
        this.assetManager = assetManager;
        this.tileSize = assetManager.getTileSize();
        
        // Map dimensions (in tiles)
        this.mapWidth = 50;
        this.mapHeight = 50;
        
        // Tile data: 2D array where each value is a tile index
        this.tiles = [];
        
        // Collision data: true = solid, false = walkable
        this.collisions = [];
        
        this.generateMap();
    }

    generateMap() {
        // Initialize empty map
        this.tiles = [];
        this.collisions = [];
        
        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];
            const collisionRow = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Default to grass (tile index 0 - adjust based on actual tilemap)
                let tileIndex = 0;
                let isSolid = false;
                
                // Simple procedural generation for now
                // Create some roads and buildings
                if (x === Math.floor(this.mapWidth / 2)) {
                    // Vertical road
                    tileIndex = 2; // Road tile
                    isSolid = false;
                } else if (y === Math.floor(this.mapHeight / 2)) {
                    // Horizontal road
                    tileIndex = 2; // Road tile
                    isSolid = false;
                } else if (x > 10 && x < 20 && y > 10 && y < 20) {
                    // Building area
                    tileIndex = 10; // Building/floor tile
                    isSolid = true;
                } else if (x > 30 && x < 40 && y > 30 && y < 40) {
                    // Another building
                    tileIndex = 10;
                    isSolid = true;
                } else {
                    // Grass/ground
                    tileIndex = 0;
                    isSolid = false;
                }
                
                row.push(tileIndex);
                collisionRow.push(isSolid);
            }
            this.tiles.push(row);
            this.collisions.push(collisionRow);
        }
        
        console.log(`Generated ${this.mapWidth}x${this.mapHeight} tilemap`);
    }

    render(ctx, camera) {
        const tilemap = this.assetManager.getTilemap();
        
        if (!tilemap) {
            // Fallback: draw colored rectangles if tilemap not loaded
            this.renderFallback(ctx, camera);
            return;
        }
        
        // Calculate visible tiles based on camera position
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + (camera.width / this.tileSize) + 1;
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = startRow + (camera.height / this.tileSize) + 1;
        
        // Clamp to map bounds
        const clampedStartCol = Math.max(0, startCol);
        const clampedEndCol = Math.min(this.mapWidth, endCol);
        const clampedStartRow = Math.max(0, startRow);
        const clampedEndRow = Math.min(this.mapHeight, endRow);
        
        // Render visible tiles
        for (let y = clampedStartRow; y < clampedEndRow; y++) {
            for (let x = clampedStartCol; x < clampedEndCol; x++) {
                const tileIndex = this.tiles[y][x];
                const screenX = Math.floor(x * this.tileSize - camera.x);
                const screenY = Math.floor(y * this.tileSize - camera.y);
                
                // Draw tile from sprite sheet
                // Assuming tilemap is a grid of 16x16 tiles
                const tilesPerRow = Math.floor(tilemap.width / this.tileSize);
                const tileCol = tileIndex % tilesPerRow;
                const tileRow = Math.floor(tileIndex / tilesPerRow);
                
                ctx.drawImage(
                    tilemap,
                    tileCol * this.tileSize,
                    tileRow * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    screenX,
                    screenY,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    renderFallback(ctx, camera) {
        // Fallback rendering when assets aren't loaded
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + (camera.width / this.tileSize) + 1;
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = startRow + (camera.height / this.tileSize) + 1;
        
        const clampedStartCol = Math.max(0, startCol);
        const clampedEndCol = Math.min(this.mapWidth, endCol);
        const clampedStartRow = Math.max(0, startRow);
        const clampedEndRow = Math.min(this.mapHeight, endRow);
        
        for (let y = clampedStartRow; y < clampedEndRow; y++) {
            for (let x = clampedStartCol; x < clampedEndCol; x++) {
                const tileIndex = this.tiles[y][x];
                const screenX = Math.floor(x * this.tileSize - camera.x);
                const screenY = Math.floor(y * this.tileSize - camera.y);
                
                // Color based on tile type
                if (this.collisions[y][x]) {
                    ctx.fillStyle = '#8B4513'; // Brown for buildings
                } else if (tileIndex === 2) {
                    ctx.fillStyle = '#555'; // Gray for roads
                } else {
                    ctx.fillStyle = '#4a8c3a'; // Green for grass
                }
                
                ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                
                // Grid lines
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }
    }

    isSolid(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        
        if (tileX < 0 || tileX >= this.mapWidth || tileY < 0 || tileY >= this.mapHeight) {
            return true; // Out of bounds is solid
        }
        
        return this.collisions[tileY][tileX];
    }

    getTileSize() {
        return this.tileSize;
    }

    getMapWidth() {
        return this.mapWidth * this.tileSize;
    }

    getMapHeight() {
        return this.mapHeight * this.tileSize;
    }
}
