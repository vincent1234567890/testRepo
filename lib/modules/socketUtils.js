"use strict";

const simpleEmitter = require("./simpleEmitter.js");

/** Piggy-back the webSocket of a WebSocketClient and listen for any messages it receives.
 *
 * If any message is not targeted at a WebSocketFunction, then handle it using our own emitter.
 *
 * This allows us to listen for smaller messages than those passed to a service-based WebSocketFunctions,
 * which usually require properties 'service' and 'functionName'.
 */
function listenForEvents (client) {
    const webSocket = client._connection;
    const wscMessageHandler = webSocket.onmessage;

    const eventEmitter = {
        handle: function (packet) {
            console.warn("piggyBackClient<ourMessageHandler> received a packet with no type:", packet);
            console.warn("You should override eventEmitter.handle() in order to process this.");
        }
    };
    simpleEmitter.addEmitterTo(eventEmitter);

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
                    const type = packet.t || packet.type;
                    // @consider We could save 6 chars per packet if instead of placing "t" inside the JSON,
                    //           we format the message as "{type}:{json}".

                    if (type) {
                        eventEmitter.emit(type, packet);
                    } else {
                        eventEmitter.handle(packet);
                    }
                    return;
                }
            } catch (e) {}
        }

        // It was not JSON
        // Do we want to handle non-JSON (pure String) messages?
        console.warn("piggyBackClient<ourMessageHandler> received a non-JSON packet:", data);
    };

    webSocket.onmessage = ourMessageHandler;

    return eventEmitter;
}

var socketUtils = {
    listenForEvents: listenForEvents,
};

module.exports = socketUtils;