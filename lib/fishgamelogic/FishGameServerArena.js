"use strict";

const FishGameArena = require('./FishGameArena');
const errorUtils = require("../../../Server/modules/errorUtils.js");
const dbModel = require("../../../Server/dbModules/dbModel.js");
const dbPlayLog = require('../../../Server/dbModules/dbPlayLog');
const dbPlayerGameStats = require("../../../Server/dbPlayerGameStats.js");

const options = {
    logFish: true,
    logCollisions: true,

    // If one tick is slow by N ms, wait N fewer ms for the next tick, to maintain the overall tickrate.
    maintainAverageTickRate: true,
};

function FishGameServerArena (gameConfig, fishGame, _gameStartTime) {
    const superArena = new FishGameArena(true, gameConfig, fishGame, _gameStartTime);



    const formationStyles = ['vertical_line', 'horizontal_line', 'circle'];

    const ARENA_WIDTH = gameConfig.ARENA_RIGHT - gameConfig.ARENA_LEFT;
    const ARENA_HEIGHT = gameConfig.ARENA_TOP - gameConfig.ARENA_BOTTOM;

    let nextId = 0;

    let targetDeltaTime = Math.round(1000 / gameConfig.serverTickRate);
    let nextTargetDeltaTime = targetDeltaTime;

    let updateTimeoutID = setTimeout(doUpdate, nextTargetDeltaTime);
    let spawnFishTimeoutID = setTimeout(considerSpawningFish, 1000);

    function getNextId () {
        return (nextId++).toString(36);
    }

    function getState () {
        return {
            gameTime: self.getGameTime(),
            fishes: self.getFishes(),
            bullets: self.getBullets(),
        };
    }

    function considerSpawningFish () {
        const fishes = self.getFishes();

        try {
            const POINT_RIGHT = 0;
            const POINT_LEFT = Math.PI;

            if (fishes.length < gameConfig.maxFishOnScreen) {
                const joinSide = Math.random() < 0.5 ? 0 : 1;
                const fishDirectionAngle = (joinSide === 0 ? POINT_RIGHT : POINT_LEFT) + Math.PI / 8 * (Math.random() - 0.5);

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

                const motionPatternGroup = fishClass.motionGroup;
                const motionPatternId = Math.floor(Math.random() * gameConfig.fishMotions[motionPatternGroup].length);

                const formationStyle = chooseRandomItemFromList(formationStyles);

                if (options.logFish) {
                    console.log(`+ Spawning ${numInGroup} fish of class "${fishType}" with formation '${formationStyle}' and motion ${motionPatternGroup}[${motionPatternId}]`);
                }

                // Remember that fishClass.length and breadth are actually only half of the real fish length/breadth.
                // I.e. they measure from the center only, not the total.
                const spacing = 3 * Math.max(fishClass.length, fishClass.breadth);
                const radius = numInGroup * spacing / Math.PI / 2 * 1.5;
                const offScreenDistance = formationStyle === 'vertical_line' ? fishClass.length + 20
                    : formationStyle === 'horizontal_line' ? fishClass.length + spacing * (numInGroup / 2 - 0.5) + 20
                    : radius + fishClass.length + 20;

                const spawnX = joinSide === 0
                    ? gameConfig.ARENA_LEFT - offScreenDistance
                    : gameConfig.ARENA_RIGHT + offScreenDistance;

                //const centerOfSpawnY = (gameConfig.ARENA_BOTTOM + gameConfig.ARENA_TOP) / 2;
                const lowestY = gameConfig.ARENA_BOTTOM + offScreenDistance + 80;
                const highestY = gameConfig.ARENA_TOP - offScreenDistance - 80;
                const centerOfSpawnY = lowestY + Math.random() * (highestY - lowestY);

                // Half of the time the group will be lead by fish 0.  The other half, the fish will be rotated around the circle, so the two lead fish appear side-by-side.
                const offsetAngle = Math.random() < 0.5 ? 0 : 2 * Math.PI / numInGroup / 2;

                for (let i = 0; i < numInGroup; i++) {
                    const angleAroundCircle = offsetAngle + 2 * Math.PI * i / numInGroup;

                    const disturbance = 0.5 * spacing * (Math.random() - 0.5);

                    const position = formationStyle === 'vertical_line' ? [spawnX + disturbance, centerOfSpawnY + spacing * (0.5 + i - numInGroup / 2)]
                        : formationStyle === 'horizontal_line' ? [spawnX + spacing * (0.5 + i - numInGroup / 2), centerOfSpawnY + disturbance]
                        : [spawnX + radius * Math.cos(angleAroundCircle), centerOfSpawnY + radius * Math.sin(angleAroundCircle) + disturbance];

                    const fishId = getNextId();
                    const fishSpawnTime = self.getGameTime();

                    self.spawnFish(fishType, fishId, position, fishDirectionAngle, fishSpawnTime, motionPatternGroup, motionPatternId);

                    fishGame.informAllClients.fishAppeared(fishType, fishId, position, fishDirectionAngle, fishSpawnTime, motionPatternGroup, motionPatternId);
                }
            }
        } catch (e) {
            errorUtils.reportError(e, "during FishGameServerArena.considerSpawningFish()");
        }

        const delayToNext = gameConfig.delayBetweenSpawningFish
            + fishes.length * gameConfig.extraDelayPerFishOnScreen
            + Math.random() * gameConfig.extraRandomDelay;

        if (options.logFish) {
            console.log(`: Waiting ${delayToNext.toFixed(2)} seconds for the next spawn.`);
        }

        spawnFishTimeoutID = setTimeout(considerSpawningFish, delayToNext * 1000);
    }

    function doUpdate () {
        const lastTickDeltaTime = self.updateEverything();

        if (lastTickDeltaTime > 1.2 * targetDeltaTime) {
            console.info("! %s Tickrate was not maintained.  %s > %s", Date(), lastTickDeltaTime, targetDeltaTime);
        }

        try {
            checkForFishOffScreen();
            checkCollisions();
        } catch (e) {
            errorUtils.reportError(e, "during FishGameServerArena.doUpdate()");
        }

        // How much later were we called than we requested?
        const latenessMs = lastTickDeltaTime - nextTargetDeltaTime;
        // Pre-emptively compensate by requesting the next callback slightly earlier than our target time
        nextTargetDeltaTime = options.maintainAverageTickRate ? targetDeltaTime - latenessMs : targetDeltaTime;
        updateTimeoutID = setTimeout(doUpdate, nextTargetDeltaTime);
    }

    function checkForFishOffScreen () {
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
                    const collisionSummary = getEllipseCircleCollision(fish.position, fishLength, fishBreadth, fish.angle, bullet.position, bulletRadius, true);

                    const vectorIsInsideEllipse = collisionSummary.normalisedDistanceFromCenter < 1;

                    if (vectorIsInsideEllipse) {
                        // Collision!
                        //const collisionPosition = [bullet.position[0], bullet.position[1]];
                        const collisionPosition = collisionSummary.collisionPositionPushedBack;

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
        const fishLogEvents = [];

        const fishes = self.getFishes();

        const gamePlayer = fishGame.getPlayer(bullet.ownerId);

        // Harm fishes in splash radius
        for (let fishId in fishes) {
            const fish = fishes[fishId];

            const fishClass = self.getFishClass(fish.type);
            const maxDist = explosionRadius + fishClass.length;

            const distanceSquared = distanceBetweenV2Squared(explosionPosition, fish.position);
            if (distanceSquared < maxDist * maxDist) {
                const collisionSummary = getEllipseCircleCollision(fish.position, fishClass.length, fishClass.breadth, fish.angle, explosionPosition, explosionRadius);
                const penetrationIntoFish = 1.0 - collisionSummary.normalisedDistanceFromCenter;

                const damageDealt = Math.round(bulletDamage * penetrationIntoFish);

                fish.hitsReceived = (fish.hitsReceived || 0) + 1;

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

                        // Sent to the client
                        fishCaughtEvents.push({
                            f: fishId,
                            s: scoreChange,
                        });

                        // Recorded in the DB
                        fishLogEvents.push({
                            type: fish.type,
                            //value: fishValue,         // Surely this is uninteresting
                            scoreChange: scoreChange,   // and this is more interesting
                            hits: fish.hitsReceived,
                            // @todo For Future: If the kill was from the bomb gun, then Kenny does not want the hit count to be recorded
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

                changePlayerScore(bullet.ownerId, totalScoreChange, gamePlayer);
                dbPlayLog.logFishesCaught(gamePlayer.playerData._id, bullet.gunId, gunMultiplier, fishLogEvents, scoreMultiplier, totalScoreChange);

                if (numberOfFishCaught > 1) {
                    dbPlayerGameStats.recordMultiCatch(gamePlayer, numberOfFishCaught, scoreMultiplier, totalScoreChange);
                }
                for (let fishLogEvent of fishLogEvents) {
                    dbPlayerGameStats.recordFishCaught(gamePlayer, fishLogEvent.type, fishLogEvent.value * gunMultiplier * scoreMultiplier, bullet.gunId);
                }
            }

            fishGame.informAllClients.fishesWereCaught(bullet.ownerId, fishCaughtEvents, scoreMultiplier, totalScoreChange);
        }

        self.removeBullet(bullet.id);
    }

    /**
     * NOTE: When calling changePlayerScore() on the server, you should also log the score change by calling dbPlayLog._something_()
     *
     * @param {String} playerId
     * @param {Number} scoreChange
     * @param {{}} gamePlayer - The player object from the FishGame (not the arenaPlayer)
     */
    function changePlayerScore (playerId, scoreChange, gamePlayer) {
        // Update the arena state
        superArena.changePlayerScore(playerId, scoreChange);

        // @todo Update DB with the scoreChange or the player's new score, either queued/batched or debounced respectively
        //       To avoid extra dependencies here, maybe delegate that DB access to the FishGame.

        if (gamePlayer && gamePlayer.playerData) {
            dbModel.player.findOneAndUpdate(
                {_id: gamePlayer.playerData._id},
                {$inc: {score: scoreChange}}
            ).catch(err => {
                console.error(`${new Date()} Failed to update player {gamePlayer.playerData._id} with scoreChange ${scoreChange}`);
                errorUtils.reportError(err)
            });
        } else {
            const arenaPlayer = self.getPlayer(playerId);
            console.error(`${new Date()} Could not update score for player ${playerId} in game ${fishGame} with name ${arenaPlayer && arenaPlayer.name}!`);
        }

        // NOTE: Currently we do not inform other players of the score change.  To reduce network traffic, changes to score are embedded/implied by the event packet that caused the score change (e.g. firing a bullet or catching a fish).
    }

    function closeArena () {
        clearTimeout(updateTimeoutID);
        clearTimeout(spawnFishTimeoutID);
    }

    function chooseRandomFishType () {
        let totalAbundance = 0;
        for (let fishType in gameConfig.fishClasses) {
            let fishClass = gameConfig.fishClasses[fishType];
            totalAbundance += fishClass.abundance;
        }

        let chosenValue = totalAbundance * Math.random();

        let fishClass;
        let fishType;
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



    const fishGameServerArenaMethods = {
        getState: getState,
        changePlayerScore: changePlayerScore,
        closeArena: closeArena,
    };
    const self = Object.assign({}, superArena, fishGameServerArenaMethods);
    return self;
}



// == Library Functions == //

/**
 * @returns {number} - An approximation, from 0-1, of how far from the center the circle is penetrating into the ellipse.  0 = full (edge of circle overlaps center of ellipse), 1.0 = just slightly (edge of circle touches edge of ellipse).
 */
function getEllipseCircleCollision (ellipseCenter, ellipseWidthRadius, ellipseHeightRadius, ellipseAngle, circleCenter, circleRadius, puahCollisionBackToEdge) {
    // Note that this is an approximation:  We step from the center of the circle towards the center of the ellipse, which might not actually be the best direction to the surface of the ellipse.  This means the collision may fail if the circle is just beside the node of a long thin ellipse.

    const distanceBetweenCenters = distanceBetweenV2(ellipseCenter, circleCenter);
    const _distanceToEdgeOfCircle = distanceBetweenCenters - circleRadius;
    // If the circle overlaps the center of the ellipse, then we will say it *almost* reaches the center of the ellipse
    // If this number is too small then it can break collisionPosition2 below.
    const distanceToEdgeOfCircle = Math.max(_distanceToEdgeOfCircle, 0.0001);
    const vectorToCircleCenter = [circleCenter[0] - ellipseCenter[0], circleCenter[1] - ellipseCenter[1]];
    const angleToCircle = Math.atan2(vectorToCircleCenter[1], vectorToCircleCenter[0]);

    const angleToCircleInEllipseSpace = angleToCircle - ellipseAngle;
    const vectorToCircleEdgeInEllipseSpace = [distanceToEdgeOfCircle * Math.cos(angleToCircleInEllipseSpace), distanceToEdgeOfCircle * Math.sin(angleToCircleInEllipseSpace)];

    const normalisedDistanceFromCenter = Math.sqrt(Math.pow(vectorToCircleEdgeInEllipseSpace[0] / ellipseWidthRadius, 2) + Math.pow(vectorToCircleEdgeInEllipseSpace[1] / ellipseHeightRadius, 2));

    var collisionSummary = {
        normalisedDistanceFromCenter: normalisedDistanceFromCenter,
    };

    if (puahCollisionBackToEdge) {
        // We want bullets to explode when they touch the edge of the fish's ellipse, not explode inside the ellipse.
        // So let's determine exactly (approximately) where the bullet hit the ellipse, and push the collision back to that point.

        // @todo Possible improvement:  This pushes the bullet along the vector between the two centers.
        // It might look more accurate if we push the bullet back along its path (its velocity).
        // We will have to pass that velocity in.

        // Push from the vectorToBulletEdgeInFishSpace to the edge of the ellipse, should work in world space too.
        const scalarToPushToEdgeOfEllipse = 1 / normalisedDistanceFromCenter;

        // Method 1: Scale in fish space, then move to world space
        const vectorToCollisionInFishSpace = vectorToCircleEdgeInEllipseSpace.map(c => c * scalarToPushToEdgeOfEllipse);
        const collision1X = ellipseCenter[0] + vectorToCollisionInFishSpace[0] * Math.cos(ellipseAngle) - vectorToCollisionInFishSpace[1] * Math.sin(ellipseAngle);
        const collision1Y = ellipseCenter[1] + vectorToCollisionInFishSpace[1] * Math.cos(ellipseAngle) + vectorToCollisionInFishSpace[0] * Math.sin(ellipseAngle);
        const collisionPosition1 = [collision1X, collision1Y];

        // Method 2: In world space, scale from the center of the bullet to the edge of the bullet, and then push out again
        // *** Don't use this one.  It goes bad if distanceToEdgeOfCircle is close to zero.
        //const scalarToShrinkToEdgeOfEllipse = (distanceBetweenCenters - circleRadius) / distanceBetweenCenters * scalarToPushToEdgeOfEllipse;
        ////const vectorToCollision = vectorToBullet.map(c => c * scalarToShrinkToEdgeOfEllipse);
        ////const collisionPosition = [ fish.position[0] + vectorToCollision[0], fish.position[1] + vectorToCollision[1] ];
        //const collision2X = ellipseCenter[0] + scalarToShrinkToEdgeOfEllipse * vectorToCircleCenter[0];
        //const collision2Y = ellipseCenter[1] + scalarToShrinkToEdgeOfEllipse * vectorToCircleCenter[1];
        //const collisionPosition2 = [collision2X, collision2Y];
        //console.log("distanceToEdgeOfCircle:", distanceToEdgeOfCircle);
        //console.log("collisionPosition1:", collisionPosition1);
        //console.log("collisionPosition2:", collisionPosition2);

        collisionSummary.collisionPositionPushedBack = collisionPosition1;
    }

    return collisionSummary;
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



module.exports = FishGameServerArena;
