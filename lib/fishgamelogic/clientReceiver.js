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

    const clientReceiver = function (ioSocket, arena) {

        ioSocket.on('error', error => {
            console.error("Server sent us an error: " + error.message);
        });

        ioSocket.on('J', data => {
            // You have joined the game with these properties
            const playerId = data.p;     // This is your ID for this game (not your ID in the database)
            const slot = data.s;         // Which cannon position have you been given
            const gameConfig = data.c;   // Big with lots of data!

            const cannonPosition = gameConfig.cannonPositions[slot];

            // @todo
            // ?.setMyPlayerId(playerId);
            // ?.setMySlot(slot);
            // ?.setMyCannonPosition(cannonPosition);
            // ?.setConfig(gameConfig);
        });

        ioSocket.on('gs', gameState => {
            // Server has sent the current state of the game
            const players = gameState.players; // [ {playerId: String, slot: number, name: String} ]
            const serverGameTime = gameState.arenaState.gameTime;
            const fishes = gameState.arenaState.fishes;
            const bullets = gameState.arenaState.bullets;

            // @todo To get up-to-date, create the cannons for the other players,
            // @todo add all the fishes (and maybe even add some in-transit bullets)
        });

        ioSocket.on('j', data => {
            // Player has joined the game
            const playerId = data.p;
            const playerName = data.n;
            const playerSlot = data.s;

            // @todo
        });

        ioSocket.on('q', data => {
            // Player has left the game
            const playerId = data.p;

            // @todo
        });

        ioSocket.on('g', data => {
            // Player has selected a gun
            const playerId = data.p;
            const gunId = data.g;

            // @todo
        });

        ioSocket.on('a', data => {
            // Player has pointed their gun
            const playerId = data.p;
            const angle = data.a;

            // @todo
        });

        ioSocket.on('b', data => {
            // Player has fired a bullet
            const playerId = data.p;
            const bulletId = data.b;
            const gunId = data.l;      // Type of gun it was fired from, class/level of bullet
            const angle = data.a;
            const startTime = data.w;

            // @todo arena.addBullet should be refactored to arena.spawnBullet or arena.fireBullet()
            // @todo arena.addBullet(...);
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

            arena.addFish(fishType, fishId, position, angle, when, motionPatternGroup, motionPatternId);
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