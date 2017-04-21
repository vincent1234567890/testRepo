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
    const GOLDEN_FISH_TIER = 100;

    /**
     * @constructor
     * @param {boolean} onServer
     * @param {Object} gameConfig
     * @param {Object} [fishingRoom] - Optional, only on server, allows this arena to send messages to players' clients
     * @param {Number} [_gameStartTime] - Optional, the time the game started (according to Date of the local environment)
     * @param {Number} [_consumptionInThisGame] - Optional, the total consumption spent by players during this game
     * @returns {Object}
     */
    function FishGameArena (onServer, gameConfig, fishingRoom, _gameStartTime, _consumptionInThisGame) {
        const onClient = !onServer;

        let gameStartTime = _gameStartTime || Date.now();

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

        let currentRoundNumber = 0;
        let currentArenaMode = 'init';
        let gameTimeWhenModeChanged = -1;

        let consumptionInThisGame = _consumptionInThisGame || 0;

        function getGameTime () {
            return Date.now() - gameStartTime;
        }

        /**
         * This should only be used sparingly, when consistent lag or decongestion has been detected.
         * It will momentarily cause fish to pause, or to speed up/jump forwards!
         *
         * @param {Number} delta - milliseconds.  Positive will momentarily slow the game down (increase delay relative to other simulations), negative will speed it up (decrease delay)
         */
        function shiftGameTime (delta) {
            gameStartTime += delta;
        }

        function addPlayer (playerId, playerDisplayName, playerSlot, gunAngle, gunId, startingScore) {
            const cannonPosition = gameConfig.cannonPositions[playerSlot];

            const player = {
                id: playerId,
                name: playerDisplayName,     // Note that this is NOT the playerData.name
                slot: playerSlot,
                cannonPosition: cannonPosition,
                gunAngle: gunAngle,
                gunId: gunId,
                score: startingScore,
                bulletsOnScreen: 0,
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

        function addFish (fishType, fishId, offsetFromGroup, angle, motionPatternGroup, motionPatternId, motionPatternBit, fishSpawnTime, fishHealth, lastUpdateTime, fishSpeed) {
            const fishClass = getFishClass(fishType);
            if (fishSpeed === undefined) {
                fishSpeed = fishClass.speed;
            }

            const fish = {
                type: fishType,
                id: fishId,
                position: [-1000, -1000],
                offsetFromGroup: offsetFromGroup,
                angle: angle,
                motionPatternGroup: motionPatternGroup,
                motionPatternId: motionPatternId,
                motionPatternBit: motionPatternBit,
                spawnTime: fishSpawnTime,
                //bitStartTime: bitStartTime,
                //bitStartPosition: position,
                lastUpdateTime: lastUpdateTime,
                speed: fishSpeed,

                // These things are only really needed on the server
                // (it wastes bandwidth, and it leaks information, to send them to the client)
                health: fishHealth,
                initialHealth: fishHealth,
                hitsReceived: 0,
                damageReceived: 0,
                consumptionAbsorbed: 0,
            };

            fishes[fish.id] = fish;

            if (fishClass.tier === GOLDEN_FISH_TIER) {
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
            if (fishClass.tier === GOLDEN_FISH_TIER) {
                numberOfGoldFish--;
            }

            delete fishes[fishId];
        }

        function addBullet (ownerId, bulletId, gunId, bulletCost, angle, startTime, targetLockFishId) {
            const arenaPlayer = getPlayer(ownerId);
            arenaPlayer.bulletsOnScreen++;

            const bulletSpeed = gameConfig.defaultBulletSpeed;
            const velocity = [bulletSpeed * Math.cos(angle), bulletSpeed * Math.sin(angle)];

            const position = arenaPlayer.cannonPosition.slice(0);

            // Let the bullet start from the muzzle of the cannon
            const cannonLength = 54;
            position[0] += cannonLength * Math.cos(angle);
            position[1] += cannonLength * Math.sin(angle);

            if (bullets[bulletId]) {
                throw Error("A bullet with id " + bulletId + " already exists!")
            }

            const bullet = {
                id: bulletId,
                ownerId: ownerId,
                gunId: gunId,
                bulletCost: bulletCost,
                position: position,
                velocity: velocity,
                createTime: startTime,
                lastUpdateTime: startTime,
                targetFish: targetLockFishId,
            };

            setBulletRotationFromVelocity(bullet);

            bullets[bulletId] = bullet;

            return bullet;
        }

        function getBullet (bulletId) {
            return bullets[bulletId];
        }

        function removeBullet (bulletId) {
            const bullet = getBullet(bulletId);
            const arenaPlayer = getPlayer(bullet.ownerId);
            if (arenaPlayer) {
                arenaPlayer.bulletsOnScreen--;
            }

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
            const timeToSpend = currentTime - bullet.lastUpdateTime;
            //const timeToSpend = deltaTime;
            // Bullet has arrived on client early.  Let is hover at current position.  Better than rewinding to previous position where it never was!
            if (timeToSpend < 0) {
                return;
            }
            if (bullet.targetFish) {
                const targetFish = getFish(bullet.targetFish);
                if (targetFish) {
                    const fishPos = targetFish.position;
                    const bulletPos = bullet.position;
                    const bulletSpeed = gameConfig.defaultBulletSpeed;
                    const desiredAngle = Math.atan2(fishPos[1] - bulletPos[1], fishPos[0] - bulletPos[0]);
                    // We could slowly turn towards that angle
                    // But at the moment we point immediately towards that angle
                    bullet.velocity[0] = bulletSpeed * Math.cos(desiredAngle);
                    bullet.velocity[1] = bulletSpeed * Math.sin(desiredAngle);
                    setBulletRotationFromVelocity(bullet);
                }
            }
            bullet.position[0] += bullet.velocity[0] * timeToSpend / 1000;
            bullet.position[1] += bullet.velocity[1] * timeToSpend / 1000;
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
            bullet.lastUpdateTime = currentTime;
        }

        function moveFish (fish, deltaTime) {
            if (currentTime <= fish.lastUpdateTime) {
                // This can happen rarely if a fish arrives earlier than expected (e.g. due to network decongestion).
                // Ideally we would rewind the fish a bit, so that he is in the correct position.
                // But that is too complicated, so we just leave him static for a frame or two, until we can start moving him.
                //console.info(`Temporarily freezing fish ${fish.id} for ${deltaTime}ms because he arrived early.`)
                return;
            }
            const motionPattern = gameConfig.fishMotions[fish.motionPatternGroup][fish.motionPatternId];

            const relativeSpeed = fish.speed / 100;
            const timeSinceSpawn = currentTime - fish.spawnTime;
            let tPath = relativeSpeed * timeSinceSpawn / motionPattern.duration / 1000;

            const fishAreScattering = currentArenaMode === 'clearing_for_free_shooting_game' && gameTimeWhenModeChanged >= 0;
            if (fishAreScattering) {
                const timeBetweenSpawnAndModeChange = gameTimeWhenModeChanged - fish.spawnTime;
                const timeSinceModeChanged = currentTime - gameTimeWhenModeChanged;

                // This is the speed this fish should aim towards during the clearing stage
                // We cap the lowest speed, so even the large slow fish will leave relatively quickly
                let targetRelativeSpeed = Math.max(2.0 * relativeSpeed, 1.5);
                // We also increase the speed for fish on longer paths
                if (motionPattern.duration > 10) {
                    targetRelativeSpeed *= motionPattern.duration / 10;
                }

                // But we do not apply the target speed immediately: we work up to it gently (and might even go beyond it)
                const relativeSpeedToApply = relativeSpeed + (targetRelativeSpeed - relativeSpeed) * timeSinceModeChanged / 10000;

                tPath = (relativeSpeed * timeBetweenSpawnAndModeChange + relativeSpeedToApply * timeSinceModeChanged) / motionPattern.duration / 1000;
            }

            fish.pathProgress = tPath;
            if (tPath >= 1) {
                fish.hasCompletedPath = true;
            }

            let tPathToRender = tPath;
            if (tPathToRender < 0) {
                tPathToRender = 0;
            } else if (tPathToRender >= 1) {
                tPathToRender = 1 - 0.0000001;
            }

            const points = motionPattern.points;
            const numSegments = (motionPattern.points.length - 1) / 3;
            const whichCurve = Math.floor(tPathToRender * numSegments);
            const tCurve = tPathToRender * numSegments - whichCurve;

            const i = whichCurve * 3;

            // @todo Re-use p and pAhead objects for performance?
            const p = getBezierPointAt(
                points[i    ].x, points[i    ].y,
                points[i + 1].x, points[i + 1].y,
                points[i + 2].x, points[i + 2].y,
                points[i + 3].x, points[i + 3].y,
                tCurve
            );

            const pAhead = getBezierPointAt(
                points[i    ].x, points[i    ].y,
                points[i + 1].x, points[i + 1].y,
                points[i + 2].x, points[i + 2].y,
                points[i + 3].x, points[i + 3].y,
                tCurve + 0.000000001
            );
            fish.angle = Math.atan2(pAhead.y - p.y, pAhead.x - p.x);

            fish.position[0] = p.x + fish.offsetFromGroup[0];
            fish.position[1] = p.y + fish.offsetFromGroup[1];

            fish.lastUpdateTime = currentTime;
        }

        function getBezierPointAt (x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, t, p) {
            p = p || {};
            const at = 1 - t;
            p.x = at*at*at*x0 + 3*at*at*t*cp1x + 3*at*t*t*cp2x + t*t*t*x1;
            p.y = at*at*at*y0 + 3*at*at*t*cp1y + 3*at*t*t*cp2y + t*t*t*y1;
            // More techniques are available here: https://en.wikipedia.org/wiki/Cubic_Hermite_spline
            // This is Cubic Hermite over a single interval
            //const m0x = cp1x - x0;
            //const m1x = x1 - cp2x;
            //const m0y = cp1y - y0;
            //const m1y = y1 - cp2y;
            //p.x = (2*t*t*t - 3*t*t + 1)*x0 + (t*t*t - 2*t*t + t)*m0x + (-2*t*t*t + 3*t*t)*x1 + (t*t*t - t*t)*m1x;
            //p.y = (2*t*t*t - 3*t*t + 1)*y0 + (t*t*t - 2*t*t + t)*m0y + (-2*t*t*t + 3*t*t)*y1 + (t*t*t - t*t)*m1y;
            return p;
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

        function canSwitchGun () {
            return currentArenaMode !== 'clearing_for_free_shooting_game' && currentArenaMode !== 'free_shooting_game';
        }



        return {
            getGameTime: getGameTime,
            shiftGameTime: shiftGameTime,
            getArenaStartTime: () => gameStartTime,

            getRoundNumber: () => currentRoundNumber,
            getArenaMode: () => currentArenaMode,
            setRoundNumber: newRoundNumber => currentRoundNumber = newRoundNumber,
            incrementRoundNumber: () => ++currentRoundNumber,
            setArenaMode: (newArenaMode, when) => {
                currentArenaMode = newArenaMode;
                gameTimeWhenModeChanged = when || -1;
            },
            getConsumptionInThisGame: () => consumptionInThisGame,
            registerConsumption: amount => consumptionInThisGame += amount,

            addPlayer: addPlayer,
            hasPlayer: hasPlayer,
            getPlayer: getPlayer,
            getPlayers: () => players,
            removePlayer: removePlayer,

            addFish: addFish,
            getFish: getFish,
            getFishes: () => fishes,
            removeFish: removeFish,

            addBullet: addBullet,
            getBullet: getBullet,
            getBullets: () => bullets,
            removeBullet: removeBullet,

            updateEverything: updateEverything,
            changePlayerScore: changePlayerScore,
            reachedMaxGoldFish: reachedMaxGoldFish,

            getFishClass: getFishClass,
            getGunClass: getGunClass,

            canSwitchGun: canSwitchGun,
        };
    }

    return FishGameArena;
}));