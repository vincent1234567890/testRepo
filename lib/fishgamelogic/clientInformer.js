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

            youHaveJoined: function (playerId, slot) {
                //console.log("ioSocket.emit:", ioSocket.emit);
                //console.log("<< playerId:", playerId);
                ioSocket.emit('J', {p: playerId, s: slot});
            },

            playerHasJoined: function (playerId, playerName, slot) {
                ioSocket.emit('j', {p: playerId, n: playerName, s: slot});
            },

            playerSelectedGun: function (playerId, gunId) {
                ioSocket.emit('g', {p: playerId, g: gunId});
            },

            playerPointedGun: function (playerId, angle) {
                ioSocket.emit('a', {p: playerId, a: angle});
            },

            playerFiredBullet: function (playerId, bulletId, angle, when, bulletLevel) {
                ioSocket.emit('b', {p: playerId, b: bulletId, a: angle, w: when, l: bulletLevel});
            },

            bulletExploded: function (bulletId, location) {
                ioSocket.emit('x', {b: bulletId, l: location});   // client should already know the class (and player)
            },

            fishAppeared: function (fishId, location, when, motionPatternId) {
                ioSocket.emit('f', {f: fishId, l: location, w: when, m: motionPatternId});
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