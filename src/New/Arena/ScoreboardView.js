const ScoreboardView = (function() {
    "use strict";

    let _goToLobby;
    let _goToNewRoom;
    function ScoreboardView(target, data, goToLobby, goToNewRoom) {
        console.log(data);

        _goToLobby = goToLobby;
        _goToNewRoom = goToNewRoom;

        this._parent = new cc.Node();
        GameView.addView(this._parent,100);

        const midX = cc.view.getDesignResolutionSize().width / 2;
        const midY = cc.view.getDesignResolutionSize().height / 2;

        const bg = new cc.Sprite(ReferenceName.ScoreboardBG);
        bg.setPosition(midX,midY);
        this._parent.addChild(bg,99);

        const menu = setupScoreboardMenu(target);
        bg.addChild(menu,1);

        // const touchlayer = new TouchLayerRefactored(touchEater);
        // touchlayer.setSwallowTouches(true);
        // bg.addChild(touchlayer,-1);

        const sessionTime = createGridObject(ReferenceName.SessionTime, ReferenceName.TimeSpentIcon, timeFormatter(data.secondsInGame));
        sessionTime.setPosition(270 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(sessionTime,1);

        const goldSpent = createGridObject(ReferenceName.GoldSpent, ReferenceName.CoinSpentIcon, data.bulletsCost);
        goldSpent.setPosition(660 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(goldSpent,1);

        const goldEarned = createGridObject(ReferenceName.GoldEarned, ReferenceName.CoinEarnedIcon, data.fishWinnings);
        goldEarned.setPosition(1050 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(goldEarned,1);

        const fishCaught = createGridObject(ReferenceName.FishCaught, ReferenceName.TotalFishIcon, data.fishCaught);
        fishCaught.setPosition(270 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(fishCaught,1);

        const goldenFishCaught = createGridObject(ReferenceName.GoldenFishCaught, ReferenceName.GoldenFishIcon, data.goldenFishCaught);
        goldenFishCaught.setPosition(660 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(goldenFishCaught,1);

        const sumArray = array => array.reduce((a, b) => a + b, 0);
        const count = sumArray( Object_values(data.multiCatches || {}).map(mCatch => mCatch.count) );
        let multiCatch = createGridObject(ReferenceName.MultiCatch, ReferenceName.MultiCatchIcon, count);
        multiCatch.setPosition(1050 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(multiCatch,1);

        const bulletsFired = createGridObject(ReferenceName.BulletsFired, ReferenceName.CannonIcon, data.bulletsFired);
        bulletsFired.setPosition(270 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(bulletsFired,1);

        const skillsUsed = createGridObject(ReferenceName.SkillsUsed, ReferenceName.SkillUsedButton, data.skillsUsed);
        skillsUsed.setPosition(660 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(skillsUsed,1);

        // const returnRate = createGridObject(ReferenceName.ReturnRate, ReferenceName.HitRateIcon, Math.round(data.fishCaught / data.fishHit * 100));
        // returnRate.setPosition(1050 , cc.view.getDesignResolutionSize().height - 363);
        // bg.addChild(returnRate,1);
        const returnRate = createGridObject(ReferenceName.ReturnRate, ReferenceName.HitRateIcon, Math.round(data.fishWinnings / data.bulletsCost * 100));
        returnRate.setPosition(1050 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(returnRate,1);

        const scrollBoxBG = new cc.Sprite(ReferenceName.BottomScrollBarBG);
        scrollBoxBG.setPosition(660 , cc.view.getDesignResolutionSize().height - 550);
        bg.addChild(scrollBoxBG,1);

        BlockingManager.registerBlock(touchEater);

    }

    function createGridObject(labelText, spriteName, data){
        let label = new cc.LabelTTF(labelText, "Arial", 26);
        label.setFontFillColor(new cc.Color(0,0,0,255));
        label.setAnchorPoint(0, 0.5);

        fontDef.fontSize = "36";
        //fontDef.fontWeight = "normal";
        //fontDef.fontWeight = "bold";
        fontDef.fontName = "Impact";
        let info;
        if (cc.isNumber(data) || data === undefined) {
            info = new cc.LabelTTF(data && (data * 1.5).toFixed(2).replace(/[.,]00$/, "") || 0, "Impact", 36);
        }else {
            info = new cc.LabelTTF(data, "Impact", 36);
        }
        info.setFontFillColor(new cc.Color(0,0,0,255));

        let icon = new cc.Sprite(spriteName);
        let bg = new cc.Sprite(ReferenceName.InfoSlotBG);

        bg.addChild(label);
        bg.addChild(icon);
        bg.addChild(info);

        label.setPosition(30,74);
        icon.setPosition(44,32);
        info.setPosition(200,32);

        return bg;
    }

    function timeFormatter(seconds) {
        let hh = Math.floor(seconds / 3600);
        let mm = Math.floor((seconds % 3600) / 60);
        let ss = seconds % 60;

        if (hh < 10) {hh = '0' + hh}
        if (mm < 10) {mm = '0' + mm}
        if (ss < 10) {ss = '0' + ss}

        return hh + ':' + mm + ':' + ss;
    }

    function setupScoreboardMenu(target) {
        let lobby = new cc.Sprite(ReferenceName.LobbyButton);
        let play = new cc.Sprite(ReferenceName.PlayButton);

        let lobbyButton = new cc.MenuItemSprite(lobby, undefined, undefined, localGoToLobby, target);
        let playButton = new cc.MenuItemSprite(play, undefined, undefined, localGoToNewRoom, target);

        let lobbyLabel = new cc.LabelTTF(ReferenceName.GoToLobby, "Arial", 50);
        lobbyLabel._setFontWeight("bold");
        lobbyLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        lobbyButton.addChild(lobbyLabel);
        lobbyLabel.setPosition(lobbyButton.getContentSize().width / 2, lobbyButton.getContentSize().height/2);

        let playLabel = new cc.LabelTTF(ReferenceName.GoToNewGame, "Arial", 50);
        playLabel._setFontWeight("bold");
        playLabel.setFontFillColor(new cc.Color(0, 0, 0, 255));
        playButton.addChild(playLabel);
        playLabel.setPosition(lobbyButton.getContentSize().width / 2, lobbyButton.getContentSize().height/2);

        let menu = new cc.Menu(lobbyButton, playButton);
        lobbyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, lobbyButton.getContentSize().height / 2), cc.p(-150, -20)));
        playButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, playButton.getContentSize().height / 2), cc.p(150, -20)));
        menu.setPosition(0,20);

        return menu;
    }

    function touchEater (){


    }

    function localGoToLobby(){
        BlockingManager.deregisterBlock(touchEater);
        _goToLobby();
    }

    function localGoToNewRoom(){
        BlockingManager.deregisterBlock(touchEater);
        _goToNewRoom();
    }

    const proto = ScoreboardView.prototype;

    proto.destroyView = function () {
        if (this._parent) {
            GameView.destroyView(this._parent);
        }
    };

    const Object_values = obj => Object.keys(obj).map(key => obj[key]);

    return ScoreboardView;

}());
