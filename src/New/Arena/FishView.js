/**
 * Created by eugeneseah on 3/11/16.
 */

const FishView = (function () {

    return cc.Sprite.extend({
        _className: "FishView",
        _currentAnimationAction: null,
        // type : -1,

        ctor: function (parent, fishType) {
            this.type = fishType;


            // seems only useful to set and initialise rect/sprite box for sprite (otherwise it would be 0)
            // can be removed for production
            let number = '0';
            while (number.length < 5){
                number = '0' + number;
            }
            const frameName = '#' + fishType + '_' + number + '.png';
            this._super(frameName);

            this.doAnimation(FishAnimationEnum.default);


            this.setScale(0.5);
            parent.addChild(this, -1);

        },

        doAnimation : function(fishAnimationEnum) {
            if (this._currentAnimationAction) {
                this.stopAction(this._currentAnimationAction);
            }
            const data = FishAnimationData[this.type][fishAnimationEnum];
            if (data.pivot){
                this.setAnchorPoint(data.pivot);
            }

            const sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
            this._currentAnimationAction = new cc.RepeatForever(sequence);
            this.runAction(this._currentAnimationAction);

        },




    });
})();
