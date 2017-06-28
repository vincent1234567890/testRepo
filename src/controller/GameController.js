//the game controller uses to manage game status and save game config, etc.
var ef = ef || {};

ef.DEFAULT_FONT = "Arial";
const LockFishStatus = {
    RELEASE: 0,
    LOCK: 1,
    SWITCHING: 2,
    LOCKED: 3
};

const PlayerSeatDirection = {
    HORIZONTAL: 0,
    VERTICAL: 1,
    DW_VERTICAL: 2
};
let GameController = (function(){
    let GameController = cc.Class.extend({
        _currentMultiple: 0,
        _soundVolume: 0.5,
        _musicVolume: 0.5,
        _currentSeat: 0,
        _isInFocus: true,
        _isInGame: false,
        _isLockMode: LockFishStatus.RELEASE,
        _leaveGameTimeout: null,
        _currentPlayer: null,
        _lobbyPageNum: 0,
        _lobbyPageTotal: 0,
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
                this._musicVolume = cc.sys.localStorage.getItem("music_volume");

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

        setCurrentPlayer: function(player){
            //remove the player event
            this._currentPlayer = player;
        },

        getCurrentPlayer: function(){
            return this._currentPlayer;
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
            this._isLockMode = LockFishStatus.RELEASE;  //leave game, lockMode auto set to 'RELEASE'
        },

        getLockMode: function(){
            return this._isLockMode;
        },

        setLockMode: function(lock){
            this._isLockMode = lock;
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
            if(soundVolume < 0)
                soundVolume = 0;
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
            if(musicVolume < 0)
                musicVolume = 0;
            this._musicVolume = musicVolume;
            cc.sys.localStorage.setItem("music_volume", musicVolume.toFixed(2));
            cc.audioEngine.setMusicVolume(musicVolume);
        },

        setCurrentSeat: function(seat){
            this._currentSeat = seat;
        },

        getCurrentSeat: function(){
            return this._currentSeat;
        },

        getCurLobbyPage: function () {
            return this._lobbyPageNum;
        },
        setCurLobbyPage: function (type) {
            switch (type) {
                case 'next':
                    this._lobbyPageNum = Math.min(this._lobbyPageTotal - 1, this._lobbyPageNum + 1);
                    break;
                case 'prev':
                    this._lobbyPageNum = Math.max(0, this._lobbyPageNum - 1);
                    break;
                default:
                    this._lobbyPageNum = type;
            }
            return this._lobbyPageNum;
        },
        getTotalLobbyPage: function () {
            return this._lobbyPageTotal;
        },
        setTotalLobbyPage: function (num) {
            this._lobbyPageTotal = num;
        },
        setTablePanel: function (panel) {
            this._tablePanel = panel;
        },
        getTablePanel: function () {
            return this._tablePanel;
        },

    });

    cc.EventHelper.prototype.apply(GameController.prototype);
    return GameController;
})();