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

        // When was the last update started (in game time)
        let lastUpdateTime = getGameTime();
        // When did the current update start (in game time)
        let currentTime;

        let updateIntervalID;
        let spawnFishTimeoutID;

        if (onServer) {
            updateIntervalID = setInterval(doUpdate, 1000 / gameConfig.serverTickRate);
        }

        if (onServer) {
            spawnFishTimeoutID = setTimeout(considerSpawningFish, 1000);
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

        function addFish (fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId) {
            const fish = {
                type: fishType,
                id: fishId,
                position: position,
                angle: angle,
                motionPatternGroup: motionPatternGroup,
                motionPatternId: motionPatternId,
                motionPatternBit: 0,
                bitStartTime: fishSpawnTime,
                //bitStartPosition: position,
            };

            fishes[fish.id] = fish;
        }

        function addBullet (bullet) {
            if (bullets[bullet.id]) {
                throw Error("A bullet with id " + bullet.id + " already exists!")
            }
            bullets[bullet.id] = bullet;
        }

        function updateEverything (deltaTime, currentTime) {
            for (let fishId in fishes) {
                moveFish(fishes[fishId], deltaTime, currentTime);
            }
            for (let bulletId in bullets) {
                moveBullet(bullets[bulletId], deltaTime, currentTime);
            }
        }

        function doUpdate () {
            currentTime = getGameTime();
            const deltaTime = currentTime - lastUpdateTime;
            updateEverything(deltaTime, currentTime);
            lastUpdateTime = currentTime;

            // @todo Check for fish off screen
        }

        function checkCollisions () {
            // @todo ...
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

        function moveFish (fish, deltaTime, currentTime) {
            const motionPattern = gameConfig.fishMotions[fish.motionPatternGroup][fish.motionPatternId];
            const motionPatternBit = motionPattern[fish.motionPatternBit];
            const bitStartTime = fish.bitStartTime;
            const bitEndTime = bitStartTime + 1000 * motionPatternBit.duration;
            const lastUpdateTime = currentTime - deltaTime;
            if (currentTime >= bitEndTime) {
                // Apply the rest of this bit
                applyPatternBitMotion(fish, motionPatternBit, bitEndTime - lastUpdateTime);
                // Select next bit
                // Apply part of next bit
                fish.motionPatternBit = (fish.motionPatternBit + 1) % motionPattern.length;
                const newMotionPatternBit = motionPattern[fish.motionPatternBit];
                // @todo This should really be a while loop, because in theory currentTime could also be past the end of the new bitEndTime!
                //       In practice this will only happen if the motionPatternBit has a very small duration, or the server is overloaded, making the last tick extremely long.
                applyPatternBitMotion(fish, newMotionPatternBit, currentTime - bitStartTime);
            } else {
                applyPatternBitMotion(fish, motionPatternBit, currentTime - lastUpdateTime);
            }
        }

        function applyPatternBitMotion (fish, patternBit, deltaTime) {
            const deltaAngle = patternBit.angle * deltaTime / patternBit.duration / 1000;
            const fishClass = getFishClass(fish.type);
            const patternBitSpeedRatio = typeof patternBit.speedRatio === 'number' ? patternBit.speedRatio : 1.0;
            const distance = fishClass.speed * patternBitSpeedRatio * deltaTime / 1000;
            // To approximate moving in an arc, we use the angle half way between the old and new direction
            // This is still not 100% accurate.  Fish in a higher tickrate environment will move slightly further, because those with a low tickrate will be taking a coarser, more jagged, and therefore longer route.  However this error should be minimal.
            // For better sync between client and server, we could calculate the motion as an arc, not as a straight line.  The only error this would leave us is miniscule floating-point errors.
            // For perfect sync between client and server, we should calculate the arc not from the last known position, but from the bitStartTime and bitStartPosition (rewind and replay).
            const halfwayAngle = fish.angle + deltaAngle / 2;
            fish.position[0] += distance * Math.cos(halfwayAngle);
            fish.position[1] += distance * Math.sin(halfwayAngle);
            fish.angle += deltaAngle;
            //console.log("fish.position: ", fish.position);
        }

        function getFishClass (fishType) {
            return gameConfig.fishClasses[fishType];
        }

        function getState () {
            return {
                gameTime: getGameTime(),
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
                //const fishType = Math.floor(Math.random() * 4);
                const fishType = chooseRandomItemFromList(Object.keys(gameConfig.fishClasses));

                const motionPatternGroup = 'simple';
                const motionPatternId = Math.floor(Math.random() * gameConfig.fishMotions[motionPatternGroup].length);

                for (let i = 0; i < numInGroup; i++) {
                    const fishId = 'f' + getNextId();
                    const position = [-20, (gameConfig.ARENA_BOTTOM + gameConfig.ARENA_TOP) / 2 + 40 * (i - numInGroup/2 + 0.5)];
                    const angle = POINT_RIGHT;
                    const fishSpawnTime = getGameTime();
                    console.log("fishSpawnTime:", fishSpawnTime);

                    addFish(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);

                    // @todo: Inform the clients.  The server will inform other clients.
                    fishGame.informAllClients.fishAppeared(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);
                }
            }

            const delayToNext = Math.floor(2000 + Math.random() * (1000 + 12 * 10 * fishes.length));
            console.log(`Waiting ${delayToNext / 1000} seconds for the next spawn.`);
            spawnFishTimeoutID = setTimeout(considerSpawningFish, delayToNext);
        }

        function closeArena () {
            if (onServer) {
                clearInterval(updateIntervalID);
                clearTimeout(spawnFishTimeoutID);
            }
        }

        // This is used when we access fishes.length (maybe bullets.length in future)
        function markAsDictionaryNotArray (obj) {
            Object.defineProperty(obj, 'length', {
                get: function () {
                    //throw Error("You cannot access my length.  I am not an Array!");
                    // Or maybe we can access it.  But this is a little inefficient.
                    return Object.keys(this).length;
                },
            });
        }

        function chooseRandomItemFromList (list) {
            const i = Math.floor(Math.random() * list.length);
            return list[i];
        }

        return {
            getGameTime: getGameTime,
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