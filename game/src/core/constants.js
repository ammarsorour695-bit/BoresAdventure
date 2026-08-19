/**
 * Game Constants
 */
export const CONSTANTS = {
    TILE_SIZE: 16,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SPEED: 2,
    GRAVITY: 0.5,
    JUMP_FORCE: -8
};

/**
 * Tile Types for the city environment
 */
export const TILE_TYPES = {
    EMPTY: 0,
    GRASS: 1,
    SIDEWALK: 2,
    ROAD: 3,
    BUILDING_WALL: 4,
    BUILDING_WINDOW: 5,
    BUILDING_DOOR: 6,
    TREE: 7,
    WATER: 8,
    BRIDGE: 9,
    ROOF: 10,
    FENCE: 11,
    LAMP_POST: 12,
    BENCH: 13,
    CAR: 14,
    TRASH_CAN: 15
};

/**
 * Direction constants
 */
export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

/**
 * Game States
 */
export const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    DIALOGUE: 'dialogue',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};
