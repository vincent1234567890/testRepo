"use strict";

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.FishGameArena = factory();
    }
}(this, function () {
    function FishGameArena (_onServer) {
        const ARENA_LEFT = 0;
        const ARENA_RIGHT = 1400;
        const ARENA_BOTTOM = 0;
        const ARENA_TOP = 900;

        const onServer = !!_onServer;
        const onClient = !onServer;

        const gameStartTime = Date.now();

        const fishes = {};
        const bullets = {};

        let nextId = 0;

        function getGameTime () {
            return Date.now() - gameStartTime;
        }

        function getNextId () {
            // Consider: We could increment nextId but return a base-62 string, which would get longer more slowly!
            return nextId++;
        }

        function spawnBullet (ownerId, location, angle) {
            // Bullets can only be spawned by clients
            if (onClient) {
                const DEFAULT_BULLET_SPEED = 80;
                const bullet = {
                    id: 'b' + getNextId(),
                    owner: ownerId,
                    position: location,
                    velocity: [DEFAULT_BULLET_SPEED * Math.cos(angle), DEFAULT_BULLET_SPEED * Math.sin(angle)],
                };
                addBullet(bullet);
                // @todo: Inform the server.  The server will inform other clients.
                return bullet;
            }
        }

        function spawnFish (location, angle, speed, motionPattern) {
            // Fish can only be spawned by the server
            if (onServer) {
                const fish = {
                    id: 'f' + getNextId(),
                    position: location,
                    velocity: [speed * Math.cos(angle), speed * Math.sin(angle)],
                    motionPattern: motionPattern,
                    patternI: 0,
                    startPattern: getGameTime(),
                };
                addFish(fish);
                // @todo: Inform the clients.  The server will inform other clients.
                return fish;
            }
        }

        function addBullet (bullet) {
            bullets[bullet.id] = bullet;
        }

        function addFish (fish) {
            fishes[fish.id] = fish;
        }

        function updateEverything (deltaTime) {
            for (let fishId in fishes) {
                moveFish(fishes[fishId]);
            }
            for (let bulletId in bullets) {
                moveBullet(bullets[bulletId]);
            }
        }

        function moveBullet (bullet, deltaTime) {
            bullet.position[0] += bullet.velocity[0] * deltaTime / 1000;
            bullet.position[1] += bullet.velocity[1] * deltaTime / 1000;
            // Bounce off edges
            if (bullet.position[0] < ARENA_LEFT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = ARENA_LEFT + (ARENA_LEFT - bullet.position[0]);
            }
            if (bullet.position[0] > ARENA_RIGHT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = ARENA_RIGHT - (bullet.position[0] - ARENA_RIGHT);
            }
            if (bullet.position[1] < ARENA_BOTTOM) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = ARENA_BOTTOM + (ARENA_BOTTOM - bullet.position[1]);
            }
            if (bullet.position[1] > ARENA_TOP) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = ARENA_TOP - (bullet.position[1] - ARENA_TOP);
            }
        }

        function moveFish (fish, deltaTime) {
            // @todo
        }

        return {
            spawnBullet: spawnBullet,
            spawnFish: spawnFish,
            addBullet: addBullet,
            addFish: addFish,
            updateEverything: updateEverything,
        };
    }

    return FishGameArena;
}));