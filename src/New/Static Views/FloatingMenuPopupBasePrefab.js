/**
 * Created by eugeneseah on 31/3/17.
 */

const FloatingMenuPopupBasePrefab = (function () {
    const ZORDER = 10;
    let _parent;
    let _background;

    const FloatingMenuPopupBasePrefab = function () {


        _parent = new cc.Node();
        BlockingManager.registerBlock(dismissCallback);

        _background = new cc.Sprite(ReferenceName.FloatingPopupBackground);
        const titleBG = new cc.Sprite(ReferenceName.FloatingTitleBackground);
        const deco = new cc.Sprite(ReferenceName.FloatingBottomLeftDeco);

        const closeButton = new

        titleBG.setPosition(new cc.p(560,689));
        title.setPosition(new cc.p(315,60));
        deco.setPosition(new cc.p(70,100));

        _background.addChild(titleBG);
        _background.addChild(deco,10);

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

    proto.getParent = function(){
        return _parent;
    };

    proto.getBackground = function () {
         return _background;
    };

    return LeaderboardView;
}());