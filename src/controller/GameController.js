//the game controller uses to manage game status and save game config, etc.
var ef = ef || {};
let GameController = (function(){
    let GameController = cc.Class.extend({
        _currentMultiple: 0,
        _soundVolume: 1,
        _musicVolume: 1,
        _currentSeat: 0,
        ctor: function(){
            this._currentMultiple = 1;
            this._soundVolume = cc.sys.localStorage.getItem("sound_volume") || 1;
            this._musicVolume = cc.sys.localStorage.getItem("music_volume") || 1;
            cc.audioEngine.setMusicVolume(this._musicVolume);
            cc.audioEngine.setEffectsVolume(this._soundVolume);
        },

        getCurrentMultiple: function(){
            return this._currentMultiple;
        },

        setCurrentMultiple: function(multiple){
            this._currentMultiple = multiple;
        },

        getSoundVolume: function(){
            return this._soundVolume;
        },

        setSoundVolume: function(soundVolume){
            if(!soundVolume)
                return;
            this._soundVolume = soundVolume;
            cc.audioEngine.setEffectsVolume(soundVolume);
        },

        getMusicVolume: function(){
            return this._musicVolume;
        },

        setMusicVolume: function(musicVolume){
            if(!musicVolume)
                return ;
            this._musicVolume = musicVolume;
            cc.audioEngine.setMusicVolume(musicVolume);
        },

        setCurrentSeat: function(seat){
            this._currentSeat = seat;
        },

        getCurrentSeat: function(){
            return this._currentSeat;
        }
    });


    return GameController;
})();