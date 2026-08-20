/**
 * Main Entry Point - Initializes and starts the game
 */
import Game from './core/Game.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Bore\'s Adventure...');
    
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Create and start the game immediately (no start screen)
    const game = new Game(canvas);
    game.start().catch(err => {
        console.error('Failed to start game:', err);
    });
    
    console.log('Game starting...');
});
