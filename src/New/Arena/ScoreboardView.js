/**
 * Created by eugeneseah on 16/11/16.
 */

const ScoreboardView = (function() {
    "use strict";
    return function ( parent, target, data, goToLobby, goToNewRoom) {

        this._parent = parent;

        const midX = cc.view.getDesignResolutionSize().width / 2;
        const midY = cc.view.getDesignResolutionSize().height / 2;

        let bg = new cc.Sprite(ReferenceName.ScoreboardBG);
        bg.setPosition(midX,midY);
        this._parent.addChild(bg,99);

        let sessionTime = createGridObject(ReferenceName.SessionTime, ReferenceName.TimeSpentIcon, timeFormatter(data.secondsInGame));
        sessionTime.setPosition(282 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(sessionTime);

        let goldSpent = createGridObject(ReferenceName.GoldSpent, ReferenceName.CoinSpentIcon, data.bulletsCost);
        goldSpent.setPosition(682 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(goldSpent);

        let goldEarned = createGridObject(ReferenceName.GoldEarned, ReferenceName.CoinEarnedIcon, data.fishWinnings);
        goldEarned.setPosition(1082 , cc.view.getDesignResolutionSize().height - 183);
        bg.addChild(goldEarned);

        let fishCaught = createGridObject(ReferenceName.FishCaught, ReferenceName.TotalFishIcon, data.fishCaught);
        fishCaught.setPosition(282 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(fishCaught);

        let goldenFishCaught = createGridObject(ReferenceName.GoldenFishCaught, ReferenceName.GoldenFishIcon, data.goldenFishCaught);
        goldenFishCaught.setPosition(682 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(goldenFishCaught);

        // data.multiCatches :
        let count = 0;
        if (data.multiCatches) {
            for (let fmultiCatch in data.multiCatches) {
                count += data.multiCatches[fmultiCatch].count * multiCatch;
            }
        }
        let multiCatch = createGridObject(ReferenceName.MultiCatch, ReferenceName.MultiCatchIcon, count);
        multiCatch.setPosition(1082 , cc.view.getDesignResolutionSize().height - 273);
        bg.addChild(multiCatch);

        let bulletsFired = createGridObject(ReferenceName.BulletsFired, ReferenceName.CannonIcon, data.bulletsFired);
        bulletsFired.setPosition(282 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(bulletsFired);

        let skillsUsed = createGridObject(ReferenceName.SkillsUsed, ReferenceName.SkillUsedButton, data.skillsUsed);
        skillsUsed.setPosition(682 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(skillsUsed);

        let catchSuccessRate = createGridObject(ReferenceName.CatchSuccessRate, ReferenceName.HitRateIcon, Math.round(data.fishCaught / data.fishHit * 100));
        catchSuccessRate.setPosition(1082 , cc.view.getDesignResolutionSize().height - 363);
        bg.addChild(catchSuccessRate);

        let scrollBoxBG = new cc.Sprite(ReferenceName.BottomScrollBarBG);
        scrollBoxBG.setPosition(679 , cc.view.getDesignResolutionSize().height - 550);
        bg.addChild(scrollBoxBG);

        setupScoreboardMenu(bg, goToLobby, goToNewRoom, target);

        let touchlayer = new TouchLayerRefactored(touchEater);
        touchlayer.setSwallowTouches(true);

        bg.addChild(touchlayer,-1);

    };

    function createGridObject(labelText, spriteName, data){
        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        //fontDef.fontWeight = "bold";
        fontDef.fontSize = "26";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);

        let label = new cc.LabelTTF(labelText, fontDef);
        label.setAnchorPoint(0, 0.5);

        fontDef.fontSize = "36";
        //fontDef.fontWeight = "normal";
        //fontDef.fontWeight = "bold";
        fontDef.fontName = "Impact";

        let info = new cc.LabelTTF(data || 0,fontDef);

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


    function setupScoreboardMenu(parent, goToLobby, goToNewRoom, target) {
        let lobby = new cc.Sprite(ReferenceName.LobbyButton);
        let play = new cc.Sprite(ReferenceName.PlayButton);

        let lobbyButton = new cc.MenuItemSprite(lobby, undefined, undefined, goToLobby, target);
        let playButton = new cc.MenuItemSprite(play, undefined, undefined, goToNewRoom, target);

        let fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "50";
        fontDef.fontWeight = "bold";
        fontDef.fillStyle = new cc.Color(0,0,0,255);

        let lobbyLabel = new cc.LabelTTF(ReferenceName.GoToLobby, fontDef);
        lobbyButton.addChild(lobbyLabel);
        lobbyLabel.setPosition(lobbyButton.getContentSize().width / 2, lobbyButton.getContentSize().height/2);

        let playLabel = new cc.LabelTTF(ReferenceName.GoToNewGame, fontDef);
        playButton.addChild(playLabel);
        playLabel.setPosition(lobbyButton.getContentSize().width / 2, lobbyButton.getContentSize().height/2);


        let menu = new cc.Menu(lobbyButton, playButton);
        lobbyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, lobbyButton.getContentSize().height / 2), cc.p(-150, -20)));
        playButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, playButton.getContentSize().height / 2), cc.p(150, -20)));
        menu.setPosition(0,20);
        parent.addChild(menu);


    }

    function touchEater (){


    }

}());
