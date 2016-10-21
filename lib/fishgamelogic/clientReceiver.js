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

        let arena;   // We will be set later

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

            // @todo
            // ?.setMyPlayerId(playerId);
            // ?.setMySlot(slot);
            // ?.setMyCannonPosition(cannonPosition);
        });

        ioSocket.on('gs', gameState => {
            // Server has sent the current state of the game
            const players = gameState.players; // [ {playerId: String, slot: number, name: String} ]
            const serverGameTime = gameState.arenaState.gameTime;
            const fishes = gameState.arenaState.fishes;
            const bullets = gameState.arenaState.bullets;

            gameCtrl.populateNewGame(players, fishes, bullets, serverGameTime);

            arena = gameCtrl.getArena();
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
            // @todo Animate the fish's death
            arena.removeFish(fishId);
        });

        ioSocket.on('l', data => {
            // Fish has swum out of the arena
            const fishId = data.f;

            arena.removeFish(fishId);
        });

    };

    return clientReceiver;
}));