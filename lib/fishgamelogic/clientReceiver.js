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
        const bulletActorsByBulletId = {};

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
            const players = gameState.players; // [ {playerId: String, playerSlot: number, playerName: String, score: Number} ]
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

            const player = arena.getPlayer(playerId);
            if (!player) {
                console.warn("Could not find player " + playerId + ".  Perhaps scene was not initialised.");
                return;
            }
            player.gunId = gunId;
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

            // Now we need to create the view sprites

            // See WeaponManager.performCannonSwitch() for how weapons exist.
            //weaponManager.setChangeToWeapon()
            // See WeaponCannonExt.shootTo() for bullet spawn code.

            //var particleDistance = 60;
            //var particle = particleSystemFactory.createParticle(ImageName("particle.plist"));
            //particle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            //particle.setShapeType(cc.PARTICLE_STAR_SHAPE);
            //particle._dontTint = true;
            //const bulletActor = ActorFactory.create("BulletActor");
            //bulletActor.bulletId = bulletId;
            //bulletActor.setParticle(particle);
            ////bulletActor.setShootFlag(this.getShootFlag());
            //bulletActor.setCurWeaponLevel(gunId + 1);
            //bulletActor.resetState();
            //bulletActor.updateInfo();
            //bulletActor.setGroup(GroupHeroBullet);
            ////bulletActor.setGroup(GroupEnemyBullet);
            ////var direction = cc.pNormalize(cc.pSub(targetPosition, bulletPos));
            //var direction = cc.v2fforangle(angle);
            //bulletActor.setMoveDirection(direction);
            ////bulletActor.setPosition(bulletPos);
            ////particle.setPosition(cc.pAdd(this.getPosition(), cc.pMult(direction, particleDistance)));
            //var BulletActorZValue = 100;
            //bulletActor.setZOrder(BulletActorZValue);
            //bulletActor.setSpeed(gameConfig.defaultBulletSpeed);
            //
            ////var ang = Math.atan2(direction.x, direction.y);
            ////this.getWeaponSprite().setRotation((ang / Math.PI * 180.0 - this.getRotation()));
            //
            //GameCtrl.sharedGame().getCurScene().addChild(particle, 10);
            //GameCtrl.sharedGame().getCurScene().addActor(bulletActor);
            //console.log("Added bullet:", bulletActor);
            //
            //PlayerActor.sharedActor().shootFinished(bulletActor.getCurWeaponLevel());

            const cannonPosition = arena.getPlayer(ownerId).cannonPosition;
            const aimDirection = cc.v2fmult(cc.v2fforangle(angle), 100);
            const tempTarget = cc.pAdd(ccPointFromArray(cannonPosition), aimDirection);

            // The current player has already shown the cannon firing animation
            const showCannonAnimation = ownerId !== GameCtrl.sharedGame().getMyPlayerId();

            // @todo Get the cannon for the appropriate player
            const weaponManager = GameCtrl.sharedGame().getCurScene().getCannonActor();

            const bulletActor = weaponManager.getCurrentWeapon().shootTo(tempTarget, undefined, showCannonAnimation);
            bulletActor.bulletId = bulletId;

            bulletActorsByBulletId[bulletId] = bulletActor;
        });

        ioSocket.on('x', data => {
            // Bullet has exploded
            const bulletId = data.b;
            const position = data.l;

            // @todo
            // Get the bullet from the arena by id, to get its class.
            // Get the gun/bullet class from the config, to get the size/look of the explosion.

            arena.removeBullet(bulletId);

            const bulletActor = bulletActorsByBulletId[bulletId];
            if (bulletActor) {
                const explodePosition = ccPointFromArray(position);
                bulletActor.addFishNet(explodePosition);
                bulletActor._isAlive = false;
                bulletActor.removeSelfFromScene();
            } else {
                console.warn("Could not find bullet with id: " + bulletId + ".  Unable to show net explosion!")
            }
            delete bulletActorsByBulletId[bulletId];
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

            const fishGroup = sino.fishGroup;
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

            //console.log(`Removing fish ${fishId}`);

            arena.removeFish(fishId);

            const fishActor = fishActorsByFishId[fishId];
            if (!fishActor) {
                console.warn("Could not find fishActor for fish " + fishId + ".  Perhaps scene was not initialised.")
            } else {
                fishActor.removeSelfFromScene();
            }

            delete fishActorsByFishId[fishId];
        });

        const ccPointFromArray = (v2) => new cc.Point(v2[0], v2[1]);

    };

    return clientReceiver;
}));