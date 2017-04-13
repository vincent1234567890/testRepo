// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["common/WebSocketService"], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("./../../server_common/WebSocketService"));
    }
    else {
        root.PlayerServices = factory(root.WebSocketService);
    }
}(this, function (WebSocketService) {
    var rootObj = {};

    //create and add async function to WebSocketService
    var addServiceFunctions = function(wsService, service, functionNames){
        for( var i = 0; i < functionNames.length; i++ ){
            service[functionNames[i]] = new wsService.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    var definePlayerService = function(wsService){
        var PlayerService = function(connection){
            wsService.WebSocketService.call(this, "player", connection);

            //define functions
            var functionNames = [
                "checkForAnnouncements",
                "createFriendRequest",
                "acceptFriendRequest",
                "rejectFriendRequest",
                "getFriendsList",
                "sendGift",
                "updateInfo",
                "changeFlavourBanner"
            ];
            addServiceFunctions(wsService, this, functionNames);
        };
        PlayerService.prototype = Object.create(wsService.WebSocketService.prototype);
        PlayerService.prototype.constructor = PlayerService;

        rootObj.PlayerService = PlayerService;
    };

    // Individual services should be declared above, and called in here
    var defineServices = function(wsService){
        definePlayerService(wsService);
    };

    defineServices(WebSocketService);

    return rootObj;
}));