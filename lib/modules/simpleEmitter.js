// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.simpleEmitter = factory();
    }
}(this, function () {
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
            //else {
            //    console.warn("Event '%s' was emitted, but no handler exists to process it.", event, message);
            //}
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

    return {
        addEmitterTo: addEmitterTo,
    };
}));