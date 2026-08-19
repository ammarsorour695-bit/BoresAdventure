import { CONSTANTS, GAME_STATE } from './constants.js';
import { InputHandler } from './input.js';
import { AssetManager } from './assetManager.js';
import { GameMap } from './map.js';
import { Camera } from './camera.js';
import { Player } from '../entities/player.js';
import { NPC } from '../entities/npc.js';
import { MissionManager, MISSIONS } from '../utils/missions.js';
import { DialogueSystem, DIALOGUES } from '../utils/dialogue.js';

/**
 * Main Game Class - Orchestrates all game systems
 */
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = CONSTANTS.CANVAS_HEIGHT;

        this.state = GAME_STATE.MENU;
        this.lastTime = 0;
        this.deltaTime = 0;

        // Initialize systems
        this.input = new InputHandler();
        this.assetManager = new AssetManager();
        this.camera = new Camera(CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
        this.missionManager = new MissionManager();
        this.dialogueSystem = new DialogueSystem();

        // Game objects
        this.map = null;
        this.player = null;
        this.npcs = [];

        // UI elements
        this.uiElements = {
            missionText: document.getElementById('mission-text'),
            dialogueBox: document.getElementById('dialogue-box'),
            dialogueText: document.getElementById('dialogue-text')
        };
    }

    /**
     * Initialize the game
     */
    async init() {
        console.log('Initializing game...');
        
        // Load assets (limited for faster startup)
        await this.assetManager.loadTiles(100);
        await this.assetManager.loadPlayerSprite();

        // Create map
        this.map = new GameMap(100, 100);
        this.map.initialize();

        // Create player at spawn point
        const spawnPoint = this.map.getSpawnPoint();
        this.player = new Player(spawnPoint.x, spawnPoint.y);
        this.camera.setTarget(this.player);
        this.camera.setBounds(0, 0, 
            this.map.width * CONSTANTS.TILE_SIZE, 
            this.map.height * CONSTANTS.TILE_SIZE);

        // Create NPCs
        this.createNPCs();

        // Set initial mission
        this.missionManager.addMission(MISSIONS.FIRST_DAY);
        this.missionManager.setActiveMission('first_day');
        this.updateUI();

        // Start intro dialogue
        setTimeout(() => {
            this.dialogueSystem.startDialogue([
                "You are Bore.",
                "You just moved to this city.",
                "Time to explore and meet your new neighbors!",
                "Use Arrow Keys or WASD to move.",
                "Press E to talk to people."
            ]);
        }, 500);

        console.log('Game initialized!');
    }

    /**
     * Create NPCs around the map
     */
    createNPCs() {
        const npcData = [
            { x: 150, y: 120, name: 'Mrs. Johnson', dialogue: DIALOGUES.ELDERLY_NEIGHBOR, mission: MISSIONS.GROCERY_RUN },
            { x: 200, y: 180, name: 'Shop Keeper', dialogue: DIALOGUES.SHOP_KEEPER },
            { x: 100, y: 200, name: 'Kid', dialogue: DIALOGUES.KID_IN_PARK, mission: MISSIONS.LOST_CAT },
            { x: 250, y: 150, name: 'Business Person', dialogue: DIALOGUES.BUSINESS_PERSON, mission: MISSIONS.COFFEE_DELIVERY },
            { x: 180, y: 100, name: 'Tourist', dialogue: DIALOGUES.TOURIST },
            { x: 220, y: 220, name: 'Officer', dialogue: DIALOGUES.POLICE_OFFICER }
        ];

        for (const data of npcData) {
            const npc = new NPC(data.x, data.y, data.name, data.dialogue, data.mission || null);
            this.npcs.push(npc);
        }
    }

    /**
     * Update game state
     */
    update(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (this.state === GAME_STATE.DIALOGUE) {
            this.dialogueSystem.update(this.deltaTime);
            
            if (this.input.isKeyPressed('Space') || this.input.isKeyPressed('Enter')) {
                this.dialogueSystem.advance();
                
                if (!this.dialogueSystem.isShowing) {
                    this.state = GAME_STATE.PLAYING;
                    this.hideDialogue();
                }
            }
            
            this.input.update();
            return;
        }

        if (this.state !== GAME_STATE.PLAYING) {
            this.input.update();
            return;
        }

        // Update game objects
        this.player.update(this.deltaTime, this.input, this.map);
        this.camera.update(this.deltaTime);

        // Update NPCs
        for (const npc of this.npcs) {
            npc.update(this.deltaTime, this.input, this.map);
        }

        // Check for NPC interactions
        this.checkInteractions();

        // Update mission progress
        this.updateMissionProgress();

        // Handle interaction input
        if (this.input.isKeyPressed('KeyE')) {
            this.tryInteract();
        }

        this.input.update();
    }

    /**
     * Check if player is near an NPC
     */
    checkInteractions() {
        for (const npc of this.npcs) {
            const dx = Math.abs(this.player.x - npc.x);
            const dy = Math.abs(this.player.y - npc.y);
            
            if (dx < 32 && dy < 32 && npc.hasInteraction) {
                // Show interaction prompt (could be enhanced with UI)
            }
        }
    }

    /**
     * Try to interact with nearby NPC
     */
    tryInteract() {
        for (const npc of this.npcs) {
            const dx = Math.abs(this.player.x - npc.x);
            const dy = Math.abs(this.player.y - npc.y);
            
            if (dx < 32 && dy < 32) {
                // Track NPC conversation for mission
                const newNPC = this.missionManager.trackNPCTalk(npc.name);
                
                const dialogue = npc.interact(this.player);
                this.dialogueSystem.startDialogue(dialogue, () => {
                    this.state = GAME_STATE.PLAYING;
                    this.hideDialogue();
                    
                    // Check if we should give next mission
                    if (npc.mission && !npc.missionGiven) {
                        this.missionManager.addMission(npc.mission);
                        this.missionManager.setActiveMission(npc.mission.id);
                    }
                });
                this.state = GAME_STATE.DIALOGUE;
                this.showDialogue();
                this.updateUI();
                break;
            }
        }
    }

    /**
     * Update mission progress based on player actions
     */
    updateMissionProgress() {
        const mission = this.missionManager.getCurrentMission();
        if (!mission) return;

        // Check position-based completion (reach, deliver, explore missions)
        if (this.missionManager.checkPositionCompletion(this.player.x, this.player.y)) {
            this.completeCurrentMission();
            return;
        }

        // Check if current mission is complete (talk missions)
        if (mission.checkComplete?.()) {
            this.completeCurrentMission();
        }

        this.updateUI();
    }

    /**
     * Complete the current mission
     */
    completeCurrentMission() {
        const mission = this.missionManager.getCurrentMission();
        if (mission) {
            this.missionManager.completeMission(mission.id);
            this.dialogueSystem.startDialogue([
                "Mission Complete!",
                `${mission.title} - Great job! You're settling in nicely.`
            ]);
            this.state = GAME_STATE.DIALOGUE;
            this.showDialogue();
            
            // Update to next mission's UI
            setTimeout(() => {
                const nextMission = this.missionManager.getCurrentMission();
                if (nextMission) {
                    this.dialogueSystem.startDialogue([
                        "New Mission Available!",
                        nextMission.description
                    ]);
                } else {
                    this.dialogueSystem.startDialogue([
                        "Congratulations!",
                        "You've completed all missions!",
                        "You're now a true member of this city!"
                    ]);
                }
                this.state = GAME_STATE.DIALOGUE;
                this.showDialogue();
            }, 1000);
        }
    }

    /**
     * Render the game
     */
    render() {
        // Clear screen
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const offset = this.camera.getOffset();

        // Render map
        if (this.map) {
            this.map.render(this.ctx, offset.x, offset.y, this.assetManager);
        }

        // Render NPCs
        for (const npc of this.npcs) {
            if (this.camera.isVisible(npc.x, npc.y, npc.width, npc.height)) {
                npc.render(this.ctx, offset.x, offset.y);
            }
        }

        // Render player
        if (this.player) {
            this.player.render(this.ctx, offset.x, offset.y);
        }

        // Render dialogue if active
        if (this.state === GAME_STATE.DIALOGUE && this.dialogueSystem.isShowing) {
            this.renderDialogue();
        }
    }

    /**
     * Render dialogue box
     */
    renderDialogue() {
        const text = this.dialogueSystem.getDisplayText(this.deltaTime);
        if (this.uiElements.dialogueText) {
            this.uiElements.dialogueText.textContent = text;
        }
    }

    /**
     * Show dialogue UI
     */
    showDialogue() {
        if (this.uiElements.dialogueBox) {
            this.uiElements.dialogueBox.classList.remove('hidden');
        }
    }

    /**
     * Hide dialogue UI
     */
    hideDialogue() {
        if (this.uiElements.dialogueBox) {
            this.uiElements.dialogueBox.classList.add('hidden');
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const mission = this.missionManager.getCurrentMission();
        if (this.uiElements.missionText && mission) {
            this.uiElements.missionText.textContent = `${mission.title} - ${mission.description}`;
        } else if (this.uiElements.missionText) {
            this.uiElements.missionText.textContent = 'Explore the city!';
        }
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime) {
        this.update(currentTime);
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    /**
     * Start the game
     */
    start() {
        this.init().then(() => {
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.gameLoop(time));
        });
    }
}
