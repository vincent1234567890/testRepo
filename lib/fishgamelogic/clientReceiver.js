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

    const clientReceiver = function (ioSocket, gameCtrl) {

        const fishActorsByFishId = {};

        // Will be set later
        let arena;
        let gameConfig;
        //let gameMainSessionController;

        function initGameVars () {
            arena = gameCtrl.getArena();
            gameConfig = gameCtrl.getGameConfig();
            //gameMainSessionController = gameCtrl.getCurScene()._mainSessionController;
        }

        ioSocket.on('error', error => {
            console.error("Server sent us an error: " + error.message);
        });

        ioSocket.on('J', data => {
            // You have joined the game with these properties
            const playerId = data.p;     // This is your ID for this game (not your ID in the database)
            const slot = data.s;         // Which cannon position have you been given
            const gameConfig = data.c;   // Big with lots of data!

            const cannonPosition = gameConfig.cannonPositions[slot];

            gameCtrl.setGameConfig(gameConfig);
            gameCtrl.setMyPlayerId(playerId);

            // @todo
            // ?.setMySlot(slot);
            // ?.setMyCannonPosition(cannonPosition);
        });

        ioSocket.on('gs', gameState => {
            // Server has sent the current state of the game
            const players = gameState.players; // [ {playerId: String, playerSlot: number, name: String, score: Number} ]
            const serverGameTime = gameState.arenaState.gameTime;
            const fishes = gameState.arenaState.fishes;
            const bullets = gameState.arenaState.bullets;

            // @todo Init the model and the view.  May want to refactor spawning code from below
            gameCtrl.populateNewGame(players, fishes, bullets, serverGameTime);

            // We cannot init the vars until populateNewGame creates the arena.
            initGameVars();

            for (let player of players) {
                arena.spawnPlayer(player.playerId, player.playerName, player.playerSlot, player.score);
            }
            // @todo fishes, bullets, ...
        });

        ioSocket.on('j', data => {
            // Player has joined the game
            const playerId = data.p;
            const playerName = data.n;
            const playerSlot = data.s;

            arena.spawnPlayer(playerId, playerName, playerSlot);

            // @todo Set up a local sprite to track the arena data
        });

        ioSocket.on('q', data => {
            // Player has left the game
            const playerId = data.p;

            // @todo

            arena.removePlayer(playerId);
        });

        ioSocket.on('g', data => {
            // Player has selected a gun
            const playerId = data.p;
            const gunId = data.g;

            arena.getPlayer(playerId).gunId = gunId;
        });

        ioSocket.on('a', data => {
            // Player has pointed their gun
            const playerId = data.p;
            const angle = data.a;

            arena.getPlayer(playerId).gunAngle = angle;
            // @todo Inform view, or will it pick it up automatically?
        });

        ioSocket.on('b', data => {
            // Player has fired a bullet
            const ownerId = data.p;
            const bulletId = data.b;
            const gunId = data.l;      // Type of gun it was fired from, class/level of bullet
            const angle = data.a;
            const startTime = data.w;

            arena.spawnBullet(ownerId, bulletId, gunId, angle, startTime);

            // @todo
            // See WeaponManager.performCannonSwitch() for how weapons exist.
            //weaponManager.setChangeToWeapon()
            // See WeaponCannonExt.shootTo() for bullet spawn code.
            const bullet = ActorFactory.create("BulletActor");
            bullet.bulletId = bulletId;
            bullet.setCurWeaponLevel(gunId);
            var BulletActorZValue = 100;
            bullet.setZOrder(BulletActorZValue);

            var particle = particleSystemFactory.createParticle(res.ParticlePlist);
            particle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            particle.setShapeType(cc.PARTICLE_STAR_SHAPE);
            particle._dontTint = true;

            GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
            GameCtrl.sharedGame().getCurScene().addActor(bullet);

            console.log("Added bullet:", bullet);
        });

        ioSocket.on('x', data => {
            // Bullet has exploded
            const bulletId = data.b;
            const position = data.l;

            // @todo
            // Get the bullet from the arena by id, to get its class.
            // Get the gun/bullet class from the config, to get the size/look of the explosion.
        });

        ioSocket.on('f', data => {
            // A fish has appeared
            const fishType = data.t;
            const fishId = data.f;
            const position = data.l;
            const angle = data.a;
            const when = data.w;
            const motionPatternGroup = data.mg;
            const motionPatternId = data.mi;

            arena.spawnFish(fishType, fishId, position, angle, when, motionPatternGroup, motionPatternId);

            const fishGroup = FishGroup.shareFishGroup();
            const fishActorName = gameConfig.fishClasses[fishType].actorName || (fishType + 'Actor');
            const initPos = cc.p(position[0], position[1]);
            const fishActor = fishGroup.createFishActorWithName(fishActorName, initPos, {}, cc.p(0,0), fishId);
            fishActor.controlledByServer = true;
            fishGroup.getScene().addActor(fishActor);

            fishActorsByFishId[fishId] = fishActor;
        });

        ioSocket.on('h', data => {
            // A fish has suffered damage
            const fishId = data.f;
            const hitPoints = data.h;

            // @todo Animate something?  We could update the local fish's hitPoints if we want.
        });

        ioSocket.on('k', data => {
            // A fish has been caught
            const fishId = data.f;
            const playerId = data.p;
            const scoreChange = data.s;

            // @todo Update the player's visible score
            arena.removeFish(fishId);

            const fishActor = fishActorsByFishId[fishId];
            if (!fishActor) {
                console.warn("Could not find fishActor for fish " + fishId + ".  Perhaps scene was not initialised.")
            } else {
                fishActor.playAction(1);
                fishActor.setActionDidStopSelector(fishActor.actionAfterArrested, fishActor);
                fishActor.setIsAlive(false);
            }

            delete fishActorsByFishId[fishId];
        });

        ioSocket.on('l', data => {
            // Fish has swum out of the arena
            const fishId = data.f;

            console.log(`Removing fish ${fishId}`);

            arena.removeFish(fishId);

            const fishActor = fishActorsByFishId[fishId];
            if (!fishActor) {
                console.warn("Could not find fishActor for fish " + fishId + ".  Perhaps scene was not initialised.")
            } else {
                fishActor.removeSelfFromScene();
            }

            delete fishActorsByFishId[fishId];
        });

    };

    return clientReceiver;
}));