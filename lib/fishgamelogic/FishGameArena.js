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
     * @param {boolean} onServer
     * @param {Object} gameConfig
     * @param {Object} [fishGame] - Optional, only on server, allows this arena to send messages to players' clients
     * @param {number} [_gameStartTime] - Optional, the time the game started (according to Date of the local environment)
     * @returns {Object}
     */
    function FishGameArena (onServer, gameConfig, fishGame, _gameStartTime) {
        const onClient = !onServer;

        const gameStartTime = _gameStartTime || Date.now();

        const fishes = {};
        const bullets = {};
        const players = {};

        markAsDictionaryNotArray(fishes);
        markAsDictionaryNotArray(bullets);
        markAsDictionaryNotArray(players);

        let numberOfGoldFish = 0;

        // When was the last update started (in game time)
        let lastUpdateTime = getGameTime();
        // When did the current update start (in game time)
        let currentTime;

        function getGameTime () {
            return Date.now() - gameStartTime;
        }

        function spawnPlayer (playerId, playerName, playerSlot, startingScore) {
            return addPlayer(playerId, playerName, playerSlot, 0, 0, startingScore);
        }

        function addPlayer (playerId, playerName, playerSlot, gunAngle, gunId, startingScore) {
            const cannonPosition = gameConfig.cannonPositions[playerSlot];

            const player = {
                id: playerId,
                name: playerName,
                slot: playerSlot,
                cannonPosition: cannonPosition,
                gunAngle: gunAngle,
                gunId: gunId,
                score: startingScore,
            };

            if (!cannonPosition) {
                throw Error("Player spawned with cannonPosition=" + cannonPosition);
            }

            players[playerId] = player;

            return player;
        }

        function hasPlayer (playerId) {
            return getPlayer(playerId) != null;
        }

        function getPlayer (playerId) {
            return players[playerId];
        }

        function removePlayer (playerId) {
            delete players[playerId];
        }

        function spawnFish (fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId) {
            const fishClass = getFishClass(fishType);

            return addFish(fishType, fishId, position, angle, motionPatternGroup, motionPatternId, 0, fishSpawnTime, fishClass.health);
        }

        function addFish (fishType, fishId, position, angle, motionPatternGroup, motionPatternId, motionPatternBit, bitStartTime, fishHealth) {
            const fish = {
                type: fishType,
                id: fishId,
                position: position,
                angle: angle,
                motionPatternGroup: motionPatternGroup,
                motionPatternId: motionPatternId,
                motionPatternBit: motionPatternBit,
                bitStartTime: bitStartTime,
                //bitStartPosition: position,
                health: fishHealth,
            };

            fishes[fish.id] = fish;

            const fishClass = getFishClass(fishType);
            if (fishClass.tier === 2) {
                numberOfGoldFish++;
            }

            return fish;
        }

        function getFish (fishId) {
            return fishes[fishId];
        }

        function removeFish (fishId) {
            const fish = getFish(fishId);
            if (!fish) {
                console.warn(`Cannot remove fish '${fishId}' - it is not in the arena!`);
                return;
            }
            const fishClass = getFishClass(fish.type);
            if (fishClass.tier === 2) {
                numberOfGoldFish--;
            }

            delete fishes[fishId];
        }

        function spawnBullet (ownerId, bulletId, gunId, angle, startTime) {
            const bulletSpeed = gameConfig.defaultBulletSpeed;
            const velocity = [bulletSpeed * Math.cos(angle), bulletSpeed * Math.sin(angle)];

            const position = getPlayer(ownerId).cannonPosition.slice(0);

            // Let the bullet start from the muzzle of the cannon
            const cannonLength = 54;
            position[0] += cannonLength * Math.cos(angle);
            position[1] += cannonLength * Math.sin(angle);

            return addBullet(ownerId, bulletId, gunId, position, velocity);
        }

        function addBullet (ownerId, bulletId, gunId, position, velocity) {
            if (bullets[bulletId]) {
                throw Error("A bullet with id " + bulletId + " already exists!")
            }

            const bullet = {
                id: bulletId,
                ownerId: ownerId,
                gunId: gunId,
                position: position,
                velocity: velocity,
            };

            setBulletRotationFromVelocity(bullet);

            bullets[bulletId] = bullet;

            return bullet;
        }

        function getBullet (bulletId) {
            return bullets[bulletId];
        }

        function removeBullet (bulletId) {
            delete bullets[bulletId];
        }

        function setBulletRotationFromVelocity (bullet) {
            bullet.angle = Math.atan2(bullet.velocity[0], bullet.velocity[1]);
        }

        function updateEverything () {
            currentTime = getGameTime();
            const deltaTime = currentTime - lastUpdateTime;

            for (let fishId in fishes) {
                moveFish(fishes[fishId], deltaTime);
            }
            for (let bulletId in bullets) {
                moveBullet(bullets[bulletId], deltaTime);
            }

            lastUpdateTime = currentTime;
            return deltaTime;
        }

        function moveBullet (bullet, deltaTime) {
            bullet.position[0] += bullet.velocity[0] * deltaTime / 1000;
            bullet.position[1] += bullet.velocity[1] * deltaTime / 1000;
            // Bounce off edges
            if (bullet.position[0] < gameConfig.ARENA_LEFT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = gameConfig.ARENA_LEFT + (gameConfig.ARENA_LEFT - bullet.position[0]);
                setBulletRotationFromVelocity(bullet);
            }
            if (bullet.position[0] > gameConfig.ARENA_RIGHT) {
                bullet.velocity[0] = -bullet.velocity[0];
                bullet.position[0] = gameConfig.ARENA_RIGHT - (bullet.position[0] - gameConfig.ARENA_RIGHT);
                setBulletRotationFromVelocity(bullet);
            }
            if (bullet.position[1] < gameConfig.ARENA_BOTTOM) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = gameConfig.ARENA_BOTTOM + (gameConfig.ARENA_BOTTOM - bullet.position[1]);
                setBulletRotationFromVelocity(bullet);
            }
            if (bullet.position[1] > gameConfig.ARENA_TOP) {
                bullet.velocity[1] = -bullet.velocity[1];
                bullet.position[1] = gameConfig.ARENA_TOP - (bullet.position[1] - gameConfig.ARENA_TOP);
                setBulletRotationFromVelocity(bullet);
            }
        }

        function moveFish (fish, deltaTime) {
            if (lastUpdateTime < fish.bitStartTime) {
                // This can happen rarely if a fish arrives earlier than expected (e.g. due to network decongestion).
                // Ideally we would rewind the fish a bit, so that he is in the correct position.
                // But that is too complicated, so we just leave him static for a frame or two, until we can start moving him.
                //console.info(`Temporarily freezing fish ${fish.id} for ${deltaTime}ms because he arrived early.`)
                return;
            }
            const motionPattern = gameConfig.fishMotions[fish.motionPatternGroup][fish.motionPatternId];
            let timeToSpend = deltaTime;
            let fishLastUpdate = lastUpdateTime;
            while (timeToSpend > 0) {
                const motionPatternBit = motionPattern[fish.motionPatternBit];
                const bitEndTime = fish.bitStartTime + 1000 * motionPatternBit.duration;
                //console.log(`Moving ${fish.id} ("${fish.type}") along ${fish.motionPatternGroup}[${fish.motionPatternId}] ${fish.motionPatternBit} / ${motionPattern.length} ${Math.round(100 * (currentTime - fish.bitStartTime) / (bitEndTime - fish.bitStartTime))}%`);
                if (currentTime < bitEndTime) {
                    // Perform a partial movement along this bit
                    applyPatternBitMotion(fish, motionPatternBit, timeToSpend);
                    timeToSpend = 0;
                    fishLastUpdate = currentTime;
                    break;
                } else {
                    // Based on the time, the fish will complete this bit and start another one.
                    // Apply all of the rest of this bit
                    const timeToFinishBit = bitEndTime - fishLastUpdate;
                    applyPatternBitMotion(fish, motionPatternBit, timeToFinishBit);
                    // Select next bit
                    fish.motionPatternBit = (fish.motionPatternBit + 1) % motionPattern.length;
                    fish.bitStartTime = bitEndTime;
                    timeToSpend -= timeToFinishBit;
                    fishLastUpdate = bitEndTime;
                    // Continue the while loop
                }
            }
        }

        function applyPatternBitMotion (fish, patternBit, deltaTime) {
            const deltaAngle = -patternBit.angle * Math.PI/180 * deltaTime / patternBit.duration / 1000;
            const fishClass = getFishClass(fish.type);
            const patternBitSpeedRatio = typeof patternBit.speedRatio === 'number' ? patternBit.speedRatio : 1.0;
            const distance = fishClass.speed * patternBitSpeedRatio * deltaTime / 1000;
            // To approximate moving in an arc, we use the angle half way between the old and new direction
            // This is still not 100% accurate.  Fish in a higher tickrate environment will move slightly further, because those with a low tickrate will be taking a more jagged route.  However this error should be minimal.
            // For better sync between client and server, we could calculate the motion as an arc, not as a straight line.  The only error this would leave us is miniscule floating-point errors.
            // For perfect sync between client and server, we should calculate the arc not from the last known position, but from the bitStartTime and bitStartPosition (rewind and replay).
            const halfwayAngle = fish.angle + deltaAngle / 2;
            fish.position[0] += distance * Math.cos(halfwayAngle);
            fish.position[1] += distance * Math.sin(halfwayAngle);
            fish.angle += deltaAngle;
            //console.log("fish.position: ", fish.position);
        }

        function changePlayerScore (playerId, scoreChange) {
            const player = getPlayer(playerId);
            player.score += scoreChange;
        }

        function reachedMaxGoldFish () {
            return numberOfGoldFish >= gameConfig.maximumGoldFish;
        }

        function getFishClass (fishType) {
            return gameConfig.fishClasses[fishType];
        }

        function getGunClass (gunId) {
            return gameConfig.gunClasses[gunId];
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

        return {
            getGameTime: getGameTime,

            spawnPlayer: spawnPlayer,
            addPlayer: addPlayer,
            hasPlayer: hasPlayer,
            getPlayer: getPlayer,
            getPlayers: () => players,
            removePlayer: removePlayer,

            spawnFish: spawnFish,
            addFish: addFish,
            getFish: getFish,
            getFishes: () => fishes,
            removeFish: removeFish,

            spawnBullet: spawnBullet,
            addBullet: addBullet,
            getBullet: getBullet,
            getBullets: () => bullets,
            removeBullet: removeBullet,

            updateEverything: updateEverything,
            changePlayerScore: changePlayerScore,
            reachedMaxGoldFish: reachedMaxGoldFish,

            getFishClass: getFishClass,
            getGunClass: getGunClass,
        };
    }

    return FishGameArena;
}));