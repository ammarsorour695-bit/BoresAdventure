# Bore's Adventure

An adventure game built with vanilla JavaScript where you play as Bore exploring a new city.

## 🎮 Quick Start

**No framework used!** This is pure vanilla JavaScript with ES6 modules - no React, no Vite, no build tools needed.

### Deploy to Vercel

1. Push this `game` folder to a GitHub repository
2. Import the repository in Vercel
3. Set the **Root Directory** to `game` (the folder containing index.html)
4. Deploy!

### Local Development

You need a local web server due to ES6 module security restrictions:

#### Option 1: Python (Recommended)
```bash
cd game
python -m http.server 8000
```

#### Option 2: Node.js with serve
```bash
cd game
npx serve .
```

Then open `http://localhost:8000` in your browser.

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

The game uses ES6 modules which require a web server to run properly. This is a browser security feature, not a bug!

### Important: No Framework Used!
This game is built with **pure vanilla JavaScript** - no React, no Vue, no Vite, no Webpack. It's just clean, modular JavaScript code that runs directly in the browser.

### Option 1: Python (Easiest)
```bash
cd game
python -m http.server 8000
```

### Option 2: Node.js with npx serve
```bash
cd game
npx serve .
```

### Option 3: VS Code Live Server
If you use VS Code, install the "Live Server" extension and click "Go Live" on index.html.

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
