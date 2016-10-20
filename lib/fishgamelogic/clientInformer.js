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
        root.clientInformer = factory();
    }
}(this, function () {
    // This module exists on the server, and is used to inform the client of changes.

    const trimFloat = (f) => Math.round(f * 10000) / 10000;
    const trimVector = (v) => [ trimFloat(v[0]) , trimFloat(v[1]) ];

    const clientInformer = function (ioSocket) {
        // Prevent caller from accidentally passing a WebSocket (which would silently fail to emit)
        if (ioSocket === null || ioSocket.on && ioSocket.off && ioSocket.emit) {
            // Good
        } else {
            throw Error("ioSocket was the wrong type of object.");
        }

        return {

            error: function (message) {
                // Hopefully we won't send these too often.
                // But we may send them to aid development
                ioSocket.emit('error', {message: message});
                // We can also echo the Error on the server
                console.error("Sent error to client: " + message);
            },

            youHaveJoined: function (playerId, slot, gameConfig) {
                ioSocket.emit('J', {p: playerId, s: slot, c: gameConfig});
            },

            gameHasState: function (gameState) {
                ioSocket.emit('gs', gameState);
            },

            playerHasJoined: function (playerId, playerName, slot) {
                ioSocket.emit('j', {p: playerId, n: playerName, s: slot});
            },

            playerHasLeft: function (playerId) {
                ioSocket.emit('q', {p: playerId});
            },

            playerSelectedGun: function (playerId, gunId) {
                ioSocket.emit('g', {p: playerId, g: gunId});
            },

            playerPointedGun: function (playerId, angle) {
                ioSocket.emit('a', {p: playerId, a: trimFloat(angle)});
            },

            playerFiredBullet: function (playerId, bulletId, angle, when, bulletLevel) {
                ioSocket.emit('b', {p: playerId, b: bulletId, a: trimFloat(angle), w: when, l: bulletLevel});
            },

            bulletExploded: function (bulletId, position) {
                ioSocket.emit('x', {b: bulletId, l: trimVector(position)});   // client should already know the bullet's class and owner
            },

            fishAppeared: function (fishType, fishId, position, angle, when, motionPatternGroup, motionPatternId) {
                ioSocket.emit('f', {t: fishType, f: fishId, l: trimVector(position), a: trimFloat(angle), w: when, mg: motionPatternGroup, mi: motionPatternId});
            },

            fishWasHit: function (fishId, hitPoints /* any other data needed for animation? */) {
                ioSocket.emit('h', {f: fishId, h: hitPoints});
            },

            fishWasKilled: function (fishId, playerId, scoreChange) {
                ioSocket.emit('k', {f: fishId, p: playerId, s: scoreChange});
            },

            fishLeftArena: function (fishId) {
                ioSocket.emit('l', {f: fishId});
            },

        };
    };

    return clientInformer;
}));