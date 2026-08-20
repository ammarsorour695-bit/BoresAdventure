/**
 * Asset Manager - Loads and caches all game assets
 */
export default class AssetManager {
    constructor() {
        this.images = new Map();
        this.tileSize = 16; // From tilemap.txt: 16px tiles
        this.loaded = false;
    }

    async loadAll() {
        const assetPath = 'assets/';
        
        // Load the main tilemap sprite sheet
        await this.loadImage('tilemap', `${assetPath}tilemap.png`);
        
        // Load individual tiles (we'll use these for reference if needed)
        const tilePromises = [];
        for (let i = 0; i < 486; i++) {
            const paddedNum = String(i).padStart(4, '0');
            tilePromises.push(this.loadImage(`tile_${paddedNum}`, `${assetPath}tile_${paddedNum}.png`));
        }
        
        await Promise.all(tilePromises);
        this.loaded = true;
        console.log(`Asset Manager: Loaded ${this.images.size} assets`);
    }

    loadImage(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images.set(name, img);
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`);
                resolve(null); // Don't fail completely, just skip missing assets
            };
            img.src = path;
        });
    }

    getImage(name) {
        return this.images.get(name);
    }

    getTilemap() {
        return this.images.get('tilemap');
    }

    getTile(index) {
        const paddedNum = String(index).padStart(4, '0');
        return this.images.get(`tile_${paddedNum}`);
    }

    getTileSize() {
        return this.tileSize;
    }
}
