/**
 * Asset Manager - Phase 1
 * Handles loading and caching of all game assets
 */

export class AssetManager {
    constructor() {
        this.images = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
        this.onProgress = null;
        this.onComplete = null;
    }

    /**
     * Add an image to be loaded
     * @param {string} key - Unique identifier for the asset
     * @param {string} src - Path to the image file
     */
    addImage(key, src) {
        if (!this.images.has(key)) {
            this.images.set(key, { src, img: null, loaded: false });
            this.totalCount++;
        }
    }

    /**
     * Load all registered images
     * @returns {Promise} - Resolves when all images are loaded
     */
    loadAll() {
        return new Promise((resolve, reject) => {
            const imagesArray = Array.from(this.images.entries());
            let loaded = 0;

            if (imagesArray.length === 0) {
                resolve();
                return;
            }

            imagesArray.forEach(([key, asset]) => {
                const img = new Image();
                
                img.onload = () => {
                    asset.img = img;
                    asset.loaded = true;
                    loaded++;
                    this.loadedCount = loaded;

                    if (this.onProgress) {
                        this.onProgress(loaded, this.totalCount);
                    }

                    if (loaded >= this.totalCount) {
                        if (this.onComplete) {
                            this.onComplete();
                        }
                        resolve();
                    }
                };

                img.onerror = (e) => {
                    console.error(`Failed to load image: ${key} (${asset.src})`, e);
                    asset.loaded = true; // Mark as loaded to continue
                    loaded++;
                    this.loadedCount = loaded;

                    if (loaded >= this.totalCount) {
                        resolve();
                    }
                };

                img.src = asset.src;
            });
        });
    }

    /**
     * Get a loaded image by key
     * @param {string} key - The asset key
     * @returns {HTMLImageElement|null}
     */
    getImage(key) {
        const asset = this.images.get(key);
        return asset && asset.loaded ? asset.img : null;
    }

    /**
     * Check if an image is loaded
     * @param {string} key - The asset key
     * @returns {boolean}
     */
    isLoaded(key) {
        const asset = this.images.get(key);
        return asset && asset.loaded;
    }

    /**
     * Get loading progress
     * @returns {number} - Progress from 0 to 1
     */
    getProgress() {
        if (this.totalCount === 0) return 1;
        return this.loadedCount / this.totalCount;
    }

    /**
     * Clear all loaded assets
     */
    clear() {
        this.images.clear();
        this.loadedCount = 0;
        this.totalCount = 0;
    }
}

// Singleton instance
export const assetManager = new AssetManager();
