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
    
    /**
     * Removes the given event handler.  If no handler is passed, removes all handlers for the given event type.
     *
     * @param {String} event
     * @param {Function} [handler]
     */
    obj.off = function (event, handler) {
        if (!handler) {
            delete handlersByEvent[event];
        } else {
            const handlerList = handlersByEvent[event];
            if (handlerList) {
                const i = handlerList.indexOf(handler);
                handlerList.splice(i, 1);
            }
        }
    };
}

module.exports = {
    addEmitterTo: addEmitterTo,
};