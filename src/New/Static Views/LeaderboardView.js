/**
 * Created by eugeneseah on 30/3/17.
 */

const LeaderboardView = (function () {
    const ZORDER = 10;
    let _parent;
    let _popup;

    const LeaderboardView = function () {
        _parent = new cc.Node();
        _popup= new FloatingMenuPopupBasePrefab(dismissCallback);

        const textBG = new cc.Sprite(ReferenceName.LeaderboardTextBackground);
        const title = new cc.Sprite(ReferenceName.LeaderboardTitleChinese);

        textBG.setPosition(new cc.p(567.5,345));
        title.setPosition(new cc.p(560,705));

        _popup.getBackground().addChild(textBG,1);
        _popup.getBackground().addChild(title,1);

        _popup.getParent().setPosition(new cc.p(683,384));

        _parent.addChild(_popup.getParent());

        GameView.addView(_parent,ZORDER);
    };

    function dismissCallback(touch) {
        _parent.setLocalZOrder(-1000);
        _parent.setVisible(false);
    }

    const proto = LeaderboardView.prototype;

    proto.show = function () {
        _parent.setLocalZOrder(ZORDER);
        _parent.setVisible(true);
        _popup.show();
    };

    return LeaderboardView;
}());