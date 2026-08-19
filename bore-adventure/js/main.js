/**
 * Main Entry Point - Bore's Adventure
 * Phase 1: Game Engine Foundation
 */

import { game } from './core/Game.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bore\'s Adventure - Loading...');
    console.log('Phase 1: Game Engine Foundation');
    
    // Game will start when user clicks the start button
});

// Handle page visibility changes (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Game paused - tab hidden');
    } else {
        console.log('Game resumed - tab visible');
    }
});

// Prevent default behavior for game keys
window.addEventListener('keydown', (e) => {
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE'];
    if (gameKeys.includes(e.code)) {
        e.preventDefault();
    }
}, { passive: false });
