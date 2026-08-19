/**
 * City Map Generator
 * Creates a structured city layout with roads, buildings, parks, and NPCs
 */
import { NPC } from '../entities/NPC.js';

export class CityMap {
    constructor() {
        this.width = 2000;
        this.height = 2000;
        this.tileSize = 48;
        
        // Map Data
        this.tiles = [];
        this.buildings = [];
        this.objects = [];
        this.npcs = [];
        
        this.generateCity();
    }

    generateCity() {
        // Initialize empty grass map
        for (let y = 0; y < this.height / this.tileSize; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width / this.tileSize; x++) {
                this.tiles[y][x] = { type: 'grass', walkable: true };
            }
        }

        // Create Main Road (horizontal)
        const roadY = Math.floor(this.height / 2);
        for (let x = 0; x < this.width / this.tileSize; x++) {
            this.tiles[roadY][x] = { type: 'road', walkable: true };
            if (roadY + 1 < this.height / this.tileSize) {
                this.tiles[roadY + 1][x] = { type: 'road', walkable: true };
            }
        }

        // Create Secondary Road (vertical)
        const roadX = Math.floor(this.width / 3);
        for (let y = 0; y < this.height / this.tileSize; y++) {
            this.tiles[y][roadX] = { type: 'road', walkable: true };
            if (roadX + 1 < this.width / this.tileSize) {
                this.tiles[y][roadX + 1] = { type: 'road', walkable: true };
            }
        }

        // Add Sidewalks along main road
        for (let x = 0; x < this.width / this.tileSize; x++) {
            if (roadY - 1 >= 0) {
                this.tiles[roadY - 1][x] = { type: 'sidewalk', walkable: true };
            }
            if (roadY + 2 < this.height / this.tileSize) {
                this.tiles[roadY + 2][x] = { type: 'sidewalk', walkable: true };
            }
        }

        // Place Buildings
        this.placeBuilding(100, 100, 150, 120);
        this.placeBuilding(400, 100, 180, 140);
        this.placeBuilding(700, 100, 160, 130);
        this.placeBuilding(1100, 100, 200, 150);
        
        this.placeBuilding(100, 400, 140, 120);
        this.placeBuilding(1100, 400, 170, 140);
        
        this.placeBuilding(100, 700, 160, 130);
        this.placeBuilding(400, 700, 150, 120);
        this.placeBuilding(700, 700, 180, 140);
        this.placeBuilding(1100, 700, 190, 150);
        
        this.placeBuilding(100, 1100, 170, 140);
        this.placeBuilding(500, 1100, 200, 160);
        this.placeBuilding(900, 1100, 180, 150);
        this.placeBuilding(1300, 1100, 160, 130);

        // Create Park Area
        this.createPark(1400, 300, 500, 400);

        // Add Trees and Objects
        this.addTreesAndObjects();

        // Create NPCs
        this.createNPCs();
    }

    placeBuilding(x, y, w, h) {
        this.buildings.push({ x, y, w, h });
        
        // Mark tiles as non-walkable
        const startX = Math.floor(x / this.tileSize);
        const startY = Math.floor(y / this.tileSize);
        const endX = Math.floor((x + w) / this.tileSize);
        const endY = Math.floor((y + h) / this.tileSize);
        
        for (let ty = startY; ty < endY; ty++) {
            for (let tx = startX; tx < endX; tx++) {
                if (ty >= 0 && ty < this.height / this.tileSize && 
                    tx >= 0 && tx < this.width / this.tileSize) {
                    this.tiles[ty][tx] = { type: 'building', walkable: false };
                }
            }
        }
    }

    createPark(x, y, w, h) {
        const startX = Math.floor(x / this.tileSize);
        const startY = Math.floor(y / this.tileSize);
        const endX = Math.floor((x + w) / this.tileSize);
        const endY = Math.floor((y + h) / this.tileSize);
        
        for (let ty = startY; ty < endY; ty++) {
            for (let tx = startX; tx < endX; tx++) {
                if (ty >= 0 && ty < this.height / this.tileSize && 
                    tx >= 0 && tx < this.width / this.tileSize) {
                    this.tiles[ty][tx] = { type: 'park_grass', walkable: true };
                }
            }
        }
        
        // Add park decorations
        this.objects.push({
            type: 'fountain',
            x: x + w/2 - 30,
            y: y + h/2 - 30,
            width: 60,
            height: 60,
            solid: true
        });
    }

    addTreesAndObjects() {
        // Add trees around the park and streets
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * (this.width - 100) + 50;
            const y = Math.random() * (this.height - 100) + 50;
            
            // Check if not on road or building
            const tileX = Math.floor(x / this.tileSize);
            const tileY = Math.floor(y / this.tileSize);
            
            if (tileY >= 0 && tileY < this.tiles.length && 
                tileX >= 0 && tileX < this.tiles[0].length) {
                const tile = this.tiles[tileY][tileX];
                if (tile.type === 'grass' || tile.type === 'park_grass') {
                    this.objects.push({
                        type: 'tree',
                        x, y,
                        width: 40,
                        height: 40,
                        solid: true
                    });
                }
            }
        }
        
        // Add street lamps along roads
        for (let x = 100; x < this.width - 100; x += 200) {
            this.objects.push({
                type: 'street_lamp',
                x: x,
                y: 400,
                width: 20,
                height: 20,
                solid: false
            });
            this.objects.push({
                type: 'street_lamp',
                x: x,
                y: 550,
                width: 20,
                height: 20,
                solid: false
            });
        }
    }

    createNPCs() {
        // Mrs. Johnson - stands near her house
        this.npcs.push(new NPC({
            name: "Mrs. Johnson",
            x: 300,
            y: 250,
            color: '#e74c3c',
            behavior: 'stand',
            dialogue: [
                "Oh hello dear! You must be Bore.",
                "Welcome to our lovely neighborhood.",
                "Have you seen my cat? It ran off towards the park."
            ],
            quest: {
                title: "Find the Cat",
                description: "Look for Mrs. Johnson's cat near the park area.",
                completed: false
            }
        }));

        // Old Man Smith - wanders slowly
        this.npcs.push(new NPC({
            name: "Old Man Smith",
            x: 800,
            y: 500,
            color: '#8e44ad',
            behavior: 'wander',
            speed: 0.5,
            dialogue: [
                "Back in my day, this city was much smaller.",
                "Now there are buildings everywhere!",
                "Hey kid, could you do an old man a favor?"
            ],
            quest: {
                title: "Deliver Letter",
                description: "Take Smith's letter to the shop downtown.",
                completed: false
            }
        }));

        // Cafe Barista - patrols near cafe
        this.npcs.push(new NPC({
            name: "Cafe Barista",
            x: 1200,
            y: 200,
            color: '#27ae60',
            behavior: 'patrol',
            patrolPoints: [
                { x: 1200, y: 200 },
                { x: 1250, y: 200 },
                { x: 1250, y: 250 },
                { x: 1200, y: 250 }
            ],
            speed: 1,
            dialogue: [
                "Welcome to City Cafe!",
                "Best coffee in town, if I do say so myself.",
                "Need any recommendations?"
            ]
        }));

        // Park Visitor
        this.npcs.push(new NPC({
            name: "Park Visitor",
            x: 1600,
            y: 500,
            color: '#f39c12',
            behavior: 'wander',
            speed: 0.8,
            dialogue: [
                "Nice day for a walk, isn't it?",
                "The park is my favorite spot in the city.",
                "Have you checked out the fountain?"
            ]
        }));
    }

    draw(ctx, cameraX, cameraY) {
        // Draw Tiles
        const startCol = Math.floor(cameraX / this.tileSize);
        const endCol = startCol + (800 / this.tileSize) + 1;
        const startRow = Math.floor(cameraY / this.tileSize);
        const endRow = startRow + (600 / this.tileSize) + 1;

        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < this.tiles.length && x >= 0 && x < this.tiles[0].length) {
                    const tile = this.tiles[y][x];
                    const screenX = x * this.tileSize - cameraX;
                    const screenY = y * this.tileSize - cameraY;
                    
                    switch(tile.type) {
                        case 'grass':
                            ctx.fillStyle = '#4a8c3a';
                            break;
                        case 'road':
                            ctx.fillStyle = '#555';
                            break;
                        case 'sidewalk':
                            ctx.fillStyle = '#888';
                            break;
                        case 'park_grass':
                            ctx.fillStyle = '#5a9c4a';
                            break;
                        case 'building':
                            ctx.fillStyle = '#3a3a3a';
                            break;
                        default:
                            ctx.fillStyle = '#4a8c3a';
                    }
                    
                    ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                    
                    // Add road markings
                    if (tile.type === 'road') {
                        ctx.fillStyle = '#ffeb3b';
                        if ((x + y) % 4 === 0) {
                            ctx.fillRect(screenX + 20, screenY + 22, 8, 4);
                        }
                    }
                }
            }
        }

        // Draw Buildings
        ctx.fillStyle = '#8B4513';
        for (const b of this.buildings) {
            if (b.x < cameraX + 800 && b.x + b.w > cameraX &&
                b.y < cameraY + 600 && b.y + b.h > cameraY) {
                // Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect(b.x + 10 - cameraX, b.y + 10 - cameraY, b.w, b.h);
                
                // Building
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(b.x - cameraX, b.y - cameraY, b.w, b.h);
                
                // Roof detail
                ctx.fillStyle = '#6d360e';
                ctx.fillRect(b.x + 10 - cameraX, b.y + 10 - cameraY, b.w - 20, b.h - 20);
            }
        }

        // Draw Objects (trees, lamps, etc.)
        for (const obj of this.objects) {
            if (obj.x < cameraX + 800 && obj.x + obj.width > cameraX &&
                obj.y < cameraY + 600 && obj.y + obj.height > cameraY) {
                
                const screenX = obj.x - cameraX;
                const screenY = obj.y - cameraY;
                
                if (obj.type === 'tree') {
                    // Tree trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(screenX + 15, screenY + 20, 10, 20);
                    // Tree top
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.arc(screenX + 20, screenY + 15, 25, 0, Math.PI * 2);
                    ctx.fill();
                } else if (obj.type === 'street_lamp') {
                    ctx.fillStyle = '#444';
                    ctx.fillRect(screenX + 8, screenY, 4, 20);
                    ctx.fillStyle = '#ffeb3b';
                    ctx.beginPath();
                    ctx.arc(screenX + 10, screenY, 8, 0, Math.PI * 2);
                    ctx.fill();
                } else if (obj.type === 'fountain') {
                    ctx.fillStyle = '#4a90a4';
                    ctx.beginPath();
                    ctx.arc(screenX + 30, screenY + 30, 30, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(screenX + 30, screenY + 30, 10, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    checkCollision(x, y, width, height) {
        const startX = Math.floor(x / this.tileSize);
        const startY = Math.floor(y / this.tileSize);
        const endX = Math.floor((x + width) / this.tileSize);
        const endY = Math.floor((y + height) / this.tileSize);

        for (let ty = startY; ty <= endY; ty++) {
            for (let tx = startX; tx <= endX; tx++) {
                if (ty >= 0 && ty < this.tiles.length && tx >= 0 && tx < this.tiles[0].length) {
                    if (!this.tiles[ty][tx].walkable) {
                        return true;
                    }
                }
            }
        }

        // Check object collisions
        for (const obj of this.objects) {
            if (obj.solid) {
                if (x < obj.x + obj.width && x + width > obj.x &&
                    y < obj.y + obj.height && y + height > obj.y) {
                    return true;
                }
            }
        }

        // Check building collisions
        for (const b of this.buildings) {
            if (x < b.x + b.w && x + width > b.x &&
                y < b.y + b.h && y + height > b.y) {
                return true;
            }
        }

        return false;
    }
}
