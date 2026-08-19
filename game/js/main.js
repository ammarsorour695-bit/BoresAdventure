/**
 * Bore's Adventure - Main Entry Point
 */
import { Game } from './core/Game.js';

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', () => {
    console.log('Bore\'s Adventure - Loading...');
    const game = new Game();
    console.log('Game initialized successfully!');
});
