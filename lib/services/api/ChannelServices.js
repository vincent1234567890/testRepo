
/* ### WARNING: THIS FILE IS AUTO-GENERATED - DO NOT CHANGE IT, BECAUSE IT WILL BE OVERWRITTEN. ### */

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["services/WebSocketService"], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("../../../../Server/server_common/WebSocketService"));
    }
    else {
        root.ChannelServices = factory(root.WebSocketService);
    }
}(this, function (wsService) {
    var rootObj = {};

    //create and add async function to WebSocketService
    var addServiceFunctions = function (wsService, service, functionNames) {
        for (var i = 0; i < functionNames.length; i++) {
            service[functionNames[i]] = new wsService.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    // Individual services should be declared above, and called in here
    var defineServices = function (wsService) {
        var ChannelService = function (connection) {
            wsService.WebSocketService.call(this, "channel", connection);

            /* ### WARNING: THIS FILE IS AUTO-GENERATED - DO NOT CHANGE IT, BECAUSE IT WILL BE OVERWRITTEN. ### */
            var functionNames = ["createuser","requesttoken","recharge","deduct","getOrderStatus","userbethistory"];
            addServiceFunctions(wsService, this, functionNames);
        };

        ChannelService.prototype = Object.create(wsService.WebSocketService.prototype);
        ChannelService.prototype.constructor = ChannelService;

        rootObj.ChannelService = ChannelService;

    };

    defineServices(wsService);

    return rootObj;
}));
