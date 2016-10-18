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
    function listenForEvents (client) {
        const webSocket = client._connection;
        const wscMessageHandler = webSocket.onmessage;

        const eventListener = {
            handle: function (packet) {
                console.warn("socketUtils.listenForEvents received a packet with no type:", packet);
                console.warn("You should override eventListener.handle() in order to process this.");
            }
        };
        simpleEmitter.addEmitterTo(eventListener);

        const ourMessageHandler = (msg) => {
            const data = msg.data;

            // Does it look like JSON?
            if (data[0] === '{' && data[1] === '"') {
                try {
                    const packet = JSON.parse(data);
                    if (packet.service && packet.functionName) {
                        // It looks like a classic service API call
                        return wscMessageHandler.apply(client, arguments);
                    } else {
                        // It was JSON but not aimed at a service.  Pass it to the even emitter.
                        //console.log("packet: " + data);
                        const type = packet._ || packet.name;
                        // @consider We could save 6 chars per packet if instead of placing "t" inside the JSON,
                        //           we format the message as "{event_type}:{json}".

                        if (type) {
                            eventListener.emit(type, packet);
                        } else {
                            eventListener.handle(packet);
                        }
                        return;
                    }
                } catch (e) {
                }
            }

            // It was not JSON
            // Do we want to handle non-JSON (pure String) messages?
            console.warn("socketUtils.listenForEvents received a non-JSON packet:", data);
        };

        webSocket.onmessage = ourMessageHandler;

        // Create a function that makes it easy to send events:
        eventListener.send = function (event, data) {
            data._ = event;
            client._connection.send(JSON.stringify(data));
        };

        return eventListener;
    }

    var socketUtils = {
        listenForEvents: listenForEvents,
    };

    return socketUtils;
}));