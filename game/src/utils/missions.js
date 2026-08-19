/**
 * Mission System - Handles quests and objectives
 */
export class Mission {
    constructor(id, title, description, type, requirements) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type; // 'collect', 'deliver', 'talk', 'explore', 'reach'
        this.requirements = requirements;
        this.isComplete = false;
        this.progress = 0;
        this.reward = null;
        this.npcName = null;
    }

    /**
     * Update mission progress
     */
    updateProgress(amount = 1) {
        if (!this.isComplete) {
            this.progress += amount;
            if (this.progress >= this.requirements.count) {
                this.isComplete = true;
            }
        }
    }

    /**
     * Check if mission is complete
     */
    checkComplete() {
        return this.isComplete || this.progress >= this.requirements.count;
    }

    /**
     * Get progress as a string
     */
    getProgressString() {
        return `${this.progress}/${this.requirements.count}`;
    }

    /**
     * Check if player position completes this mission
     */
    checkPosition(x, y) {
        if (this.type === 'reach' && this.requirements.location) {
            const loc = this.requirements.location;
            const dx = x - loc.x;
            const dy = y - loc.y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        }
        
        if (this.type === 'explore' && this.requirements.area) {
            const area = this.requirements.area;
            return x >= area.x && x <= area.x + area.width &&
                   y >= area.y && y <= area.y + area.height;
        }
        
        if (this.type === 'deliver' && this.requirements.destination) {
            const dest = this.requirements.destination;
            const dx = x - dest.x;
            const dy = y - dest.y;
            return Math.sqrt(dx * dx + dy * dy) < 20;
        }
        
        return false;
    }
}

/**
 * Mission Manager - Tracks all missions
 */
export class MissionManager {
    constructor() {
        this.missions = [];
        this.activeMission = null;
        this.completedMissions = [];
        this.talkedNPCs = new Set();
        this.visitedLocations = new Set();
    }

    /**
     * Add a new mission
     */
    addMission(mission) {
        this.missions.push(mission);
    }

    /**
     * Set the active mission
     */
    setActiveMission(missionId) {
        this.activeMission = this.missions.find(m => m.id === missionId);
    }

    /**
     * Complete a mission
     */
    completeMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (mission) {
            mission.isComplete = true;
            this.completedMissions.push(mission);
            
            // Auto-set next mission if available
            const nextMission = this.getNextMission();
            if (nextMission) {
                this.activeMission = nextMission;
            } else {
                this.activeMission = null;
            }
            
            return mission.reward;
        }
        return null;
    }

    /**
     * Get next available mission
     */
    getNextMission() {
        return this.missions.find(m => !m.isComplete && m !== this.activeMission) || null;
    }

    /**
     * Get current active mission
     */
    getCurrentMission() {
        return this.activeMission;
    }

    /**
     * Get all missions
     */
    getAllMissions() {
        return this.missions;
    }

    /**
     * Get completed missions count
     */
    getCompletedCount() {
        return this.completedMissions.length;
    }

    /**
     * Track NPC conversation for "First Day" mission
     */
    trackNPCTalk(npcName) {
        if (this.activeMission && this.activeMission.type === 'talk') {
            if (!this.talkedNPCs.has(npcName)) {
                this.talkedNPCs.add(npcName);
                this.activeMission.updateProgress(1);
                return true;
            }
        }
        return false;
    }

    /**
     * Check location visit for exploration missions
     */
    trackLocationVisit(locationId) {
        if (!this.visitedLocations.has(locationId)) {
            this.visitedLocations.add(locationId);
            if (this.activeMission && this.activeMission.type === 'explore') {
                this.activeMission.updateProgress(1);
                return true;
            }
        }
        return false;
    }

    /**
     * Check if mission should be completed based on position
     */
    checkPositionCompletion(x, y) {
        if (!this.activeMission || this.activeMission.isComplete) return false;
        
        if (this.activeMission.checkPosition(x, y)) {
            this.activeMission.updateProgress(this.activeMission.requirements.count);
            return true;
        }
        return false;
    }
}

/**
 * Predefined missions for the game
 */
export const MISSIONS = {
    FIRST_DAY: new Mission(
        'first_day',
        'First Day in Town',
        'Explore the city and meet your neighbors. Talk to 3 different people.',
        'talk',
        { count: 3, targets: [] }
    ),
    GROCERY_RUN: new Mission(
        'grocery_run',
        'Grocery Run',
        'Help Mrs. Johnson by visiting the grocery store on Main Street.',
        'reach',
        { count: 1, location: { x: 3200, y: 2400 } }
    ),
    LOST_CAT: new Mission(
        'lost_cat',
        'Find the Lost Cat',
        'Search the park area for the missing cat.',
        'explore',
        { count: 1, area: { x: 1600, y: 1600, width: 800, height: 800 } }
    ),
    COFFEE_DELIVERY: new Mission(
        'coffee_delivery',
        'Coffee Delivery',
        'Deliver coffee to the office building downtown.',
        'deliver',
        { count: 1, destination: { x: 4000, y: 3200 } }
    ),
    CITY_TOUR: new Mission(
        'city_tour',
        'Complete City Tour',
        'Visit all major landmarks in the city.',
        'explore',
        { count: 5, locations: [] }
    )
};
