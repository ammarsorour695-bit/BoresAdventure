/**
 * Main Game Class - Orchestrates all game systems
 */
import AssetManager from './core/AssetManager.js';
import Camera from './core/Camera.js';
import InputHandler from './systems/InputHandler.js';
import TilemapRenderer from './rendering/TilemapRenderer.js';
import Player from './entities/Player.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas to fullscreen
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.isRunning = false;
        this.lastTime = 0;
        
        // Initialize systems
        this.assetManager = new AssetManager();
        this.input = new InputHandler();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        
        console.log('Game initialized, loading assets...');
    }

    async start() {
        // Load all assets first
        await this.assetManager.loadAll();
        console.log('Assets loaded!');
        
        // Create tilemap and player after assets are loaded
        this.tilemap = new TilemapRenderer(this.assetManager);
        this.player = new Player(100, 100); // Start position
        
        console.log('Starting game loop...');
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.camera) {
            this.camera.width = this.canvas.width;
            this.camera.height = this.canvas.height;
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;
        
        const dt = (timestamp - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = timestamp;
        
        this.update(dt);
        this.render();
        
        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(dt) {
        // Update input state
        this.input.update();
        
        // Update player
        this.player.update(dt, this.input, this.tilemap);
        
        // Update camera to follow player
        this.camera.follow(this.player, this.tilemap.getMapWidth(), this.tilemap.getMapHeight());
    }

    render() {
        // Clear screen
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render tilemap
        this.tilemap.render(this.ctx, this.camera);
        
        // Render player
        this.player.render(this.ctx, this.camera, this.assetManager);
        
        // Debug info
        this.renderDebug();
    }

    renderDebug() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${Math.round(1 / ((performance.now() - this.lastTime) / 1000))}`, 10, 20);
        this.ctx.fillText(`Pos: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`, 10, 35);
        this.ctx.fillText(`Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`, 10, 50);
    }

    stop() {
        this.isRunning = false;
    }
}
