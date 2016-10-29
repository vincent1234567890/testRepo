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

        const messageHandler = createIOMessageHandler(ioSocket._emitter, webSocket.onmessage);

        webSocket.onmessage = function (msg) {
            return messageHandler.call(this, msg);
        };

        return ioSocket;
    }

    function getIOSocketFromWebSocket (webSocket) {
        const ioSocket = createIOSocket(webSocket);

        // We do not provide a wssHandler because we are not overwriting the original.
        const messageHandler = createIODataHandler(ioSocket._emitter);
        webSocket.on('message', messageHandler);

        return ioSocket;
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

        var ioSocket = {
            _emitter: emitter,
            on: emitter.on.bind(emitter),
            off: emitter.off.bind(emitter),
            // A function that makes it easy to send events:
            emit: function (event, data) {
                data._ = event;

                if (options.logIO) {
                    console.log("<< Sending:", JSON.stringify(data));
                }

                // We very occasionally get this when we cannot send to the client,
                // e.g. the remote has disconnected but we have not yet processed the 'close' event.
                try {
                    webSocket.send(JSON.stringify(data));
                } catch (e) {
                    console.warn('Could not send to webSocket:', e, 'message:', data);
                }
            }
        };

        return ioSocket;
    }

    /**
     * Returns a message handler function which directs received messages:
     *
     *   - If it is JSON and looks like a sinonet service message, pass the message to 'wssHandler'.
     *
     *   - If it is JSON and has a _ property, then emit to the emitter using that event name.
     *
     *   - Otherwise, if it has no _ or is not JSON, echo a warning explaining why the message could not be handled.
     *
     * @param emitter
     * @param wssHandler
     * @returns {messageHandler}
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
     * @param callIfService
     * @returns {handler}
     */
    function createIODataHandler (emitter) {
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
                        console.error("Unexpected error when processing packet:", packet, err && err.stack || err);
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
                    return callIfService();
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
            setTimeout(() => realEmitterEmit.apply(this, arguments), ms/2);
        };

        const realIOSocketEmit = ioSocket.emit;
        ioSocket.emit = function () {
            setTimeout(() => realIOSocketEmit.apply(this, arguments), ms/2);
        };

        return ioSocket;
    }

    var socketUtils = {
        getIOSocketFromClient: getIOSocketFromClient,
        getIOSocketFromWebSocket: getIOSocketFromWebSocket,
        simulateNetworkLatency: simulateNetworkLatency,
    };

    return socketUtils;
}));