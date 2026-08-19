/**
 * Bore's Adventure - Main Entry Point
 */
import { Game } from './core/Game.js';

// Wait for DOM to load and then initialize game
window.addEventListener('DOMContentLoaded', () => {
    console.log('Bore\'s Adventure - Loading...');
    
    // Check if start button exists
    const startBtn = document.getElementById('start-btn');
    if (!startBtn) {
        console.error('Start button not found in DOM!');
        return;
    }
    
    console.log('Start button found, initializing game...');
    const game = new Game();
    console.log('Game initialized successfully!');
});
