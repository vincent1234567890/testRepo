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

        // These dictionaries allow us to keep track of views (sprites) associated with game objects, so we can easily
        // remove the views when the game objects expire.
        // @consider Perhaps this functionality could be moved into a "ViewManager" later.
        // Or perhaps we should not call explicitly, but just emit events, so the view can react to them.
        //const playerActorsByPlayerId = {};
        const fishActorsByFishId = {};
        // const bulletActorsByBulletId = {};

        ioSocket.on('error', error => {
            console.error("Server sent us an error: " + error.message);
        });

        ioSocket.on('J', data => {
            // You have joined the game with these properties
            const playerId = data.p;     // This is your ID for this game (not your ID in the database)
            const playerSlot = data.s;   // Which cannon position have you been given
            const config = data.c;       // Big with lots of data!

            // gameCtrl.setMyPlayerId(playerId);
            // GameManager.setPlayerId(playerId);

            gameConfig = config;
            // gameCtrl.setGameConfig(config);
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

            // gameCtrl.setArena(arena);
            // GameManager
            // gameCtrl.startGameScene(arena);
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
                createBulletActor(bullet.ownerId, bullet.id, 0, false);
            }

        });


        ioSocket.on('j', data => {
            // Another player has joined the game
            const playerId = data.p;
            const playerName = data.n;
            const playerSlot = data.s;
            const playerScore = data.S;

            arena.spawnPlayer(playerId, playerName, playerSlot, playerScore);

            // Set up a local sprite to track the arena data
            //createPlayerActor(playerId, playerName, playerSlot);

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
            const angle = data.a;
            const startTime = data.w;

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
                arena.spawnBullet(ownerId, bulletId, gunId, angle, startTime);

                const gunClass = arena.getGunClass(gunId);
                changePlayerScoreInArenaAndView(ownerId, -gunClass.value);

                createBulletActor(ownerId, gunId, bulletId, angle);
            }
        });

        ioSocket.on('x', data => {
            // Bullet has exploded
            const bulletId = data.b;
            const position = data.l;

            GameManager.explodeBullet(bulletId);
            arena.removeBullet(bulletId);

            // If we wanted to do this manually, we would need to:
            // - Get the bullet from the arena by id, to get its class.
            // - Get the gun/bullet class from the config, to get the size/look of the explosion.
            // But actually the bulletActor should already know what kind of net to display.
            // console.log("clientReceiver:Explode: " + bulletId);
            // const bulletActor = bulletActorsByBulletId[bulletId];
            // if (bulletActor) {
            //     // const explodePosition = ccPointFromArray(position);
            //     // bulletActor.addFishNet(explodePosition);
            //     // bulletActor._isAlive = false;
            //     // bulletActor.removeSelfFromScene();
            //
            // } else {
            //     console.warn("Could not find bullet with id: " + bulletId + ".  Unable to show net explosion!")
            // }
            // delete bulletActorsByBulletId[bulletId];
        });

        ioSocket.on('f', data => {
            // A fish has appeared
            const fishType = data.t;
            const fishId = data.f;
            const offsetFromGroup = data.o;
            const angle = data.a;
            const when = data.w;
            const motionPatternGroup = data.mg;
            const motionPatternId = data.mi;
            const fishHealth = data.h;

            // console.log("A fish has appeared:", data);

            const delta = arena.getGameTime() - when;
            if (delta < -250 || delta > 500) {
                console.log(`${Date()} Received a new ${fishType} fish ${fishId} late by ${delta}ms`);
            }

            //arena.spawnFish(fishType, fishId, offsetFromGroup, angle, when, motionPatternGroup, motionPatternId, fishHealth);
            arena.addFish(fishType, fishId, offsetFromGroup, angle, motionPatternGroup, motionPatternId, 0, when, fishHealth, when);

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

                const fishActor = fishActorsByFishId[fishId];
                if (!fishActor) {
                    console.warn("Could not find fishActor for fish " + fishId + ".  Perhaps scene was not initialised.")
                } else {
                    // if (fishActor instanceof BaseFishActor) {
                    //     fishActor.playAction(1);
                    //     fishActor.setActionDidStopSelector(fishActor.actionAfterArrested, fishActor);
                    //     fishActor.setIsAlive(false);
                    //     // actionAfterArrested will remove the FishActor from the scene
                    // }else{
                        GameManager.caughtFish(fishId);
                    // }
                }

                delete fishActorsByFishId[fishId];
            }

            // if (playerId === GameCtrl.sharedGame().getMyPlayerId() && scoreMultiplier > 1) {
            //     // @todo Display juice for the multiplier
            // }

            changePlayerScoreInArenaAndView(playerId, scoreChange);
        });

        ioSocket.on('l', data => {
            // Fish has swum out of the arena
            const fishId = data.f;

            //console.log(`Removing fish ${fishId}`);

            arena.removeFish(fishId);

            const fishActor = fishActorsByFishId[fishId];
            if (!fishActor) {
                //disabled warning for now, in transition 6/12/2016
                //console.warn("Could not find fishActor for fish " + fishId + ".  Perhaps scene was not initialised.")
            } else {

                // fishActor.removeSelfFromScene();
                // Eugene : in development
                // if (FishAnimationData[fishType]) {
                //     GameManager.removeFish(fishId);
                // }else{
                //     fishActor.removeSelfFromScene();
                // }
                // if (fishActor instanceof BaseFishActor){
                //     fishActor.removeSelfFromScene();
                // }else{
                    GameManager.removeFish(fishId);
                // }
            }

            delete fishActorsByFishId[fishId];
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

        function createFishActor (fishType, fishId, position) {
            // const fishGroup = sino.fishGroup;
            // const fishActorName = gameConfig.fishClasses[fishType].actorName || (fishType + 'Actor');
            // const initPos = cc.p(position[0], position[1]);

            let fishActor;
            // Use squid sprite if sprite for given fish is not yet available.  @todo Remove this when we have all sprites
            if (!FishAnimationData[fishType]){
                // console.log("cannot find fish ", fishType);
                fishType = 'DemoFish';
            }
            if (FishAnimationData[fishType]){
                // Eugene : in development
                // console.log("creating fish : " + fishType);
                fishActor = GameManager.createFish(fishId, fishType);
                // const fishActor = GameManager.createFish(fishId, 'Pufferfish');
            }else{
                console.warn("This shouldn't happen: " , fishType)
                // fishActor = fishGroup.createFishActorWithName(fishActorName, initPos, {}, cc.p(0, 0), fishId);
                // fishActor.controlledByServer = true;
                // fishGroup.getScene().addActor(fishActor);
            }

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

            if (AppManager.debugGhosts && fishId.match(/_ghost$/) && fishActor) {
                // This only works on the old fish sprites, because the new animations use child sprites.
                fishActor.setOpacity(80);
                //window.fishActor = fishActor;
                fishActor.getChildren().forEach(childActor => childActor.setOpacity(80));
            }

            if (fishActor) {
                fishActorsByFishId[fishId] = fishActor;
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
                GameManager.updateMultiplayerState(player);
            }
        }

    };

    /**
     * Simulates latency for real fishes, but also shows ghost fishes (semi-transparent) which have no latency.
     * This is useful to test lag compensation code:
     * If lag compensation is working, then ghost fishes and real fishes should appear in the same place.
     *
     * @param ioSocket
     * @param ms
     */
    clientReceiver.ghostActors = function (ioSocket, ms) {
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

                const lagMs = type === 'J' || type === 'gs' || !GameCtrl.sharedGame().getArena() ? delayForInitialPackets // change to arena instead of GameCtrl.sharedGame().getArena() ?
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
            arena.spawnPlayer(player.id, player.name, player.slot, player.score);
            //createPlayerActor(player.id, player.name, player.slot);
        }
        for (let fishId in fishes) {
            const fish = fishes[fishId];
            arena.addFish(fish.type, fish.id, fish.position, fish.angle, fish.motionPatternGroup, fish.motionPatternId, fish.motionPatternBit, fish.spawnTime, fish.health, serverGameTime);
        }
        for (let bulletId in bullets) {
            const bullet = bullets[bulletId];
            arena.addBullet(bullet.ownerId, bullet.id, bullet.gunId, bullet.position, bullet.velocity, bullet.createTime, serverGameTime);
        }

        arena.setRoundNumber(gameState.roundNumber);
        arena.setRoundName(gameState.roundName);

        return arena;
    }

    return clientReceiver;
}));