/**
 * Main Entry Point - Bore's Adventure
 */
import { Game } from './core/game.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bore\'s Adventure - Starting...');
    
    const canvas = document.getElementById('gameCanvas');
    
    if (!canvas) {
        console.error('Game canvas not found!');
        return;
    }

    // Create and start the game
    const game = new Game(canvas);
    game.start();

    console.log('Game started successfully!');
});
