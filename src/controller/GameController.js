//the game controller uses to manage game status and save game config, etc.
var ef = ef || {};
let GameController = (function(){
    let GameController = cc.Class.extend({
        _currentMultiple: 0,
        _soundVolume: 1,
        _musicVolume: 1,
        _currentSeat: 0,
        _isInFocus: true,
        _isInGame: false,
        _leaveGameTimeout: null,
        ctor: function() {
            this._currentMultiple = 1;
            if (cc.sys.localStorage.getItem("sound_volume") === null) {
                this._soundVolume = 0.5;
                cc.sys.localStorage.setItem("sound_volume", 0.5);
            } else
                this._soundVolume = cc.sys.localStorage.getItem("sound_volume");

            if (cc.sys.localStorage.getItem("music_volume") === null) {
                this._soundVolume = 0.5;
                cc.sys.localStorage.setItem("music_volume", 0.5);
            } else
                this._soundVolume = cc.sys.localStorage.getItem("music_volume");

            cc.audioEngine.setMusicVolume(this._musicVolume);
            cc.audioEngine.setEffectsVolume(this._soundVolume);

            const self = this;
            cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
                self._isInFocus = false;
                //wait 5s, then leave the game.
                if (self.isInGame()) {
                    self._leaveGameTimeout = setTimeout(function () {
                        ClientServerConnect.leaveGame();
                        GameManager.exitToLobby();
                    }, 5000);
                }
            });
            cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
                self._isInFocus = true;
                //ClientServerConnect
                if (self._leaveGameTimeout) {
                    clearTimeout(self._leaveGameTimeout);
                    self._leaveGameTimeout = null;
                }
                if (!cc.audioEngine.isMusicPlaying())
                    cc.audioEngine.resumeMusic();
            });
        },

        isInFocus: function(){
            return this._isInFocus;
        },

        isInGame: function(){
            return this._isInGame;
        },

        enterGame: function(){
            this._isInGame = true;
        },

        leaveGame: function(){
            this._isInGame = false;
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
            if(soundVolume === null)
                return;
            this._soundVolume = soundVolume;
            cc.sys.localStorage.setItem("sound_volume", soundVolume.toFixed(2));
            cc.audioEngine.setEffectsVolume(soundVolume);
        },

        getMusicVolume: function(){
            return this._musicVolume;
        },

        setMusicVolume: function(musicVolume){
            if(musicVolume === null)
                return ;
            this._musicVolume = musicVolume;
            cc.sys.localStorage.setItem("music_volume", musicVolume.toFixed(2));
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