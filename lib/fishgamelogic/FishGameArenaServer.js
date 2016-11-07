"use strict";

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['FishGameArena'], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./FishGameArena'));
    }
    else {
        root.FishGameArenaServer = factory(FishGameArena);
    }
}(this, function (FishGameArena) {
    const options = {
        logFish: true,
        logCollisions: true,

        // If one tick is slow by N ms, wait N fewer ms for the next tick, to maintain the overall tickrate.
        maintainAverageTickRate: true,
    };

    function FishGameArenaServer (onServer, gameConfig, fishGame, _gameStartTime) {
        const superArena = new FishGameArena(onServer, gameConfig, fishGame, _gameStartTime);



        const ARENA_WIDTH = gameConfig.ARENA_RIGHT - gameConfig.ARENA_LEFT;
        const ARENA_HEIGHT = gameConfig.ARENA_TOP - gameConfig.ARENA_BOTTOM;

        let updateTimeoutID;
        let spawnFishTimeoutID;

        let targetDeltaTime = Math.round(1000 / gameConfig.serverTickRate);
        let nextTargetDeltaTime = targetDeltaTime;

        // We don't run a tick timer on the client.  The client itself calls updateEverything() on each frame.
        if (onServer) {
            updateTimeoutID = setTimeout(doUpdate, nextTargetDeltaTime);
        }

        if (onServer) {
            spawnFishTimeoutID = setTimeout(considerSpawningFish, 1000);
        }

        let nextId = 0;

        function getNextId () {
            // Consider: We could increment nextId but return a base-62 string, which would get longer more slowly!
            return nextId++;
        }

        function getState () {
            return {
                gameTime: self.getGameTime(),
                fishes: self.getFishes(),
                bullets: self.getBullets(),
            };
        }

        function considerSpawningFish () {
            const POINT_RIGHT = 0;
            const POINT_LEFT = Math.PI;

            const fishes = self.getFishes();

            if (fishes.length < gameConfig.maxFishOnScreen) {
                const joinSide = Math.random() < 0.5 ? 0 : 1;

                //const fishType = chooseRandomItemFromList(Object.keys(gameConfig.fishClasses));
                //const fishClass = self.getFishClass(fishType);

                let fishType;
                let fishClass;
                while (true) {
                    fishType = chooseRandomFishType();
                    fishClass = self.getFishClass(fishType);
                    if (fishClass.tier === 2 && self.reachedMaxGoldFish()) {
                        //continue;
                    } else {
                        break;
                    }
                }

                const numInGroup = fishClass.minPerGroup + Math.floor((fishClass.maxPerGroup - fishClass.minPerGroup + 1) * Math.random());

                // @todo Random formation

                if (options.logFish) {
                    console.log(`+ Spawning ${numInGroup} fish of class "${fishType}"`);
                }

                const motionPatternGroup = fishClass.motionGroup;
                const motionPatternId = Math.floor(Math.random() * gameConfig.fishMotions[motionPatternGroup].length);

                const spawnX = joinSide === 0
                    ? gameConfig.ARENA_LEFT - fishClass.length - 20
                    : gameConfig.ARENA_RIGHT + fishClass.length + 20;

                const spacing = 2.5 * fishClass.length;
                const centerOfSpawnY = (gameConfig.ARENA_BOTTOM + gameConfig.ARENA_TOP) / 2;

                for (let i = 0; i < numInGroup; i++) {
                    const fishId = 'f' + getNextId();
                    const position = [spawnX, centerOfSpawnY + spacing * (i - numInGroup/2 + 0.5)];
                    const angle = joinSide === 0 ? POINT_RIGHT : POINT_LEFT;
                    const fishSpawnTime = self.getGameTime();

                    self.spawnFish(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);

                    fishGame.informAllClients.fishAppeared(fishType, fishId, position, angle, fishSpawnTime, motionPatternGroup, motionPatternId);
                }
            }

            const delayToNext = gameConfig.delayBetweenSpawningFish
                + fishes.length * gameConfig.extraDelayPerFishOnScreen
                + Math.random() * gameConfig.extraRandomDelay;

            if (options.logFish) {
                console.log(`: Waiting ${delayToNext} seconds for the next spawn.`);
            }
            spawnFishTimeoutID = setTimeout(considerSpawningFish, delayToNext * 1000);
        }

        function doUpdate () {
            const lastTickDeltaTime = self.updateEverything();

            if (lastTickDeltaTime > 1.2 * targetDeltaTime) {
                console.info("! %s Tickrate was not maintained.  %s > %s", Date(), lastTickDeltaTime, targetDeltaTime);
            }

            if (onServer) {
                checkForFishOffScreen();
                checkCollisions();
            }

            // How much later were we called than we requested?
            const latenessMs = lastTickDeltaTime - nextTargetDeltaTime;
            // Pre-emptively compensate by requesting the next callback slightly earlier than our target time
            nextTargetDeltaTime = options.maintainAverageTickRate ? targetDeltaTime - latenessMs : targetDeltaTime;
            updateTimeoutID = setTimeout(doUpdate, nextTargetDeltaTime);
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

            const fishes = self.getFishes();

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
                    self.removeFish(fishId);
                    fishGame.informAllClients.fishLeftArena(fishId);
                }
            }
        }

        function checkCollisions () {
            if (!onServer) {
                return;
            }

            const fishes = self.getFishes();
            const bullets = self.getBullets();

            for (let bulletId in bullets) {
                const bullet = bullets[bulletId];
                const bulletRadius = gameConfig.gunClasses[bullet.gunId].collisionRadius;

                for (let fishId in fishes) {
                    const fish = fishes[fishId];
                    const fishClass = self.getFishClass(fish.type);
                    const fishLength = fishClass.length;
                    const fishBreadth = fishClass.breadth;

                    // For efficiency we first do an initial check to see if the bullet intersects the circle defined by fishLength
                    // This allows us to quickly discard obvious non-collisions
                    // NOTE: This assumes that fishLength is greater than fishBreadth!
                    const maxDist = bulletRadius + fishLength;
                    const distanceSquared = distanceBetweenV2Squared(bullet.position, fish.position);

                    if (distanceSquared < maxDist * maxDist) {
                        // Possible collision

                        // Now we will check if the bullet intersects with the ellipse
                        const normalisedDistanceFromCenter = getEllipseCircleCollision(fish.position, fishLength, fishBreadth, fish.angle, bullet.position, bulletRadius);

                        const vectorIsInsideEllipse = normalisedDistanceFromCenter < 1;

                        if (vectorIsInsideEllipse) {
                            // Collision!
                            const collisionPosition = [bullet.position[0], bullet.position[1]];

                            // @consider The bullet position is sometimes far inside the fish, or only slighty inside the fish, depending on the luck of the server tick
                            // This might mean a direct hit will do less damage than a hit on the side, which can potentially penetrate closer to the center of the fish.
                            // If we want to be fair and accurate, we should rewind the path of the bullet until its edge only just intersects with the fish.
                            // But for now we are accepting this as a random contribution.

                            handleCollision(bullet, fish, collisionPosition);
                        }
                    }
                }
            }
        }

        function handleCollision (bullet, collisionFish, explosionPosition) {
            const gunClass = self.getGunClass(bullet.gunId);
            const explosionRadius = gunClass.explosionRadius;
            const bulletDamage = gunClass.damage;
            const gunMultiplier = gunClass.scoreMultiplier;

            // Inform clients of explosion
            fishGame.informAllClients.bulletExploded(bullet.id, explosionPosition);

            const fishCaughtEvents = [];

            const fishes = self.getFishes();

            // Harm fishes in splash radius
            for (let fishId in fishes) {
                const fish = fishes[fishId];

                const fishClass = self.getFishClass(fish.type);
                const maxDist = explosionRadius + fishClass.length;

                const distanceSquared = distanceBetweenV2Squared(explosionPosition, fish.position);
                if (distanceSquared < maxDist * maxDist) {
                    const penetrationIntoFish = 1.0 - getEllipseCircleCollision(fish.position, fishClass.length, fishClass.breadth, fish.angle, explosionPosition, explosionRadius);

                    const damageDealt = Math.round(bulletDamage * penetrationIntoFish);

                    if (damageDealt > 0) {
                        fish.health -= damageDealt;

                        if (options.logCollisions) {
                            console.log(`x Bullet ${bullet.id} radius ${explosionRadius} hit fish ${fish.id} with damage ${damageDealt} at distance ${Math.sqrt(distanceSquared).toFixed(1)}`);
                        }

                        // Inform clients of damage to this fish
                        fishGame.informAllClients.fishWasHit(fishId, damageDealt);

                        // If the fish dies, award player for the frag
                        if (fish.health <= 0) {
                            const fishValue = self.getFishClass(fish.type).value;

                            const scoreChange = fishValue * gunMultiplier;

                            if (options.logCollisions) {
                                console.log(`$ Player ${bullet.ownerId} caught fish "${fish.type}" for ${scoreChange} credits (before multiplier)`);
                            }

                            self.removeFish(fishId);

                            fishCaughtEvents.push({
                                f: fishId,
                                s: scoreChange,
                            });
                        }
                    }
                }
            }

            const numberOfFishCaught = fishCaughtEvents.length;
            if (numberOfFishCaught > 0) {
                const scoreMultiplier = getValueFromListTruncated(gameConfig.multiCatchMultipliers, numberOfFishCaught - 1);

                let totalScoreChange = 0;
                for (let fishCaughtEvent of fishCaughtEvents) {
                    totalScoreChange += fishCaughtEvent.s;
                }
                totalScoreChange *= scoreMultiplier;

                // It is possible that the player has recently left the game, but their bullet it still bouncing around
                // Check if the player is still in the game
                // For the moment, if the player has left, they lose these points
                if (self.hasPlayer(bullet.ownerId)) {
                    if (options.logCollisions) {
                        console.log(`$ Player ${bullet.ownerId} caught ${numberOfFishCaught} fish for ${totalScoreChange} credits`);
                    }

                    changePlayerScore(bullet.ownerId, totalScoreChange);
                }

                fishGame.informAllClients.fishesWereCaught(bullet.ownerId, fishCaughtEvents, scoreMultiplier, totalScoreChange);
            }

            self.removeBullet(bullet.id);
        }

        function changePlayerScore (playerId, scoreChange) {
            superArena.changePlayerScore(playerId, scoreChange);

            if (onServer) {
                // @todo Update DB with the scoreChange or the player's new score, either queued/batched or debounced respectively
                //       To avoid extra dependencies here, maybe delegate that DB access to the FishGame.
            }

            // NOTE: Currently we do not inform other players of the score change.  To reduce network traffic, changes to score are embedded/implied by the event packet that caused the score change (e.g. firing a bullet or catching a fish).
        }

        function closeArena () {
            if (onServer) {
                clearTimeout(updateTimeoutID);
                clearTimeout(spawnFishTimeoutID);
            }
        }

        function chooseRandomFishType () {
            let totalAbundance = 0;
            for (let fishType in gameConfig.fishClasses) {
                let fishClass = gameConfig.fishClasses[fishType];
                totalAbundance += fishClass.abundance;
            }

            let chosenValue = totalAbundance * Math.random();

            let fishClass = null;
            let fishType = null;
            for (fishType in gameConfig.fishClasses) {
                fishClass = gameConfig.fishClasses[fishType];
                chosenValue -= fishClass.abundance;
                if (chosenValue < 0) {
                    return fishType;
                }
            }

            console.error('[chooseRandomFishType] This should never happen!');
            return fishType;
        }



        const fishGameArenaServerMethods = {
            getState: getState,
            changePlayerScore: changePlayerScore,
            closeArena: closeArena,
        };
        const self = Object.assign({}, superArena, fishGameArenaServerMethods);
        return self;
    }



    /**
     * @returns {number} - An approximation, from 0-1, of how far from the center the circle is penetrating into the ellipse.  0 = full (edge of circle overlaps center of ellipse), 1.0 = just slightly (edge of circle touches edge of ellipse).
     */
    function getEllipseCircleCollision(ellipseCenter, ellipseWidthRadius, ellipseHeightRadius, ellipseAngle, circleCenter, circleRadius) {
        // Note that this is an approximation:  We step from the center of the circle towards the center of the ellipse, which might not actually be the best direction to the surface of the ellipse.  This means the collision may fail if the circle is just beside the node of a long thin ellipse.

        const distanceBetweenCenters = distanceBetweenV2(ellipseCenter, circleCenter);
        const _distanceToEdgeOfCircle = distanceBetweenCenters - circleRadius;
        const distanceToEdgeOfCircle = _distanceToEdgeOfCircle >= 0 ? _distanceToEdgeOfCircle : 0.00001;
        const vectorToCircleCenter = [circleCenter[0] - ellipseCenter[0], circleCenter[1] - ellipseCenter[1]];
        const angleToCircle = Math.atan2(vectorToCircleCenter[1], vectorToCircleCenter[0]);

        const angleToCircleInEllipseSpace = angleToCircle - ellipseAngle;
        const vectorToCircleEdgeInEllipseSpace = [distanceToEdgeOfCircle * Math.cos(angleToCircleInEllipseSpace), distanceToEdgeOfCircle * Math.sin(angleToCircleInEllipseSpace)];

        const normalisedDistanceFromCenter = Math.sqrt(Math.pow(vectorToCircleEdgeInEllipseSpace[0] / ellipseWidthRadius, 2) + Math.pow(vectorToCircleEdgeInEllipseSpace[1] / ellipseHeightRadius, 2));

        return normalisedDistanceFromCenter;
    }

    function distanceBetweenV2Squared (v, w) {
        const distX = v[0] - w[0];
        const distY = v[1] - w[1];

        return distX * distX + distY * distY;
    }

    function distanceBetweenV2 (v, w) {
        return Math.sqrt(distanceBetweenV2Squared(v, w));
    }

    function getValueFromListTruncated (list, index) {
        if (index < 0) {
            index = 0;
        }
        if (index > list.length - 1) {
            index = list.length - 1;
        }
        return list[index];
    }

    function chooseRandomItemFromList (list) {
        const i = Math.floor(Math.random() * list.length);
        return list[i];
    }

    return FishGameArenaServer;
}));