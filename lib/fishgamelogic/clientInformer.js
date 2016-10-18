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
        return {

            playerSelectedGun: function (playerId, gunId) {
                ioSocket.emit('g', {p: playerId, g: gunId});
            },

            playerPointedGun: function (playerId, angle) {
                ioSocket.emit('p', {p: playerId, a: angle});
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