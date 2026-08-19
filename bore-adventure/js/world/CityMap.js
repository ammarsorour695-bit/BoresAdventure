/**
 * City Map Generator - Phase 6
 * Creates a structured city layout with roads, buildings, and decorations
 */

import { CONFIG } from '../core/constants.js';

export class CityMapGenerator {
    constructor() {
        this.tileSize = CONFIG.TILE_SIZE;
        this.mapWidthTiles = 100;  // 100 tiles * 16px = 1600px wide
        this.mapHeightTiles = 100; // 100 tiles * 16px = 1600px tall
    }

    /**
     * Generate the city map data
     * @returns {{ground: number[][], collision: number[][], objects: Array}}
     */
    generate() {
        const groundLayer = [];
        const collisionLayer = [];
        const objects = [];

        // Initialize empty layers
        for (let y = 0; y < this.mapHeightTiles; y++) {
            const groundRow = [];
            const collisionRow = [];
            
            for (let x = 0; x < this.mapWidthTiles; x++) {
                // Default to grass
                groundRow.push(1); // Grass tile
                collisionRow.push(0); // Walkable
            }
            
            groundLayer.push(groundRow);
            collisionLayer.push(collisionRow);
        }

        // Create main road (horizontal through center)
        this.createRoad(groundLayer, collisionLayer, 45, 5, 95, 9);

        // Create secondary road (vertical)
        this.createRoad(groundLayer, collisionLayer, 30, 5, 30, 95);

        // Create another vertical road
        this.createRoad(groundLayer, collisionLayer, 70, 5, 70, 95);

        // Create sidewalks along main road
        this.createSidewalk(groundLayer, 44, 5, 96, 6);
        this.createSidewalk(groundLayer, 44, 9, 96, 10);

        // Place buildings in different zones
        this.placeBuilding(groundLayer, collisionLayer, objects, 10, 10, 8, 6, 'house');
        this.placeBuilding(groundLayer, collisionLayer, objects, 50, 15, 10, 8, 'shop');
        this.placeBuilding(groundLayer, collisionLayer, objects, 75, 20, 12, 7, 'apartment');
        this.placeBuilding(groundLayer, collisionLayer, objects, 15, 50, 9, 7, 'house');
        this.placeBuilding(groundLayer, collisionLayer, objects, 55, 55, 11, 8, 'cafe');
        this.placeBuilding(groundLayer, collisionLayer, objects, 80, 60, 10, 9, 'store');
        this.placeBuilding(groundLayer, collisionLayer, objects, 35, 75, 8, 6, 'house');

        // Create a park area
        this.createPark(groundLayer, collisionLayer, objects, 5, 25, 20, 20);

        // Add trees along streets
        this.addStreetTrees(objects, 30, 5, 30, 45);
        this.addStreetTrees(objects, 70, 5, 70, 45);
        this.addStreetTrees(objects, 45, 10, 95, 10);

        // Add some decorative objects
        this.addDecorations(objects);

        return {
            ground: groundLayer,
            collision: collisionLayer,
            objects: objects,
            width: this.mapWidthTiles * this.tileSize,
            height: this.mapHeightTiles * this.tileSize
        };
    }

    /**
     * Create a road segment
     */
    createRoad(ground, collision, x1, y1, x2, y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (y >= 0 && y < ground.length && x >= 0 && x < ground[0].length) {
                    // Road tile (using tile ID 51-60 range for roads)
                    ground[y][x] = 51 + Math.floor(Math.random() * 3);
                    collision[y][x] = 0; // Roads are walkable
                }
            }
        }
    }

    /**
     * Create a sidewalk
     */
    createSidewalk(ground, x1, y1, x2, y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (y >= 0 && y < ground.length && x >= 0 && ground[0].length) {
                    // Sidewalk tile
                    ground[y][x] = 71; // Sidewalk tile ID
                }
            }
        }
    }

    /**
     * Place a building
     */
    placeBuilding(ground, collision, objects, x, y, width, height, type) {
        // Mark building footprint as collidable
        for (let by = y; by < y + height; by++) {
            for (let bx = x; bx < x + width; bx++) {
                if (by >= 0 && by < ground.length && bx >= 0 && bx < ground[0].length) {
                    ground[by][bx] = 101; // Building base tile
                    collision[by][bx] = 1; // Solid
                }
            }
        }

        // Add building object for rendering/interaction
        objects.push({
            type: 'building',
            buildingType: type,
            x: x * this.tileSize,
            y: y * this.tileSize,
            width: width * this.tileSize,
            height: height * this.tileSize,
            tileId: type === 'house' ? 101 : type === 'shop' ? 110 : 120
        });
    }

    /**
     * Create a park area
     */
    createPark(ground, collision, objects, x, y, width, height) {
        for (let py = y; py < y + height; py++) {
            for (let px = x; px < x + width; px++) {
                if (py >= 0 && py < ground.length && px >= 0 && px < ground[0].length) {
                    // Park grass (slightly different shade)
                    ground[py][px] = 2;
                    collision[py][px] = 0; // Walkable
                }
            }
        }

        // Add some trees in the park
        objects.push({ type: 'tree', x: (x + 5) * this.tileSize, y: (y + 5) * this.tileSize, tileId: 201 });
        objects.push({ type: 'tree', x: (x + 10) * this.tileSize, y: (y + 8) * this.tileSize, tileId: 201 });
        objects.push({ type: 'tree', x: (x + 15) * this.tileSize, y: (y + 12) * this.tileSize, tileId: 201 });
        
        // Add a bench
        objects.push({ 
            type: 'bench', 
            x: (x + 8) * this.tileSize, 
            y: (y + 10) * this.tileSize, 
            tileId: 250,
            interactable: true,
            dialogue: ['Nice bench to rest on.', 'The view from here is peaceful.']
        });
    }

    /**
     * Add trees along a street
     */
    addStreetTrees(objects, x1, y1, x2, y2) {
        const isVertical = x1 === x2;
        const start = isVertical ? Math.min(y1, y2) : Math.min(x1, x2);
        const end = isVertical ? Math.max(y1, y2) : Math.max(x1, x2);
        const fixedPos = isVertical ? x1 : y1;

        // Place trees every 8 tiles
        for (let i = start; i <= end; i += 8) {
            const tx = isVertical ? fixedPos : i;
            const ty = isVertical ? i : fixedPos;
            
            objects.push({
                type: 'tree',
                x: tx * this.tileSize,
                y: ty * this.tileSize,
                tileId: 201
            });
        }
    }

    /**
     * Add decorative objects throughout the city
     */
    addDecorations(objects) {
        // Street lamps
        objects.push({ type: 'lamp', x: 32 * this.tileSize, y: 11 * this.tileSize, tileId: 220 });
        objects.push({ type: 'lamp', x: 68 * this.tileSize, y: 11 * this.tileSize, tileId: 220 });
        objects.push({ type: 'lamp', x: 47 * this.tileSize, y: 11 * this.tileSize, tileId: 220 });

        // Trash cans
        objects.push({ 
            type: 'trash_can', 
            x: 33 * this.tileSize, 
            y: 10 * this.tileSize, 
            tileId: 230,
            interactable: true,
            dialogue: ['Just a trash can.', 'Nothing interesting here.']
        });

        // Mailbox near houses
        objects.push({
            type: 'mailbox',
            x: 18 * this.tileSize,
            y: 17 * this.tileSize,
            tileId: 240,
            interactable: true,
            dialogue: ['A mailbox full of letters.', 'Wonder what bills are inside...']
        });

        // Sign posts
        objects.push({
            type: 'sign',
            x: 46 * this.tileSize,
            y: 12 * this.tileSize,
            tileId: 260,
            interactable: true,
            dialogue: ['Welcome to Downtown!', 'Population: Growing']
        });

        objects.push({
            type: 'sign',
            x: 8 * this.tileSize,
            y: 27 * this.tileSize,
            tileId: 260,
            interactable: true,
            dialogue: ['City Park', 'Open 24/7 - Enjoy Nature!']
        });
    }
}
