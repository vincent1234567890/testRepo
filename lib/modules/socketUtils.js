// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["simpleEmitter"], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("./simpleEmitter.js"));
    }
    else {
        root.socketUtils = factory(root.simpleEmitter);
    }
}(this, function (simpleEmitter) {
    "use strict";

    /** Piggy-back the webSocket of a WebSocketClient and listen for any messages it receives.
     *
     * If any message is not targeted at a WebSocketFunction, then handle it using our own emitter.
     *
     * This allows us to listen for smaller messages than those passed to a service-based WebSocketFunctions,
     * which usually require properties 'service' and 'functionName'.
     *
     * We overwrite webSocket.onmessage, rather than add a separate handler, because the prior version will complain if
     * passed a non-service-functionName message.
     */
    function getIOSocketFromClient (client) {
        const webSocket = client._connection;

        const ioSocket = createIOSocket(webSocket);

        webSocket.onmessage = function (msg) {
            const messageHandler = createIOMessageHandler(ioSocket._emitter, () => webSocket.onmessage(msg));
            return messageHandler.call(this, msg.data);
        };

        return ioSocket;
    }

    function getIOSocketFromWebSocket (webSocket) {
        const ioSocket = createIOSocket(webSocket);

        // We do not provide a wssHandler because we are not overwriting the original.
        const messageHandler = createIOMessageHandler(ioSocket._emitter, () => {});
        webSocket.on('message', messageHandler);

        return ioSocket;
    }

    /**
     * Creates something that looks/acts a bit like a socket.io socket.
     * Its .emit() will call .send() on the provided webSocket.
     * You should ensure that its ._emitter.emit() is called when it should receive messages.
     *
     * @param {WebSocket} webSocket
     * @returns {{_emitter: {emit: Function}, on: Function, off: Function, emit: Function}}
     */
    function createIOSocket (webSocket) {
        const emitter = {};
        simpleEmitter.addEmitterTo(emitter);

        var ioSocket = {
            _emitter: emitter,
            on: emitter.on.bind(emitter),
            off: emitter.off.bind(emitter),
            // A function that makes it easy to send events:
            emit: function (event, data) {
                data._ = event;
                webSocket.send(JSON.stringify(data));
            }
        };

        return ioSocket;
    }

    // Returns a message handler function which directs received messages:
    // - If it is JSON and looks like a sinonet service message, pass the message to 'wssHandler'.
    // - If it is JSON and has a _ property, then emit to the emitter with that event name.
    // - Otherwise, if it has no _ or is not JSON, echo a warning explaining why the message could not be handled.
    function createIOMessageHandler (emitter, wssHandler) {
        const handler = function (data) {
            // Optimisation: Does it look like JSON?
            if (typeof data === 'string' && data[0] === '{' && data[1] === '"') {
                try {
                    const packet = JSON.parse(data);
                    if (packet.service && packet.functionName) {
                        // It looks like a classic service API call
                        return wssHandler.apply(this, arguments);
                    } else {
                        // It was JSON but not aimed at a service.  Pass it to the event emitter.
                        //console.log("packet: " + data);
                        const type = packet._;
                        // @consider We could save 6 chars per packet if instead of placing "t" inside the JSON,
                        //           we format the message as "{event_type}:{json}".

                        if (type) {
                            delete packet._;
                            emitter.emit(type, packet);
                        } else {
                            console.warn("I do not know how to handle a message with no _ type:", packet);
                        }
                        return;
                    }
                } catch (e) {
                    // Continue to below
                }
            }

            // It was not JSON
            // Do we want to handle non-JSON (pure String) messages?
            console.warn("socketUtils.handler received a non-JSON packet:", data);
        };

        return handler;
    }

    var socketUtils = {
        getIOSocketFromClient: getIOSocketFromClient,
        getIOSocketFromWebSocket: getIOSocketFromWebSocket,
    };

    return socketUtils;
}));