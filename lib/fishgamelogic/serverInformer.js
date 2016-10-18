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
        root.serverInformer = factory();
    }
}(this, function () {
    // This module exists on the client, and is used to inform the server of changes.

    const serverInformer = function (ioSocket) {
        return {

            gunSelected: function (gunId) {
                ioSocket.emit('g', {g: gunId});
            },

            gunPointed: function (angle) {
                ioSocket.emit('p', {a: angle});
            },

            bulletFired: function (bulletId, angle) {
                // The client chooses the bulletId, because otherwise we would need more wasteful response messages.
                // However the client *must* ensure the bullet id starts with the player's id, or the server will reject it.
                ioSocket.emit('b', {b: bulletId, a: angle});
            },

        };
    };

    return serverInformer;
}));