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
    /**
     * @constructor
     * @param {boolean} _onServer
     * @param {Object} gameConfig
     * @param {Object} [fishGame] - Optional, only on server
     * @returns {Object}
     */
    function FishGameArena (_onServer, gameConfig, fishGame) {
        const onServer = !!_onServer;
        const onClient = !onServer;

        const gameStartTime = Date.now();

        const fishes = {};
        const bullets = {};

        markAsDictionaryNotArray(fishes);
        markAsDictionaryNotArray(bullets);

        let nextId = 0;

        let lastUpdateTime = Date.now();
        let updateInterval;

        let spawnFishTimer;

        if (onServer) {
            updateInterval = setInterval(doUpdate, 1000 / gameConfig.serverTickRate);
        }

        if (onServer) {
            spawnFishTimer = setTimeout(considerSpawningFish, 1000);
        }

        function getGameTime () {
            return Date.now() - gameStartTime;
        }

        function getNextId () {
            // Consider: We could increment nextId but return a base-62 string, which would get longer more slowly!
            return nextId++;
        }

        /*
        function spawnBullet (ownerId, location, angle) {
            // Bullets can only be spawned by clients
            if (onClient) {
                const bullet = {
                    id: ownerId + ':' + getNextId(),
                    owner: ownerId,
                    position: location,
                    velocity: [gameConfig.defaultBulletSpeed * Math.cos(angle), gameConfig.defaultBulletSpeed * Math.sin(angle)],
                };
                addBullet(bullet);
                // @todo: Inform the server.  The server will inform other clients.
                return bullet;
            }
        }
        */

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
            if (bullets[bullet.id]) {
                throw Error("A bullet with id " + bullet.id + " already exists!")
            }
            bullets[bullet.id] = bullet;
        }

        function addFish (fish) {
            fishes[fish.id] = fish;
        }

        function updateEverything (deltaTime) {
            for (let fishId in fishes) {
                moveFish(fishes[fishId], deltaTime);
            }
            for (let bulletId in bullets) {
                moveBullet(bullets[bulletId], deltaTime);
            }
        }

        function doUpdate () {
            const timeNow = Date.now();
            const deltaTime = timeNow - lastUpdateTime;
            updateEverything(deltaTime);
            lastUpdateTime = timeNow;
        }

        function moveBullet (bullet, deltaTime) {
            bullet.position[0] += bullet.velocity[0] * deltaTime / 1000;
            bullet.position[1] += bullet.velocity[1] * deltaTime / 1000;
            // Bounce off edges
            if (bullet.position[0] < gameConfig.ARENA_LEFT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = gameConfig.ARENA_LEFT + (gameConfig.ARENA_LEFT - bullet.position[0]);
            }
            if (bullet.position[0] > gameConfig.ARENA_RIGHT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = gameConfig.ARENA_RIGHT - (bullet.position[0] - gameConfig.ARENA_RIGHT);
            }
            if (bullet.position[1] < gameConfig.ARENA_BOTTOM) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = gameConfig.ARENA_BOTTOM + (gameConfig.ARENA_BOTTOM - bullet.position[1]);
            }
            if (bullet.position[1] > gameConfig.ARENA_TOP) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = gameConfig.ARENA_TOP - (bullet.position[1] - gameConfig.ARENA_TOP);
            }
        }

        function moveFish (fish, deltaTime) {
            // @todo
        }

        function getState () {
            return {
                fishes: fishes,
                bullets: bullets,
            };
        }

        function considerSpawningFish () {
            if (fishes.length < gameConfig.maxFishOnScreen) {
                console.log("Spawning a fish group");
                const POINT_RIGHT = 0;
                const POINT_LEFT = Math.PI;

                const numInGroup = 2;

                // @todo Choose fish layout etc. from gameConfig
                const fishType = Math.floor(Math.random() * 4);

                const motionPatternGroup = 'simple';
                const motionPatternId = Math.floor(Math.random() * gameConfig.fishMotions[motionPatternGroup].length);

                for (let i = 0; i < numInGroup; i++) {
                    const position = [-20, (gameConfig.ARENA_BOTTOM + gameConfig.ARENA_TOP) / 2 + 40 * (i - numInGroup/2 + 0.5)];
                    const fish = {
                        id: 'f' + getNextId(),
                        position: position,
                        angle: POINT_RIGHT,
                        motionPatternGroup: motionPatternGroup,
                        motionPatternId: motionPatternId,
                        motionPatternBit: 0,
                        bitStartTime: getGameTime(),
                        //bitStartPosition: position,
                    };
                    addFish(fish);
                    // @todo: Inform the clients.  The server will inform other clients.
                    fishGame.informAllClients.fishAppeared(fish.id, fish.position, fishType, fish.bitStartTime, motionPatternGroup, motionPatternId);
                }
            }

            const delayToNext = Math.floor(2000 + Math.random() * (1000 + 12 * 10 * fishes.length));
            console.log(`Waiting ${delayToNext / 1000} seconds for the next spawn.`);
            spawnFishTimer = setTimeout(considerSpawningFish, delayToNext);
        }

        function closeArena () {
            if (onServer) {
                clearInterval(updateInterval);
                clearTimeout(spawnFishTimer);
            }
        }

        function markAsDictionaryNotArray (obj) {
            Object.defineProperty(obj, 'length', {
                get: function () {
                    //throw Error("You cannot access my length.  I am not an Array!");
                    // Or maybe we can access it.
                    // But this is a little inefficient.
                    return Object.keys(this).length;
                },
            });
        }

        return {
            getGameTime: getGameTime,
            spawnFish: spawnFish,
            addBullet: addBullet,
            addFish: addFish,
            updateEverything: updateEverything,
            getState: getState,
            getFishes: () => fishes,
            getBullets: () => bullets,
            closeArena: closeArena,
        };
    }

    return FishGameArena;
}));