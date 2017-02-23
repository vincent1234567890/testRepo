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
        //noinspection JSAnnotator
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
                console.info("Sent error to client: " + message);
            },

            youHaveJoined: function (playerId, slot, gameConfig) {
                ioSocket.emit('J', {p: playerId, s: slot, c: gameConfig});
            },

            gameHasState: function (gameState) {
                ioSocket.emit('gs', gameState);
            },

            playerHasJoined: function (playerId, playerName, slot, score) {
                ioSocket.emit('j', {p: playerId, n: playerName, s: slot, S: score});
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

            playerFiredBullet: function (playerId, bulletId, bulletLevel, angle, when) {
                ioSocket.emit('b', {p: playerId, b: bulletId, l: bulletLevel, a: trimFloat(angle), w: when});
            },

            bulletExploded: function (bulletId, position) {
                ioSocket.emit('x', {b: bulletId, l: trimVector(position)});   // client should already know the bullet's class and owner
            },

            fishAppeared: function (fishType, fishId, offsetFromGroup, angle, when, motionPatternGroup, motionPatternId, fishHealth, fishSpeed) {
                ioSocket.emit('f', {t: fishType, f: fishId, o: trimVector(offsetFromGroup), a: trimFloat(angle), w: when, mg: motionPatternGroup, mi: motionPatternId, h: fishHealth, s: fishSpeed});
            },

            fishWasHit: function (fishId, hitPoints, isCriticalHit /* any other data needed for animation? */) {
                const data = {f: fishId, h: hitPoints, c: isCriticalHit ? 1 : undefined};
                ioSocket.emit('h', data);
            },

            fishesWereCaught: function (playerId, fishCaptureEvents, scoreMultiplier, totalScoreChange) {
                const simplifiedEvents = fishCaptureEvents.map(
                    event => ({
                        f: event.fishId,
                        s: event.scoreChange,
                        i: event.instantKill || undefined,
                    })
                );
                ioSocket.emit('k', {p: playerId, e: simplifiedEvents, m: scoreMultiplier, s: totalScoreChange});
            },

            fishLeftArena: function (fishId) {
                ioSocket.emit('l', {f: fishId});
            },

            playerScoreChange: function (playerId, scoreChange, reason) {
                ioSocket.emit('psc', {p: playerId, s: scoreChange, r: reason});
            },

            //yourGameStatsAre: function (gameStats) {
            //    ioSocket.emit('gameStats', gameStats);
            //},

            youHaveBeenKicked: function (reason) {
                ioSocket.emit('kickedFromGame', {reason: reason});
            },

        };
    };

    return clientInformer;
}));