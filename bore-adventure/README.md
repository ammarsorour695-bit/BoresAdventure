# Bore's Adventure

A 2D adventure game built with vanilla JavaScript and HTML5 Canvas.

## Phase 1: Game Engine Foundation ✅

### Features Implemented

- **Game Loop**: Proper delta-time based update/render loop
- **Input System**: Keyboard input handling (WASD + Arrow Keys)
- **Asset Manager**: Image loading and caching system
- **Camera System**: Follows player with world bounds clamping
- **Tilemap Renderer**: Renders 16x16 tile-based maps
- **Sprite System**: Reusable sprite class with animation support
- **Animation System**: Frame-based animations with timing control
- **Entity System**: Base entity class for all game objects
- **Player (Bore)**: Fully animated player character
- **NPC System**: Non-player characters with dialogue
- **Dialogue System**: Typewriter-style dialogue with UI
- **Interaction System**: E-key interaction with NPCs
- **World System**: Manages map, entities, and collision

### Controls

- **WASD** or **Arrow Keys**: Move Bore
- **E**: Interact with NPCs
- **Space/Enter**: Advance dialogue

### Project Structure

```
bore-adventure/
├── index.html          # Main HTML entry point
├── css/
│   ├── main.css       # Core styles
│   └── ui.css         # UI component styles
├── js/
│   ├── main.js        # Entry point
│   ├── core/
│   │   ├── Game.js           # Main game orchestrator
│   │   ├── GameLoop.js       # Game loop with delta time
│   │   ├── Input.js          # Input handling
│   │   ├── Camera.js         # Camera system
│   │   ├── AssetManager.js   # Asset loading/caching
│   │   └── constants.js      # Game configuration
│   ├── rendering/
│   │   ├── Sprite.js         # Base sprite class
│   │   ├── Animation.js      # Animation system
│   │   └── TilemapRenderer.js # Tile-based map rendering
│   ├── entities/
│   │   ├── Entity.js         # Base entity class
│   │   ├── Player.js         # Player character (Bore)
│   │   └── NPC.js            # Non-player characters
│   ├── systems/
│   │   ├── DialogueSystem.js     # Dialogue management
│   │   └── InteractionSystem.js  # Player interactions
│   └── world/
│       └── World.js          # World management
└── assets/
    └── [Kenney RPG Urban tiles]
```

### How to Run

1. Start a local HTTP server in the `bore-adventure` directory:
   ```bash
   cd bore-adventure
   python3 -m http.server 8080
   ```

2. Open your browser to: `http://localhost:8080`

3. Click "Start Game" to begin!

### Current State

- ✅ Bore can move around with smooth animations
- ✅ Camera follows Bore
- ✅ Collision detection with walls/obstacles
- ✅ 3 NPCs placed in the world with unique dialogue
- ✅ Interaction system working (press E near NPCs)
- ✅ Dialogue system with typewriter effect
- ✅ Depth sorting for entities
- ✅ Debug info display (FPS, position)

### Next Phases (To Be Implemented)

- **Phase 2**: Proper tilemap data from Kenney assets
- **Phase 3**: Character sprite animations using actual assets
- **Phase 4-6**: City world creation
- **Phase 7-11**: Objects, quests, missions, inventory
- **Phase 12-15**: Save system, story expansion

## Assets

Uses the Kenney RPG Urban asset pack (tile_0000.png through tile_0485.png).
All tiles are 16x16 pixels with 1px spacing.

## License

Game code: MIT License
Assets: Kenney.nl (CC0 1.0 Universal)
