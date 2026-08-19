/**
 * Collision System
 * Handles all collision detection for entities
 */
export class CollisionSystem {
    constructor() {
        this.map = null;
    }

    setMap(map) {
        this.map = map;
    }

    checkCollision(x, y, width, height, worldBounds) {
        // World bounds collision
        if (x < 0 || x + width > worldBounds.width ||
            y < 0 || y + height > worldBounds.height) {
            return true;
        }

        // Map collision (if map is set)
        if (this.map && this.map.checkCollision) {
            return this.map.checkCollision(x, y, width, height);
        }

        return false;
    }

    checkEntityCollision(entity1, entity2) {
        return entity1.x < entity2.x + entity2.width &&
               entity1.x + entity1.width > entity2.x &&
               entity1.y < entity2.y + entity2.height &&
               entity1.y + entity1.height > entity2.y;
    }

    distanceToEntity(entity1, entity2) {
        const cx1 = entity1.x + entity1.width / 2;
        const cy1 = entity1.y + entity1.height / 2;
        const cx2 = entity2.x + entity2.width / 2;
        const cy2 = entity2.y + entity2.height / 2;
        
        const dx = cx1 - cx2;
        const dy = cy1 - cy2;
        
        return Math.sqrt(dx * dx + dy * dy);
    }

    isInRange(entity1, entity2, range) {
        return this.distanceToEntity(entity1, entity2) < range;
    }
}
