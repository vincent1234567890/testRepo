var LayerCount = 5;
var StartLayerTag = 1;
var StageLoadingLayerTag = 3;
var ShopLayerTag = 4;
var ShipRefitTag = 5;

var MainMenuScene = cc.Scene.extend({
    _isSubLayer:false,
    _startLayer:0,
    init:function () {
        if (this._super()) {
            var startLayer = StartMenuLayer.create();
            this.addChild(startLayer, 10, StartLayerTag);
            this._isSubLayer = false;
        }
        return true;
    },
    showMoreGame:function () {
    },
    showOption:function () {
        playEffect(UI_EFFECT_03);
    },
    showHowToPlay:function () {
        if (this.getChildByTag(StageLoadingLayerTag)) {
            return;
        }
        var duration_ = 10;
        var inDeltaZ, inAngleZ;

        var orientation = cc.ORIENTATION_UP_OVER;
        if (orientation == cc.ORIENTATION_UP_OVER) {
            inDeltaZ = 90;
            inAngleZ = 270;
        } else {
            inDeltaZ = -90;
            inAngleZ = 90;
        }
        var inA = cc.Sequence.actions(
            cc.DelayTime.create(duration_ / 2),
            cc.Show.create(),
            cc.OrbitCamera.create(duration_ / 2, 1, 0, inAngleZ, inDeltaZ, 90, 0));

        this._startLayer.runAction(inA);
    },
    showPlayerSelection:function () {
    },
    gameShop:function () {
    },
    shipAlteration:function () {
    },
    removeOtherButThis:function (node) {
        for (var i = 1; i <= LayerCount; i++) {
            if (node.getTag() == i) {
                continue;
            }
            if (this.getChildByTag(i)) {
                this.removeChildByTag(i, true);
            }
        }
    },
    showSelectStage:function () {
        // 显示排行榜
        this._startLayer._menuSelectStage(0);
    },
    playBackMusic:function () {
        playMusic(BACK_MUSIC1, true);
    },

    initWithDef:function (def) {
        this._startLayer = StartMenuLayer.create();
        this.addChild(this._startLayer, 10, StartLayerTag);
        this._isSubLayer = false;
        this.playBackMusic();

        return true;
    },
    update:function (dt) {
        this._super(dt);
    },
    changeCtrl:function (type) {
    },
    getIsSubLayer:function () {
        return this._isSubLayer;
    },
    setIsSubLayer:function (Var) {
        if (Var != this._isSubLayer) {
            this._isSubLayer = Var;
            if (this._startLayer) {
                var mainMenu = this._startLayer.getChildByTag(eTag_MainMenu_StartMenu_menu);
                if (mainMenu) {
                    mainMenu.isTouchEnabled(!this._isSubLayer);
                }
            }
        }
    },
    stopAct:function (sender) {
        this._startLayer.stopAllActions();
    },
    backToMenu:function () {
    },
    showHiScoreOver:function () {
        playEffect(UI_EFFECT_03);
        this.removeChildByTag(998, true);
        this.removeChildByTag(999, true);
        this.setIsSubLayer(false);
    }
});

MainMenuScene.create = function () {
    var ret = new MainMenuScene();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};