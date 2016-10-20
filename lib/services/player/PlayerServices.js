/******************************************************************
 *        NinjaPandaManagement
 *  Copyright (C) 2015-2016 Sinonet Technology Singapore Pte Ltd.
 *  All rights reserved.
 ******************************************************************/

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
    var addServiceFunctions = function(sinonet, service, functionNames){
        for( var i = 0; i < functionNames.length; i++ ){
            service[functionNames[i]] = new sinonet.WebSocketAsyncFunction(functionNames[i]);
            service.addFunction(service[functionNames[i]]);
        }
    };

    var definePlayerService = function(sinonet){
        var PlayerService = function(connection){
            sinonet.WebSocketService.call(this, "player", connection);

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
            addServiceFunctions(sinonet, this, functionNames);
        };
        PlayerService.prototype = Object.create(sinonet.WebSocketService.prototype);
        PlayerService.prototype.constructor = PlayerService;

        rootObj.PlayerService = PlayerService;
    };

    // Individual services should be declared above, and called in here
    var defineServices = function(sinonet){
        definePlayerService(sinonet);
    };

    defineServices(WebSocketService);

    return rootObj;
}));