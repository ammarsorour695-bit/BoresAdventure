/**
 * Constants - Phase 1
 * Game configuration and constants
 */

export const CONFIG = {
    // Canvas dimensions
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Tile settings (from Kenney asset pack)
    TILE_SIZE: 16,
    TILE_MARGIN: 0,
    TILE_SPACING: 1,
    
    // Player settings
    PLAYER_SPEED: 120, // pixels per second
    PLAYER_WIDTH: 32,
    PLAYER_HEIGHT: 48,
    
    // Animation settings
    ANIMATION_FPS: 8,
    FRAME_DURATION: 1000 / 8, // milliseconds per frame
    
    // Interaction
    INTERACTION_RANGE: 50,
    
    // World
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 2000,
    
    // Debug
    DEBUG_MODE: false,
};

// Direction constants
export const DIRECTION = {
    DOWN: 'down',
    UP: 'up',
    LEFT: 'left',
    RIGHT: 'right',
};

// Game states
export const GAME_STATE = {
    LOADING: 'loading',
    START_SCREEN: 'start_screen',
    PLAYING: 'playing',
    DIALOGUE: 'dialogue',
    PAUSED: 'paused',
};
