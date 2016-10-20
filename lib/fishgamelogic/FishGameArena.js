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
    const options = {
        logFish: true,
    };

    /**
     * @constructor
     * @param {boolean} onServer
     * @param {Object} gameConfig
     * @param {Object} [fishGame] - Optional, only on server, allows this arena to send messages to players' clients
     * @returns {Object}
     */
    function FishGameArena (onServer, gameConfig, fishGame) {
        const onClient = !onServer;

        const ARENA_WIDTH = gameConfig.ARENA_RIGHT - gameConfig.ARENA_LEFT;
        const ARENA_HEIGHT = gameConfig.ARENA_TOP - gameConfig.ARENA_BOTTOM;

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

        let targetDeltaTime;
        let updateIntervalID;
        let spawnFishTimeoutID;

        if (onServer) {
            targetDeltaTime = 1000 / gameConfig.serverTickRate;
            updateIntervalID = setInterval(doUpdate, targetDeltaTime);
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

        function removeFish (fishId) {
            delete fishes[fishId];
        }

        function addBullet (bullet) {
            if (bullets[bullet.id]) {
                throw Error("A bullet with id " + bullet.id + " already exists!")
            }
            bullets[bullet.id] = bullet;
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
            currentTime = getGameTime();
            const deltaTime = currentTime - lastUpdateTime;
            if (deltaTime > 1.2 * targetDeltaTime) {
                console.info("%s Tickrate was not maintained.  %s > %s", Date(), deltaTime, targetDeltaTime);
                // @consider If a tick is too long, we could to setTimeout() the next tick to happen slightly earlier.
                // That should at least keep the average tickrate constant.
            }
            updateEverything(deltaTime);
            lastUpdateTime = currentTime;

            checkForFishOffScreen();
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

        function moveFish (fish, deltaTime) {
            const motionPattern = gameConfig.fishMotions[fish.motionPatternGroup][fish.motionPatternId];
            while (true) {
                const motionPatternBit = motionPattern[fish.motionPatternBit];
                const bitEndTime = fish.bitStartTime + 1000 * motionPatternBit.duration;
                if (currentTime < bitEndTime) {
                    // Perform a partial movement along this bit
                    applyPatternBitMotion(fish, motionPatternBit, deltaTime);
                    break;
                } else {
                    // Based on the time, the fish will complete this bit and start another one.
                    // Apply all of the rest of this bit
                    applyPatternBitMotion(fish, motionPatternBit, bitEndTime - lastUpdateTime);
                    // Select next bit
                    fish.motionPatternBit = (fish.motionPatternBit + 1) % motionPattern.length;
                    fish.bitStartTime = bitEndTime;
                    // Continue the while loop
                }
            }
        }

        function applyPatternBitMotion (fish, patternBit, deltaTime) {
            const deltaAngle = patternBit.angle * Math.PI/180 * deltaTime / patternBit.duration / 1000;
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
                const POINT_RIGHT = 0;
                const POINT_LEFT = Math.PI;

                const numInGroup = 2;

                // @todo Choose fish layout etc. from gameConfig
                //const fishType = Math.floor(Math.random() * 4);
                const fishType = chooseRandomItemFromList(Object.keys(gameConfig.fishClasses));

                if (options.logFish) {
                    console.log(`+ Spawning ${numInGroup} fish of class "${fishType}"`);
                }

                const motionPatternGroup = 'simple';
                const motionPatternId = Math.floor(Math.random() * gameConfig.fishMotions[motionPatternGroup].length);

                for (let i = 0; i < numInGroup; i++) {
                    const fishId = 'f' + getNextId();
                    const position = [-20, (gameConfig.ARENA_BOTTOM + gameConfig.ARENA_TOP) / 2 + 40 * (i - numInGroup/2 + 0.5)];
                    const angle = POINT_RIGHT;
                    const fishSpawnTime = getGameTime();

                    addFish(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);

                    // @todo: Inform the clients.  The server will inform other clients.
                    fishGame.informAllClients.fishAppeared(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);
                }
            }

            const delayToNext = Math.floor(2000 + Math.random() * (1000 + 12 * 10 * fishes.length));
            if (options.logFish) {
                console.log(`: Waiting ${delayToNext / 1000} seconds for the next spawn.`);
            }
            spawnFishTimeoutID = setTimeout(considerSpawningFish, delayToNext);
        }

        function checkForFishOffScreen () {
            // @consider We could actually do this automatically on the clients, since they should agree with the server
            //           Doing it on the server and then sending it to clients is slightly less work for clients per frame
            if (!onServer) {
                return;
            }

            const OFF_LEFT = gameConfig.ARENA_LEFT - ARENA_WIDTH * 0.2;
            const OFF_RIGHT = gameConfig.ARENA_RIGHT + ARENA_WIDTH * 0.2;
            const OFF_BOTTOM = gameConfig.ARENA_BOTTOM - ARENA_HEIGHT * 0.5;
            const OFF_TOP = gameConfig.ARENA_TOP + ARENA_HEIGHT * 0.5;

            for (let fishId in fishes) {
                const fish = fishes[fishId];

                const isOffScreen =
                    fish.position[0] < OFF_LEFT
                    || fish.position[0] > OFF_RIGHT
                    || fish.position[1] < OFF_BOTTOM
                    || fish.position[1] > OFF_TOP;

                if (isOffScreen) {
                    if (options.logFish) {
                        console.log(`- Removing fish ${fishId} ("${fish.type}") because it went off the screen.`);
                    }
                    removeFish(fishId);
                    fishGame.informAllClients.fishLeftArena(fishId);
                }
            }
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
            removeFish: removeFish,
            updateEverything: updateEverything,
            checkCollisions: checkCollisions,
            getState: getState,
            getFishes: () => fishes,
            getBullets: () => bullets,
            closeArena: closeArena,
        };
    }

    return FishGameArena;
}));