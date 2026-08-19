/**
 * World - Phase 1 & 6
 * Manages the game world, maps, and entities
 */

import { CONFIG } from '../core/constants.js';
import { TilemapRenderer } from '../rendering/TilemapRenderer.js';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { CityMapGenerator } from './CityMap.js';

export class World {
    constructor() {
        this.tilemap = new TilemapRenderer();
        this.entities = [];
        this.npcs = [];
        this.worldObjects = [];
        this.width = CONFIG.WORLD_WIDTH;
        this.height = CONFIG.WORLD_HEIGHT;
        
        // Player reference
        this.player = null;
        
        // Generate the city map
        this.createCityMap();
    }

    /**
     * Create the city map using the CityMapGenerator
     */
    createCityMap() {
        const generator = new CityMapGenerator();
        const mapData = generator.generate();
        
        // Add ground layer to tilemap
        this.tilemap.addLayer(mapData.ground, 'ground');
        this.tilemap.setCollisionLayer(mapData.collision);
        
        // Store world objects (trees, benches, signs, etc.)
        this.worldObjects = mapData.objects || [];
        
        // Update world dimensions
        this.width = mapData.width;
        this.height = mapData.height;
        
        // Create player at starting position (near the park entrance)
        this.player = new Player(200, 200);
        this.entities.push(this.player);
        
        // Add NPCs in logical locations
        this.createNPCs();
    }

    /**
     * Create NPCs for the city
     */
    createNPCs() {
        // Mrs. Johnson - Standing near her house
        const mrsJohnson = new NPC({
            x: 250,
            y: 180,
            name: 'Mrs. Johnson',
            direction: 'down',
            dialogue: [
                "Oh hello dear! You must be Bore.",
                "Welcome to our lovely neighborhood!",
                "I just moved here myself last month.",
                "Have you explored the town yet? The park is lovely this time of year!"
            ]
        });
        this.npcs.push(mrsJohnson);
        this.entities.push(mrsJohnson);
        
        // Old Man Smith - Walking near the park
        const oldManSmith = new NPC({
            x: 150,
            y: 350,
            name: 'Old Man Smith',
            direction: 'right',
            movementPattern: ['left', 'right', 'idle'],
            moveInterval: 3000,
            dialogue: [
                "Back in my day, this city was much smaller.",
                "Now there are buildings everywhere!",
                "But I suppose progress is inevitable.",
                "Enjoy your stay, young one."
            ]
        });
        this.npcs.push(oldManSmith);
        this.entities.push(oldManSmith);
        
        // Cafe Barista - Standing by the cafe
        const barista = new NPC({
            x: 900,
            y: 900,
            name: 'Cafe Barista',
            direction: 'down',
            dialogue: [
                "Welcome to Joe's Cafe!",
                "Best coffee in the city, if I do say so myself.",
                "Feeling tired from all that moving?",
                "A fresh cup might be just what you need!"
            ]
        });
        this.npcs.push(barista);
        this.entities.push(barista);
        
        // Young Girl - Playing in the park
        const youngGirl = new NPC({
            x: 200,
            y: 500,
            name: 'Lily',
            direction: 'up',
            movementPattern: ['up', 'down', 'left', 'right', 'idle'],
            moveInterval: 2000,
            dialogue: [
                "Hi! Are you new here?",
                "I love playing in this park!",
                "There's so much to explore!",
                "Maybe we can be friends!"
            ]
        });
        this.npcs.push(youngGirl);
        this.entities.push(youngGirl);
    }

    /**
     * Update all entities in the world
     * @param {number} dt - Delta time in milliseconds
     * @param {import('../core/Input.js').InputHandler} input 
     */
    update(dt, input) {
        // Update player
        if (this.player) {
            this.player.update(dt, input, { width: this.width, height: this.height });
        }
        
        // Update NPCs
        for (const npc of this.npcs) {
            npc.update(dt, input, { width: this.width, height: this.height });
        }
    }

    /**
     * Render the world
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} cameraX 
     * @param {number} cameraY 
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     */
    render(ctx, cameraX, cameraY, canvasWidth, canvasHeight) {
        // Render tilemap
        this.tilemap.render(ctx, cameraX, cameraY, canvasWidth, canvasHeight);
        
        // Render all entities (sorted by Y for depth)
        const sortedEntities = [...this.entities].sort((a, b) => {
            return (a.y + a.height) - (b.y + b.height);
        });
        
        for (const entity of sortedEntities) {
            entity.render(ctx, cameraX, cameraY);
        }
    }

    /**
     * Check collision at a world position
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    checkCollision(x, y) {
        return this.tilemap.isCollidable(x, y);
    }

    /**
     * Find nearest interactable NPC
     * @param {Player} player 
     * @returns {NPC|null}
     */
    findNearestInteractable(player) {
        for (const npc of this.npcs) {
            if (player.isInInteractionRange(npc)) {
                return npc;
            }
        }
        return null;
    }

    /**
     * Get all NPCs
     * @returns {NPC[]}
     */
    getNPCs() {
        return this.npcs;
    }

    /**
     * Get player
     * @returns {Player|null}
     */
    getPlayer() {
        return this.player;
    }
}
