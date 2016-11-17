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
        this._parent.addChild(bg);

        var sessionTime = createGridObject(ReferenceName.SessionTime, ReferenceName.TimeSpentIcon, "NA");

        var goldSpent = createGridObject(ReferenceName.GoldSpent, ReferenceName.CoinSpentIcon, "NA");
        var goldEarned = createGridObject(ReferenceName.GoldEarned, ReferenceName.CoinEarnedIcon, "NA");
        var fishCaught = createGridObject(ReferenceName.FishCaught, ReferenceName.TotalFishIcon, "NA");
        var goldenFishCaught = createGridObject(ReferenceName.GoldenFishCaught, ReferenceName.GoldenFishIcon, "NA");
        var multiCatch = createGridObject(ReferenceName.MultiCatch, ReferenceName.MultiCatchIcon, "NA");
        var bulletsFired = createGridObject(ReferenceName.BulletsFired, ReferenceName.CannonIcon, "NA");
        var skillsUsed = createGridObject(ReferenceName.SkillsUsed, ReferenceName.SkillUsedButton, "NA");
        var catchSuccessRate = createGridObject(ReferenceName.CatchSuccessRate, ReferenceName.HitRateIcon, "NA");

        var scrollBoxBG = new cc.Sprite(ReferenceName.BottomScrollBarBG);
        scrollBoxBG.setPosition(midX,midY);
        this._parent.addChild(scrollBoxBG);

        setupScoreboardMenu(bg, goToLobby, goToNewRoom, target);

    };

    function createGridObject(labelText, spriteName, data){
        var fontDef = new cc.FontDefinition();
        fontDef.fontName = "Arial";
        fontDef.fontSize = "32";
        fontDef.textAlign = cc.TEXT_ALIGNMENT_LEFT;
        var label = new cc.LabelTTF(labelText, fontDef);

        fontDef.fontSize = "20";

        var info = new cc.LabelTTF(data,fontDef);

        var icon = new cc.Sprite(spriteName);


        var bg = new cc.Sprite(ReferenceName.InfoSlotBG);

        bg.addChild(label);
        bg.addChild(icon);
        bg.addChild(info);

        label.setPosition(0,10);
        icon.setPosition(-10,0);
        info.setPosition(10,0);

        return bg;
    }


    function setupScoreboardMenu(parent, goToLobby, goToNewRoom, target) {
        var lobby = new cc.Sprite(ReferenceName.LobbyButton);
        var play = new cc.Sprite(ReferenceName.PlayButton);

        var lobbyButton = new cc.MenuItemSprite(lobby, undefined, undefined, goToLobby, target);
        var playButton = new cc.MenuItemSprite(play, undefined, undefined, goToNewRoom, target);


        var menu = new cc.Menu(lobbyButton, playButton);
        lobbyButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, lobbyButton.getContentSize().height / 2), cc.p(-92, -20)));
        playButton.setPosition(cc.pAdd(cc.p(menu.getContentSize().width / 2, playButton.getContentSize().height / 2), cc.p(92, -20)));
        parent.addChild(menu);

    }

    return ScoreboardView;
}();