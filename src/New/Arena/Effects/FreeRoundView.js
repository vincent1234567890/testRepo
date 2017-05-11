/**
 * Created by eugeneseah on 24/4/17.
 */

const FreeRoundView = (function () {
    const FreeRoundView = function () {
        "use strict";
        const _parent = new cc.Node();
        const FRTitle = new cc.Sprite(res.FreeRoundTitle);
        const animation = GUIFunctions.getAnimation(ReferenceName.FreeRoundExplosionEffect,0.05);

        const _animationSequence = new cc.Sequence(animation, cc.callFunc(onExplosionAnimationEnd));
        const effects = new cc.Sprite();
        effects.setScale(2);

        _parent.addChild(effects);
        _parent.addChild(FRTitle);

        const _titleSequence = new cc.Sequence(new cc.ScaleTo(5, 1.2),cc.callFunc(onTitleAnimationEnd));

        const size = cc.view.getDesignResolutionSize();
        _parent.setPosition(size.width/2, size.height/2);

        _parent.setVisible(false);

        GameView.addView(_parent,11);

        this.show = function () {
            _parent.setVisible(true);
            effects.setVisible(true);
            effects.runAction(_animationSequence.clone());
            FRTitle.runAction(_titleSequence.clone());

            BlockingManager.registerBlock(dismissCallback);
        };

        function onExplosionAnimationEnd() {
            effects.setVisible(false);
        }

        function onTitleAnimationEnd(){
            _parent.setVisible(false);
            FRTitle.setScale(1);
            BlockingManager.deregisterBlock(dismissCallback);
        }

        function dismissCallback() {
            //play game music
            cc.audioEngine.playMusic(res.ArenaGameBGM, true);
        }
    };

    return FreeRoundView;
}());