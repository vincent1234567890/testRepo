/******************************************************************
 *        NinjaPandaManagement
 *  Copyright (C) 2015-2016 Sinonet Technology Singapore Pte Ltd.
 *  All rights reserved.
 ******************************************************************/

// UMD (Universal Module Definition) returnExports.js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require("q"), require("ws"));
    }
    else {
        root.WebSocketClient = factory(null, root.WebSocket);
    }
}(this, function (Q, WebSocket) {
    /**
     * 用于封装WebSocket client,
     * @param {String} url
     * @constructor
     */
    var WebSocketClient = function(url, opts){
        //
        this.url = url;
        this.opts = opts;
        this._services = [];

        this._connection = null;
        this._requestId = 0;
    };

    var proto = WebSocketClient.prototype;

    proto.getRequestId = function(){
        this._requestId++;
        return this._requestId;
    };

    proto.connect = function(){
        var conn = new WebSocket(this.url, this.opts);
        this._connection = conn;
        //for debug
        // conn.onopen = function(){
        //     //conn.setKeepAlive(true);
        //     console.log("opened the connection", conn);
        // };
        conn.onmessage = this._messageHandler.bind(this);
        var services = this._services;
        for(var i = 0; i< services.length; i++){
            services[i].setConnection(conn);
        }

        // var self = this;
        // conn.onclose = function(event){
        //     //console.log("Web socket client connection closed!", event.target._events);
        //     self._connection = null;
        //     self.reconnect.bind(self)();
        // };
        //
        conn.onerror = function(error){
            console.error("Web socket client connection error!", error);
            // self._connection = null;
            // self.reconnect.bind(self)();
        };
    };

    /*
     * reconnect to message server
     */
    proto.reconnect = function(){
        var self = this;
        setTimeout(
            function(){
                if( !self._connection || self._connection.readyState != WebSocket.OPEN ){
                    self.connect();
                }
            }, 1000
        );

    };

    //check if ws connection is open
    proto.isOpen = function(){
        return  this._connection ?  this._connection.readyState == 1 : false;
    };

    proto.disconnect = function(){
        if (this.isOpen()) {
            this._connection.close();
        }
    };

    proto._messageHandler = function(message, flags){
        //check if str can be parsed by JSON
        var IsJsonString = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        if(!message || !message.data)
            return;
        //todo::temp function, add json parse check later
        //var messageData = message.data.replace(/'/g, '"');
        var messageData = message.data;
        var data = JSON.parse(messageData);
        this._dispatch(data);
    };

    proto._dispatch = function(dataObj){
        //在此对数据进行分发
        var serviceName = dataObj["service"], funcName = dataObj["functionName"];
        if(!serviceName|| !funcName){
            console.log("No such service or function", serviceName, funcName, dataObj);
            return;
        }

        var service = this.getService(serviceName);
        if(service){
            var wsFunc = service.getFunction(funcName);
            if(wsFunc) //async function
                wsFunc.dispatchResponse(dataObj["data"]);
        }
    };

    proto.addEventListener = function(eventType, handler){
        if(!this._connection)
            return;
        this._connection.addEventListener(eventType, handler);
    };

    proto.getConnectionStatus  = function() {
        if (!this._connection)
            return -1;       //not initial status
        return this._connection.readyState;
    };

    proto.addService = function(service){
        var services = this._services;
        if(!service || services.indexOf(service) > -1)
            return;

        var oldService = this.getService(service.name);
        if(oldService){
            //注销已注册的Service.
            var oldIdx = services.indexOf(oldService);
            services.splice(oldIdx,1);
            //todo::add unregister function to WebSocketService
            oldService.unregister();
        }

        //add
        services.push(service);
    };

    proto.getService = function(serviceName){
        var services = this._services;
        for( var i = 0; i < services.length; i++){
            if(services[i].name === serviceName)
                return services[i];
        }
    };

    proto.callAPIOnce = function (serviceName, funcName, data) {
        var APIError = Error;

        var deferred;
        if (Q) {
            deferred = Q.defer();
        }
        else if (typeof Promise === 'function') {
            deferred = {};
            deferred.promise = new Promise(function (resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
        }
        else {
            throw Error("No promises implementation available.");
        }

        var service = this.getService(serviceName, true);
        if (service) {
            var wsFunc = service[funcName];
            if (wsFunc) {
                if (wsFunc.isSync) {
                    //append request id if needed
                    data = wsFunc.appendSyncKey(data, this.getRequestId());
                    wsFunc.request(data);
                    var key = wsFunc.generateSyncKey(data);
                    wsFunc.onceSync(key, function (res) {
                        if (res && res.status == 200) {
                            deferred.resolve(res);
                        }
                        else {
                            deferred.reject(Error(res.errorMessage || res.error || JSON.stringify(res)));
                        }
                    });
                }
                else {
                    wsFunc.request(data);
                    wsFunc.once(function (res) {
                        if (res && res.status == 200) {
                            deferred.resolve(res);
                        }
                        else {
                            deferred.reject(Error(res.errorMessage || res.error || JSON.stringify(res)));
                        }
                    });
                }
            }
            else {
                deferred.reject(APIError("Invalid func name: " + funcName));
            }
        }
        else {
            deferred.reject(APIError("Invalid service name: " + serviceName));
        }
        return deferred.promise;
    };

    return WebSocketClient;
}));