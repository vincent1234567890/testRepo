//add the common widget for game

var PlayerInfoWidget = cc.Node.extend({
    _lbPlayerName: null,
    _lbPlayerCredit: null,
    ctor: function(){
        cc.Node.prototype.ctor.call(this);

        //load spriteFrame
        if(!cc.spriteFrameCache.getSpriteFrame(ReferenceName.NameBG)){
            cc.spriteFrameCache.addSpriteFrames(res.LobbyUIPlist);
        }

        //register event listener to update player info
        //(bg size = 190 x 48)
        let spPlayerNameBg = new cc.Sprite(ReferenceName.NameBG);
        spPlayerNameBg.setPosition(95, 0);
        this.addChild(spPlayerNameBg);

        let lbPlayerName = this._lbPlayerName = new cc.LabelTTF("Guest001", "Arial", 22);
        lbPlayerName.fontWeight = "bold";
        //lbPlayerName.setFontFillColor(new cc.Color(255, 255, 255, 255));  //default
        lbPlayerName.enableStroke(new cc.Color(0, 0, 0, 255), 2);
        spPlayerNameBg.addChild(lbPlayerName);
        lbPlayerName.setPosition(95, 24);

        //bg size (237 x 48)
        let spPlayerCreditBg = new cc.Sprite(ReferenceName.LobbyCoinsBG);
        spPlayerCreditBg.setPosition(315, 0);
        this.addChild(spPlayerCreditBg);

        let lbPlayerCredit = this._lbPlayerCredit = new cc.LabelTTF("2,500", "Arial", 30);
        lbPlayerCredit.fontWeight = "bold";
        lbPlayerCredit.setFontFillColor(new cc.Color(255, 205, 60, 255));
        lbPlayerCredit.enableStroke(new cc.Color(90, 24, 8, 255), 3);
        spPlayerCreditBg.addChild(lbPlayerCredit);
        lbPlayerCredit.setPosition(119, 24);
    },

    updatePlayerCredit: function(playerCredit){
        if(!playerCredit)
            playerCredit = 0;
        this._lbPlayerCredit.setString(playerCredit.toLocaleString('en-US', {maximumFractionDigits: 2}));
    },

    updatePlayerName: function(playerName){
        if(!playerName)
            return;
        this._lbPlayerName.setString(playerName);
    }
});