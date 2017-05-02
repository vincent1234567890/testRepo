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

    const options = {
        logIO: false,
    };

    /**
     * For use on clients
     *
     * Piggy-back the webSocket of a WebSocketClient and listen for any messages it receives.
     *
     * If any message is not targeted at a WebSocketFunction, then handle it using our own emitter.
     *
     * This allows us to listen for smaller messages than those passed to a service-based WebSocketFunctions,
     * which usually require properties 'service' and 'functionName'.
     *
     * We overwrite webSocket.onmessage, rather than add a separate handler, because the prior onmessage function
     * will complain if passed a non-service-functionName message.
     *
     * @param {WebSocketClient} client
     * @returns {{_emitter: {emit: Function}, on: Function, off: Function, emit: Function, clearAllListeners: Function}}
     */
    function getIOSocketFromClient (client) {
        const webSocket = client._connection;

        const ioSocket = createIOSocket(webSocket);

        const messageHandler = createIOMessageHandler(ioSocket._emitter, webSocket.onmessage);

        webSocket.__originalOnMessage = webSocket.onmessage;
        webSocket.onmessage = function (msg) {
            return messageHandler.call(this, msg);
        };

        return ioSocket;
    }

    function disengageIOSocketFromClient (ioSocket, client) {
        const webSocket = client._connection;
        if (webSocket && webSocket.__originalOnMessage) {
            webSocket.onmessage = webSocket.__originalOnMessage;
            delete webSocket.__originalOnMessage;
        } else {
            console.error("Cannot disengage from client, __originalOnMessage is not set.");
        }
    }

    /**
     * For use on servers
     *
     * @param {WebSocket} webSocket
     * @returns {{_emitter: {emit: Function}, on: Function, off: Function, emit: Function, clearAllListeners: Function}}
     */
    function getIOSocketFromWebSocket (webSocket) {
        const ioSocket = createIOSocket(webSocket);

        // We do not provide a wssHandler because we are not overwriting the original.
        const messageHandler = createIODataHandler(ioSocket._emitter);

        // more is sometimes a Buffer.  We don't want to pass the buffer down to our message handler, because it will think it is a callIfService function!
        const messageHandlerToAdd = (data, more) => messageHandler(data);
        webSocket.on('message', messageHandlerToAdd);

        ioSocket.__addedMessageHandler = messageHandlerToAdd;
        return ioSocket;
    }

    function disengageIOSocketFromWebSocket (ioSocket, webSocket) {
        if (ioSocket.__addedMessageHandler) {
            // ws does not provide webSocket.off() to mirror the earlier webSocket.on(), but it does provide webSocket.removeListener()
            webSocket.removeListener('message', ioSocket.__addedMessageHandler);
            delete ioSocket.__addedMessageHandler;
        }
    }

    /**
     * Creates something that looks/acts a bit like a socket.io socket.
     * Its .emit() will call .send() on the provided webSocket.
     * You should ensure that its ._emitter.emit() is called when it should receive messages.
     *
     * To listen for messages from the remote, use: `ioSocket.on(name, callback);`
     *
     * To send messages to the remote, use `ioSocket.emit(name, data);`
     *
     * Do not use `ioSocket._emitter.emit()`.  That is used internally to dispatch messages the your listeners when they are received from the remote.
     *
     * @param {WebSocket} webSocket
     * @returns {{_emitter: {emit: Function}, on: Function, off: Function, emit: Function}}
     */
    function createIOSocket (webSocket) {
        const emitter = {};
        simpleEmitter.addEmitterTo(emitter);

        const ioSocket = {
            /**
             * An event emitter for dispatching received events on the local side.
             */
            _emitter: emitter,
            on: emitter.on.bind(emitter),
            off: emitter.off.bind(emitter),
            clearAllListeners: emitter.clearAllListeners.bind(emitter),

            /**
             * Send an event to the remote server
             */
            emit: function (event, data) {
                // It is possible that the caller has passed us an object which we should not modify.
                // E.g. they are about to save the data object to the DB, or enumerate its properties.
                // So we create our own clone of data
                data = JSON.parse(JSON.stringify(data));

                data._ = event;

                if (options.logIO) {
                    console.log("<< Sending:", JSON.stringify(data));
                }

                // We occasionally get an error when we cannot send to the client,
                // e.g. the remote has disconnected but we have not yet processed the 'close' event.
                // To avoid throwing errors back to the caller, we will catch the error and turn it into a boolean.
                try {
                    webSocket.send(JSON.stringify(data));
                } catch (error) {
                    console.warn("Could not send to webSocket, message:", data, "error:", error);
                    return error;
                }
            },
        };

        return ioSocket;
    }

    /**
     * Returns a message handler function which directs received messages:
     *
     *   - If it is JSON and looks like a WebSocketService message, pass the message to 'wssHandler'.
     *
     *   - If it is JSON and has a _ property, then emit to the emitter using that event name.
     *
     *   - Otherwise, if it has no _ or is not JSON, echo a warning explaining why the message could not be handled.
     *
     * @param emitter
     * @param wssHandler
     * @returns {} - messageHandler
     */
    function createIOMessageHandler (emitter, wssHandler) {
        const dataHandler = createIODataHandler(emitter);

        const messageHandler = function (msg) {
            const data = msg.data;
            // 'this' will be the WSServer, assuming this messageHandler is placed inside it.
            dataHandler(data, () => wssHandler.call(this, msg));
        };

        return messageHandler;
    }

    /**
     * @param emitter
     * @returns {handler}
     */
    function createIODataHandler (emitter) {
        /**
         * @param {Object} data
         * @param {Function} callIfService - If the request in data is a WebSocketService action, then pass it to callIfServer for handling
         */
        const handler = function (data, callIfService) {
            if (options.logIO) {
                console.log(">> Received:", data);
            }

            // Optimisation: Does it look like JSON?  (If not, we can skip attempting JSON.parse() and the resulting error.)
            if (typeof data === 'string' && data[0] === '{' && data[1] === '"') {
                let packet;
                try {
                    packet = JSON.parse(data);
                } catch (e) {
                    console.warn("socketUtils.handler received data that looked like JSON but it failed to parse!", data, e);
                    return;
                }

                // Just in case an error is thrown during handling, this will prevent the server from crashing.
                const isNode = (typeof window !== 'object');
                if (isNode) {
                    try {
                        handleJSONPacket(packet);
                    } catch (err) {
                        // This is how we currently detect non-critical errors from serverReceiver.js
                        if (err.message && err.message.match(/^Invalid Data/)) {
                            // Less logging detail for non-critical errors
                            console.warn("Rejecting Invalid Data from client:", data);
                        } else {
                            console.error("Unexpected error when processing packet:", packet, err && err.stack || err);
                        }
                        // Also unfortunately, we have no way currently to send the error back to the instigator of this message.
                        // This is no use: It emits the event locally, rather than replying!
                        //emitter.emit('error', "Unexpected error: " + err);
                        return;
                    }
                } else {
                    // But in the browser, or another environment with a debugger that pauses on exceptions, then devtools can be more helpful if the error gets thrown normally
                    handleJSONPacket(packet);
                }

                return;
            }

            function handleJSONPacket (packet) {
                if (packet.service && packet.functionName) {
                    // It looks like a classic service API call
                    if (callIfService) {
                        return callIfService();
                    }
                    // If callIfService is undefined, then hopefully we are in an environment where we are not the only message handler.
                    // The other message handler should handle the message.
                } else {
                    // It was JSON but not aimed at a service.  Pass it to the event emitter.
                    const type = packet._;

                    if (type) {
                        delete packet._;
                        emitter.emit(type, packet);
                    } else {
                        console.warn("I do not know how to handle a message with no _ type:", packet);
                    }
                }
            }

            // It was not JSON
            // Do we want to handle non-JSON (pure String) messages?
            console.warn("socketUtils.handler received a non-JSON packet:", data);
        };

        return handler;
    }

    function simulateNetworkLatency (ioSocket, ms) {
        const realEmitterEmit = ioSocket._emitter.emit;
        ioSocket._emitter.emit = function () {
            setTimeout(() => realEmitterEmit.apply(ioSocket._emitter, arguments), ms/2);
        };

        const realIOSocketEmit = ioSocket.emit;
        ioSocket.emit = function () {
            setTimeout(() => realIOSocketEmit.apply(ioSocket, arguments), ms/2);
        };

        return ioSocket;
    }

    const socketUtils = {
        getIOSocketFromClient: getIOSocketFromClient,
        disengageIOSocketFromClient: disengageIOSocketFromClient,
        getIOSocketFromWebSocket: getIOSocketFromWebSocket,
        disengageIOSocketFromWebSocket: disengageIOSocketFromWebSocket,
        simulateNetworkLatency: simulateNetworkLatency,
    };

    return socketUtils;
}));