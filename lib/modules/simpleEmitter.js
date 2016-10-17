"use strict";

function addEmitterTo (obj) {
    const handlersByEvent = {};

    obj.on = function (event, handler) {
        if (!handlersByEvent[event]) {
            handlersByEvent[event] = [];
        }

        handlersByEvent[event].push(handler);
    };

    obj.emit = function (event, message) {
        if (handlersByEvent[event]) {
            handlersByEvent[event].forEach(handler => handler(message));
        }
    };
}

module.exports = {
    addEmitterTo: addEmitterTo,
};