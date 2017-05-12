//the game controller uses to manage game status and save game config, etc.
var ef = ef || {};
let GameController = (function(){
    let GameController = cc.Class.extend({
        _currentMultiple: 0,
        ctor: function(){
            this._currentMultiple = 1;
        },

        getCurrentMultiple: function(){
            return this._currentMultiple;
        },

        setCurrentMultiple: function(multiple){
            this._currentMultiple = multiple;
        }
    });


    return GameController;
})();