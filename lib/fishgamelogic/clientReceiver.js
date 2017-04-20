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
        root.clientReceiver = factory();
    }
}(this, function () {
    // This module exists on the client.  It receives messages from the server and takes the appropriate action.

    const clientReceiver = function (ioSocket) {

        // Will be set later
        let arena;
        let gameConfig;

        ioSocket.on('error', error => {
            console.error("Server sent us an error: " + error.message);
        });

        ioSocket.on('J', data => {
            // You have joined the game with these properties
            const playerId = data.p;     // This is your ID for this game (not your ID in the database)
            const playerSlot = data.s;   // Which cannon position have you been given
            const config = data.c;       // Big with lots of data!

            gameConfig = config;
            GameManager.setGameState(config, playerId, playerSlot);

            console.log("GameConfig:" , config);
        });

        ioSocket.on('gs', gameState => {
            // Server has sent the current state of the game
            //console.log("Received gameState:", gameState);

            const serverGameTime = gameState.arenaState.gameTime;

            // The client's gameStartTime will be slightly behind that of the server.
            const gameStartTime = Date.now() - serverGameTime;

            arena = createArenaFromState(gameConfig, gameState, gameStartTime, serverGameTime);

            AppManager.goToGame(arena);

            const players = gameState.players;
            const fishes = gameState.arenaState.fishes;
            const bullets = gameState.arenaState.bullets;
            for (let player of players) {
                GameManager.updateMultiplayerState(player);
            }
            for (let fishId in fishes) {
                const fish = fishes[fishId];
                createFishActor(fish.type, fish.id, fish.position);
            }
            for (let bulletId in bullets) {
                const bullet = bullets[bulletId];
                createBulletActor(bullet.ownerId, bullet.gunId, bullet.id, 0);
            }

        });


        ioSocket.on('j', data => {
            // Another player has joined the game
            const playerId = data.p;
            const playerName = data.n;
            const playerSlot = data.s;
            const playerScore = data.S;

            arena.addPlayer(playerId, playerName, playerSlot, 0, 0, playerScore);

            GameManager.updateMultiplayerState({id: playerId, name: playerName, slot: playerSlot, score : playerScore});
        });

        ioSocket.on('q', data => {
            // Player has left the game
            const playerId = data.p;

            const player = arena.getPlayer(playerId);
            const playerSlot = player.slot;

            arena.removePlayer(playerId);

            GameManager.clearPlayerState(playerSlot);
        });

        ioSocket.on('g', data => {
            // Player has selected a gun
            const playerId = data.p;
            const gunId = data.g;

            const player = arena.getPlayer(playerId);
            if (!player) {
                console.warn("Could not find player " + playerId + ".  Perhaps scene was not initialised.");
                return;
            }
            player.gunId = gunId;

            // The current player will have already shown their gun change when they selected it
            // If the player is rapidly switching guns, setting gun when the server packet is received may produce a rollback!
            const showGunChange = !GameManager.isCurrentPlayer(playerId);
            if (showGunChange) {
                GameManager.updateMultiplayerState(player);
            }
        });

        ioSocket.on('a', data => {
            // Player has pointed their gun
            const playerId = data.p;
            const angle = data.a;

            const player = arena.getPlayer(playerId);
            if (!player) {
                console.warn("Could not find player " + playerId + ".  Perhaps scene was not initialised.");
                return;
            }
            player.gunAngle = angle;
            GameManager.updateMultiplayerState(player);
        });

        ioSocket.on('b', data => {
            // Player has fired a bullet
            const ownerId = data.p;
            const bulletId = data.b;
            const gunId = data.l;
            const bulletCost = data.c;
            const angle = data.a;
            const startTime = data.w;
            const targetFishId = data.f;

            const delta = arena.getGameTime() - startTime;
            if (delta < -250 || delta > 500) {
                console.warn(`${Date()} Received a new bullet ${bulletId} late by ${delta}ms`);
            }

            const shiftGameTimeWhenLagging = true;   // option
            if (shiftGameTimeWhenLagging) {
                // If delta is consistently out-of-sync, then we should adjust our local game's delay accordingly.
                // @consider Only shift if delta is *consistent*.  We need a consistency detection algorithm!  (Windowed average?)
                // Or maybe this is fine.  We only shift by a tiny amount on each bullet.  @todo Should be on each frame.
                if ((delta < -100 || delta > +50) && Math.random() < 0.5) {
                    const adjustment = delta < 0 ? Math.max(-50, delta) : Math.min(+50, delta);
                    console.info("Lag / decongestion detected (" + delta + ").  Shifting game time for consistent view, by " + adjustment + "ms");
                    // This will cause fish to pause for a moment (positive) or speed up for a moment (negative)
                    // DONE: We should consider spreading it out over many small increments
                    arena.shiftGameTime(adjustment);
                }
            }

            // It seems unlikely we would ever receive a bullet fired event after a player has left the game
            // But better safe than sorry
            if (arena.hasPlayer(ownerId)) {
                arena.addBullet(ownerId, bulletId, gunId, bulletCost, angle, startTime, targetFishId);

                const gunClass = arena.getGunClass(gunId);
                changePlayerScoreInArenaAndView(ownerId, -bulletCost);

                createBulletActor(ownerId, gunId, bulletId, angle);
            }
        });

        ioSocket.on('wb', data => {
            // Bullet has been withdrawn from the game
            const bulletId = data.b;
            const bulletCost = data.c;

            GameManager.removeBullet(bulletId);
            // @todo Show a nice animation for the bullet.  (Should it fade out?)
            // @todo If the bullet had a non-zero cost, then this will have been refunded to the player.  In that case we may want to display the coins being refunded.
            arena.removeBullet(bulletId);

            if (bulletCost > 0) {
                console.log(`Refunded ${bulletCost} credits for bullet ${bulletId}`);
            }
        });

        ioSocket.on('x', data => {
            // Bullet has exploded
            const bulletId = data.b;
            const position = data.l;
            const collisionFishId = data.f;

            arena.getBullet(bulletId).position = position;
            GameManager.explodeBullet(bulletId);
            arena.removeBullet(bulletId);
        });

        ioSocket.on('f', data => {
            // A fish has appeared
            const fishType = data.t;
            const fishId = data.f;
            const offsetFromGroup = data.o;
            const angle = data.a;
            const fishSpawnTime = data.st;
            const motionPatternGroup = data.mg;
            const motionPatternId = data.mi;
            const fishHealth = data.h;
            const fishSpeed = data.s;
            const when = data.w;

            // console.log("A fish has appeared:", data);

            const delta = arena.getGameTime() - when;
            if (delta < -250 || delta > 500) {
                console.log(`${Date()} Received a new ${fishType} fish ${fishId} late by ${delta}ms`);
            }

            arena.addFish(fishType, fishId, offsetFromGroup, angle, motionPatternGroup, motionPatternId, 0, fishSpawnTime, fishHealth, fishSpawnTime, fishSpeed);

            createFishActor(fishType, fishId, [-1000, -1000]);
        });

        ioSocket.on('h', data => {
            // A fish has suffered damage
            const fishId = data.f;
            const hitPoints = data.h;

            //console.log(`Damage to ${fishId}: ${hitPoints}`);

            // @todo Animate something?  We could update the local fish's hitPoints if we want.
        });

        ioSocket.on('k', data => {
            // One or more fishes were caught
            const playerId = data.p;
            const fishCaughtEvents = data.e;
            const scoreMultiplier = data.m;
            const scoreChange = data.s;
            // Note that we do not need to modify scoreChange, it has already had the multiplier applied.

            for (let fishCaughtEvent of fishCaughtEvents) {
                const fishId = fishCaughtEvent.f;

                //console.log(`Fish ${fishId} was caught by player ${playerId} for score ${scoreChange}`);

                arena.removeFish(fishId);
                const player = arena.getPlayer(playerId);
                const playerSlot = player && player.slot;
                GameManager.caughtFish(playerSlot, fishId);

            }

            changePlayerScoreInArenaAndView(playerId, scoreChange);
        });

        ioSocket.on('l', data => {
            // Fish has swum out of the arena
            const fishId = data.f;

            //console.log(`Removing fish ${fishId}`);

            arena.removeFish(fishId);

            GameManager.removeFish(fishId);
        });

        ioSocket.on('psc', data => {
            const playerId = data.p;
            const scoreChange = data.s;
            const reason = data.r;

            changePlayerScoreInArenaAndView(playerId, scoreChange);
        });

        // Probably deprecated.  Use the service action 'getMyGameStats' instead.
        //ioSocket.on('gameStats', gameStats => {
        //     @todo Create view
        //
        //    console.warn("Not yet implemented: gameStats received:", gameStats);
        //});

        ioSocket.on('kickedFromGame', data => {
            // This usually happens because the player has gone idle
            // But we might also do this if the player is causing trouble, e.g. sending bad data
            const reason = data.reason;

            console.log("Player was kickedFromGame because " + reason);

            ClientServerConnect.postGameCleanup();

            // @todo Should the view tell the user that they were kicked?

            GameManager.showPostGameStats();
        });

        ioSocket.on('youWonJackpot', data => {
            const rewardLogObjId = data.rewardLogObjId;
            const jackpotName = data.jackpotName;
            const winnings = data.value;

            alert("YOU WON JACKPOT");

            ClientServerConnect.listUncollectedJackpots().then(jackpotRewardLogs => {
                // Show minigame
                // ...
                console.log("jackpotRewardLogs:", jackpotRewardLogs);
            }).catch(console.error);

            // @todo Start minigame immediately, or just notify the player?

            // For now, we just claim the jackpot immediately
            // ClientServerConnect.getGameWSClient().callAPIOnce('game', 'collectJackpot', {rewardLogObjId: rewardLogObjId}).then(
            //     response => {
            //         console.log("collectJackpot response:", response);
            //     }
            // ).catch(console.error);

            // In future, you can check if you have any unclaimed jackpots using:
            // ClientServerConnect.getGameWSClient().callAPIOnce('game', 'listUncollectedJackpots', {}).then(
            //     response => {
            //         console.log("listUncollectedJackpots response:", response);
            //     }
            // ).catch(console.error);
        });

        ioSocket.on('someoneWonJackpot', data => {
            // For convenience, you will not receive this event if you were the player that won the jackpot

            // @todo Display a public celebration message?

            console.log(`Someone has won a jackpot!`, data);
        });

        ioSocket.on('playerChangedSeat', data => {
            const oldSlot = data.o;
            const newSlot = data.n;

            const arenaPlayer = Object.values(arena.getPlayers()).find(p => p.slot === oldSlot);
            arenaPlayer.slot = newSlot;
            arenaPlayer.cannonPosition = gameConfig.cannonPositions[newSlot];

            GameManager.clearPlayerState(oldSlot);
            GameManager.updateMultiplayerState(arenaPlayer,oldSlot);
        });

        ioSocket.on('rc', data => {
            const roundNumber = data.i;
            const arenaMode = data.n;
            const when = data.w;

            arena.setRoundNumber(roundNumber);
            arena.setArenaMode(arenaMode, when);
        });

        ioSocket.on('tlo', data => {
            // The player's auto-fire-target-lock-on-fish system is turning off
            // This often happens because the fish in question has left the arena
            // But it might also happen for other reasons, e.g. the round is changing
            const fishId = data.f;

            // @todo The UI should probably reflect this state change
            // But if the client has sent two or more requests to target two or more fish, then this message might be
            // coming from an older targeting.  Therefore you should check the fishId is actually the current fish you
            // are targeting.  If not you can ignore this message.
            GameManager.unsetLockForFishId(fishId);

            console.log(`No longer targeting fish: ${fishId}`);
        });

        function createFishActor (fishType, fishId, position) {
            let fishActor;
            // Use squid sprite if sprite for given fish is not yet available.  @todo Remove this when we have all sprites
            // if (!FishAnimationData[fishType]){
            //     // console.log("cannot find fish ", fishType);
            //     fishType = 'DemoFish';
            // }
            // if (FishAnimationData[fishType]){
            //     // Eugene : in development
            //     // console.log("creating fish : " + fishType);
            //     fishActor = GameManager.createFish(fishId, fishType);
            //     // const fishActor = GameManager.createFish(fishId, 'Pufferfish');
            // }else{
            //     console.warn("This shouldn't happen: " , fishType)
            //     // fishActor = fishGroup.createFishActorWithName(fishActorName, initPos, {}, cc.p(0, 0), fishId);
            //     // fishActor.controlledByServer = true;
            //     // fishGroup.getScene().addActor(fishActor);
            // }

            // if (GameManager.debug && fishActor && fishType!= 'Squid') {
            //     const debugCircle = new cc.Sprite(res.DebugCircle);
            //     // const config = GameManager.getGameConfig();
            //     const fishClass = gameConfig.fishClasses[fishType];
            //
            //     debugCircle.setScaleX(fishClass.length * 2 / 100);
            //     debugCircle.setScaleY(fishClass.breadth * 2 / 100);
            //
            //     fishActor.addChild(debugCircle, 1);
            // }

            fishActor = GameManager.createFish(fishId, fishType);

            if (AppManager.debugGhosts && fishId.match(/_ghost$/) && fishActor) {
                // This only works on the old fish sprites, because the new animations use child sprites.
                fishActor._sprite.setOpacity(80);
                fishActor._sprite.getChildren().forEach(childActor => childActor.setOpacity(80));
            }
        }

        function createBulletActor (ownerId, gunId, bulletId, angle) {
            // The angle probably doesn't even matter, it will be set on each frame.

            const arenaPlayer = arena.getPlayer(ownerId);

            // Occasionally there may be no player.  E.g. if we join a game, but there is a bullet from a previous player still bouncing around
            // Currently we don't create the bullet actor.  It would require a temporary cannonPosition and support from GameManager.shootTo().
            if (!arenaPlayer) {
                return;
            }

            // GameManager has taken over bullet view management.
            GameManager.shootTo(ownerId, gunId, angle, bulletId);
        }

        function changePlayerScoreInArenaAndView (playerId, scoreChange) {
            // If the player is still in the game
            if (arena.hasPlayer(playerId)) {
                // Update the player's model score
                arena.changePlayerScore(playerId, scoreChange);
                // Update the view
                const player = arena.getPlayer(playerId);
                player.scoreChange = scoreChange;
                GameManager.updateMultiplayerState(player);
            }
        }


        /**
         * Simulates latency for real fishes, but also shows ghost fishes (semi-transparent) which have no latency.
         * This is useful to test lag compensation code:
         * If lag compensation is working, then ghost fishes and real fishes should appear in the same place.
         *
         * @param ioSocket
         * @param ms
         */
        function setupGhostingForSocket (ioSocket, ms) {
            if (AppManager.debugGhosts) {
                const originalEmit = ioSocket._emitter.emit;

                ioSocket._emitter.emit = function () {
                    const type = arguments[0];
                    const data = arguments[1];

                    //const minDelay = 0, maxDelay = ms;
                    const minDelay = ms / 4, maxDelay = ms;
                    //const minDelay = ms, maxDelay = ms;

                    // @todo This is good for testing.  If the initial packets are delayed, it really throws off aim for the rest of the game!
                    //       (Try setting this high, and then shoot at small fish.)
                    //const delayForInitialPackets = maxDelay * 1.5;
                    //const delayForInitialPackets = 0;
                    const delayForInitialPackets = minDelay;

                    // Delaying events by random amounts can make them appear out-of-order, which wouldn't happen outside of this lag simulation.
                    // That can cause problems at the beginning of a game, so we don't lag those early events.
                    // Similarly with removal events (l, x, k), we don't want them to overtake their creation, so we delay them to the max.

                    // If we give J/gs events a high lag, then later 'f' new fish events may arrive before the arena is setup!
                    // So to avoid the errors that might cause, we also give the same lag to any events that arrive while there is still no arena.

                    // We can't access the arena that an instance can, because ghostActors is a static function
                    const lagMs = type === 'J' || type === 'gs' || !arena ? delayForInitialPackets // change to arena instead of GameCtrl.sharedGame().getArena() ?
                        : type === 'l' || type === 'x' || type === 'k' ? maxDelay
                            : Math.round( minDelay + Math.random() * (maxDelay - minDelay) );

                    //console.log("Applying lag:", lagMs, type, data, "delay:");

                    // We only ghost some events
                    if (type === 'f' || type === 'b' || type === 'l' || type === 'x' || type === 'k') {
                        const ghostData = JSON.parse(JSON.stringify(data));
                        ghostData.f += '_ghost';
                        ghostData.b += '_ghost';
                        if (type === 'k') {
                            ghostData.e.forEach(event => event.f += '_ghost');
                        }
                        try {
                            originalEmit.call(ioSocket._emitter, type, ghostData);
                        } catch (e) {
                            // It is quite normal for 'l' events to fail for early ghost fish, because 'gs' doesn't create ghost fish.
                            console.log("Sync error with ghost fish:", e);
                        }
                    }

                    setTimeout(() => originalEmit.call(ioSocket._emitter, type, data), lagMs);
                };
            }
        }

        return {
            setupGhostingForSocket,
        };
    };

    /**
     * The dilemma:
     *
     * If the bullet arrives late, and we forward-wind it, then it will appear along the correct path to collide with the fish.
     *
     * But if the bullet arrives late, then the net/collision will probably arrive late too.  That means the bullet will
     * continue on its path *after* crossing the collision fish.  When the net finally arrives, it will explode in the
     * collision position, but the fish and the bullet will be long past that point!
     *
     * So we don't have to forward wind the bullet.  If the bullet and the net have identical lag, then the net will
     * explode when the bullet is in the correct location.  But the fish will have long gone.  This doesn't help with aiming.
     *
     * A possible mitigation might be to detect bullet-fish collisions on the client.  If the client thinks a bullet hit
     * a fish, then it can hide the bullet, and maybe also show the net.  However, occasionally this might be the wrong decision:
     * the server might eventually say that the fish was caught by a different player, and the bullet passed through, and
     * exploded somewhere else.  This situation might be rare enough that the mitigation will still be worthwhile overall.
     * Some FPS games do this.
     *
     * Simpler solution: If we find bullets and nets are lagging a lot behind, then adjust our gameStartTime, so that
     * they are not so far behind.  Bullet firing will be laggy, but at least the view will be consistent.
     * This is what we are currently doing.
     */

    /**
     * We will probably want to extract and re-use this function when we want to do replays
     *
     * @param gameConfig
     * @param gameState
     * @param gameStartTime - The time that the game started, in the GMT timeline (replays will need to shift this)
     * @param serverGameTime - What was the gameTime at the moment the server constructed this arenaState
     * @returns {*}
     */
    function createArenaFromState (gameConfig, gameState, gameStartTime, serverGameTime) {
        const players = gameState.players;
        const fishes = gameState.arenaState.fishes;
        const bullets = gameState.arenaState.bullets;

        const arena = new FishGameArena(false, gameConfig, null, gameStartTime, gameState.arenaState.consumptionInThisGame);

        for (let player of players) {
            arena.addPlayer(player.id, player.name, player.slot, 0, 0, player.score);
        }
        for (let fishId in fishes) {
            const fish = fishes[fishId];
            arena.addFish(fish.type, fish.id, fish.position, fish.angle, fish.motionPatternGroup, fish.motionPatternId, fish.motionPatternBit, fish.spawnTime, fish.health, serverGameTime);
        }
        for (let bulletId in bullets) {
            const bullet = bullets[bulletId];
            arena.addBullet(bullet.ownerId, bullet.id, bullet.gunId, bullet.bulletCost, bullet.angle, bullet.createTime, bullet.createTime);
        }

        arena.setRoundNumber(gameState.arenaState.roundNumber);
        arena.setArenaMode(gameState.arenaState.arenaMode);

        return arena;
    }

    return clientReceiver;
}));