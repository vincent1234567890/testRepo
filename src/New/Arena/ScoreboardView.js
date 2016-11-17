/**
 * Created by eugeneseah on 16/11/16.
 */

var ScoreboardView = function() {

    var ScoreboardView = function ( parent, target, goToLobby, goToNewRoom) {

        this._parent = parent;

        var midX = cc.view.getDesignResolutionSize().width / 2;
        var midY = cc.view.getDesignResolutionSize().height / 2;

        var bg = new cc.Sprite(ReferenceName.ScoreboardBG);
        bg.setPosition(midX,midY);
        this._parent.addChild(bg,-999);

        var sessionTime = createGridObject(ReferenceName.SessionTime, ReferenceName.TimeSpentIcon, "NA");
        sessionTime.setPosition(282 , cc.view.getDesignResolutionSize().height - 183);
        this._parent.addChild(sessionTime,2);

        var goldSpent = createGridObject(ReferenceName.GoldSpent, ReferenceName.CoinSpentIcon, "NA");
        goldSpent.setPosition(682 , cc.view.getDesignResolutionSize().height - 183);
        this._parent.addChild(goldSpent,2);

        var goldEarned = createGridObject(ReferenceName.GoldEarned, ReferenceName.CoinEarnedIcon, "NA");
        goldEarned.setPosition(1082 , cc.view.getDesignResolutionSize().height - 183);
        this._parent.addChild(goldEarned,2);

        var fishCaught = createGridObject(ReferenceName.FishCaught, ReferenceName.TotalFishIcon, "NA");
        fishCaught.setPosition(282 , cc.view.getDesignResolutionSize().height - 273);
        this._parent.addChild(fishCaught,2);

        var goldenFishCaught = createGridObject(ReferenceName.GoldenFishCaught, ReferenceName.GoldenFishIcon, "NA");
        goldenFishCaught.setPosition(682 , cc.view.getDesignResolutionSize().height - 273);
        this._parent.addChild(goldenFishCaught,2);

        var multiCatch = createGridObject(ReferenceName.MultiCatch, ReferenceName.MultiCatchIcon, "NA");
        multiCatch.setPosition(1082 , cc.view.getDesignResolutionSize().height - 273);
        this._parent.addChild(multiCatch,2);

        var bulletsFired = createGridObject(ReferenceName.BulletsFired, ReferenceName.CannonIcon, "NA");
        bulletsFired.setPosition(282 , cc.view.getDesignResolutionSize().height - 363);
        this._parent.addChild(bulletsFired,2);

        var skillsUsed = createGridObject(ReferenceName.SkillsUsed, ReferenceName.SkillUsedButton, "NA");
        skillsUsed.setPosition(682 , cc.view.getDesignResolutionSize().height - 363);
        this._parent.addChild(skillsUsed,2);

        var catchSuccessRate = createGridObject(ReferenceName.CatchSuccessRate, ReferenceName.HitRateIcon, "NA");
        catchSuccessRate.setPosition(1082 , cc.view.getDesignResolutionSize().height - 363);
        this._parent.addChild(catchSuccessRate,2);

        var scrollBoxBG = new cc.Sprite(ReferenceName.BottomScrollBarBG);
        scrollBoxBG.setPosition(679 , cc.view.getDesignResolutionSize().height - 550);
        this._parent.addChild(scrollBoxBG,-2);

        setupScoreboardMenu(bg, goToLobby, goToNewRoom, target);

    };

    function createGridObject(labelText, spriteName, data){
        var fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "20";
      //  fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        fontDef.fillStyle = new cc.Color(0,0,0,255);
        var label = new cc.LabelTTF(labelText, fontDef, cc.TEXT_ALIGNMENT_LEFT);

        fontDef.fontSize = "20";

        var info = new cc.LabelTTF(data,fontDef);

        var icon = new cc.Sprite(spriteName);


        var bg = new cc.Sprite(ReferenceName.InfoSlotBG);

        bg.addChild(label);
        bg.addChild(icon);
        bg.addChild(info);

        label.setPosition(100,70);
        icon.setPosition(44,32);
        info.setPosition(200,30);

        return bg;
    }


    function setupScoreboardMenu(parent, goToLobby, goToNewRoom, target) {
        var lobby = new cc.Sprite(ReferenceName.LobbyButton);
        var play = new cc.Sprite(ReferenceName.PlayButton);

        var lobbyButton = new cc.MenuItemSprite(lobby, undefined, undefined, goToLobby, target);
        var playButton = new cc.MenuItemSprite(play, undefined, undefined, goToNewRoom, target);


        var menu = new cc.Menu(lobbyButton, playButton);
        lobbyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, lobbyButton.getContentSize().height / 2), cc.p(-150, -20)));
        playButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, playButton.getContentSize().height / 2), cc.p(150, -20)));
        menu.setPosition(0,20);
        parent.addChild(menu, 100);

    }

    return ScoreboardView;
}();
