ChromeStorage = cc.UserDefault.extend({
    _db:null,
    _chromeStorage:null,
    _tmpValue:null,
    init:function () {
        this._chromeStorage = this._getLocalStorage();
        if (this._chromeStorage) {
            this._db = this._chromeStorage.sync;

           /* this._chromeStorage.onChanged.addListener(function (changes, namespace) {
                if (changes["myValue"]) {
                    valueChanged(changes["myValue"].newValue);
                }
                debugChanges(changes, namespace);
            });*/
            return true;
        }
        return false;
    },
    setStorageType:function (type) {
        if (type = ChromeStorage.Type.sync) {
            this._db = this._chromeStorage.sync;
        }
        else {
            this._db = this._chromeStorage.local
        }
    },
    _getLocalStorage:function () {
        try {
            if (!!window['chrome']['storage']) {
                return window['chrome']['storage'];
            }
        } catch (e) {
            return undefined;
        }
    },
    _setValueForKey:function (key, value) {
        if (this._db) {
            var temp = {};
            temp[key] = value;
            this._db.set(temp);
        }
    },
    _getValueForKey:function (key) {
        if (this._db) {
            var temp = {};
            temp.test = 123;
            this._db.get(key, function (data) {
                temp.val = data[key];
            });
            return temp.val;
        }
    },
    _returnValue:function(v){
        return v;
    }

});

ChromeStorage.Type = {
    local:0,
    sync:1
};

ChromeStorage.getInstance = function () {
    if (!this._sUserDefault) {
        this._sUserDefault = new ChromeStorage();
        this._sUserDefault.init();
    }

    return this._sUserDefault;
};

ChromeStorage.purgeInstanceUserDefault = function () {
    if (this._db) {
        this._db.clear();
    }
};

ChromeStorage_sUserDefault = null;
ChromeStorage_isFilePathInitialized = false;