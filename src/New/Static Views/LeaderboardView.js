/**
 * Created by eugeneseah on 30/3/17.
 */

const LeaderboardView = (function () {
    const ZORDER = 10;
    let _parent;
    let _background;

    const LeaderboardView = function () {
        _parent = new cc.Node();
        BlockingManager.registerBlock(dismissCallback);

        _background = new cc.Sprite(ReferenceName.FloatingPopupBackground);
        const titleBG = new cc.Sprite(ReferenceName.FloatingTitleBackground);
        const textBG = new cc.Sprite(ReferenceName.LeaderboardTextBackground);
        const title = new cc.Sprite(ReferenceName.LeaderboardTitleChinese);
        const deco = new cc.Sprite(ReferenceName.FloatingBottomLeftDeco);

        titleBG.setPosition(new cc.p(560,689));
        textBG.setPosition(new cc.p(567.5,345));
        title.setPosition(new cc.p(315,60));
        deco.setPosition(new cc.p(70,100));

        _background.addChild(titleBG);
        _background.addChild(textBG);
        _background.addChild(deco);

        titleBG.addChild(title);


        _parent.addChild(_background);
        _parent.setPosition(new cc.p(683,384));

        GameView.addView(_parent,ZORDER);
    };
    
    function dismissCallback(touch) {
        if (GUIFunctions.isSpriteTouched(_background,touch)) {
            return;
        }
        _parent.setLocalZOrder(-1000);
        _background.setVisible(false);

        BlockingManager.deregisterBlock(dismissCallback);
    }

    const proto = LeaderboardView.prototype;

    proto.show = function () {
        BlockingManager.registerBlock(dismissCallback);
        _parent.setLocalZOrder(ZORDER);
        _background.setVisible(true);
    };

    return LeaderboardView;
}());