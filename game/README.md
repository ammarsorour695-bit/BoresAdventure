# Bore's Adventure

An adventure game built with vanilla JavaScript where you play as Bore exploring a new city.

## Project Structure

```
game/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Game styles
├── src/
│   ├── main.js            # Entry point
│   ├── core/              # Core game systems
│   │   ├── constants.js   # Game constants
│   │   ├── input.js       # Input handling
│   │   ├── assetManager.js # Asset loading
│   │   ├── map.js         # Tile-based map system
│   │   ├── camera.js      # Camera system
│   │   └── game.js        # Main game class
│   ├── entities/          # Game entities
│   │   ├── entity.js      # Base entity class
│   │   ├── player.js      # Player character
│   │   └── npc.js         # Non-player characters
│   └── utils/             # Utilities
│       ├── missions.js    # Mission system
│       └── dialogue.js    # Dialogue system
└── assets/
    └── tiles/             # Tile images (486 tiles)
```

## How to Play

1. **Start the game**: Open `index.html` in a web browser using a local server
2. **Movement**: Use Arrow Keys or WASD to move Bore around the city
3. **Interaction**: Press E to talk to NPCs when nearby
4. **Dialogue**: Press SPACE or ENTER to advance dialogue

## Features

- **Open World City**: Explore a procedurally generated city with roads, buildings, parks
- **Mission System**: Complete quests given by NPCs
- **Dialogue System**: Talk to various characters with typewriter text effect
- **Camera Following**: Smooth camera that follows the player
- **Collision Detection**: Walkable and solid tiles
- **Animated Characters**: Simple bobbing animation while moving

## Missions

1. **First Day in Town** - Meet your neighbors (talk to 3 people)
2. **Grocery Run** - Help Mrs. Johnson
3. **Lost Cat** - Find the missing cat in the park
4. **Coffee Delivery** - Deliver coffee downtown
5. **City Tour** - Visit all landmarks

## Running the Game

You need to serve the files with a local web server due to ES6 module security restrictions:

### Option 1: Python
```bash
cd game
python -m http.server 8000
```

### Option 2: Node.js (with http-server)
```bash
npm install -g http-server
cd game
http-server
```

Then open `http://localhost:8000` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move |
| E | Interact/Talk |
| SPACE / ENTER | Advance dialogue |

## Technical Details

- Pure JavaScript (ES6 Modules)
- Canvas-based rendering
- Tile-based map system (16x16 pixel tiles)
- No external dependencies or game engines
- Uses 486 tile assets for varied terrain

## Future Enhancements

This is Chunk 1 of the game. Future chunks could add:
- More missions and storylines
- Inventory system
- Save/Load functionality
- Sound effects and music
- More NPC types and behaviors
- Mini-games
- Weather system
- Day/night cycle
