/**
 * Created by eugeneseah on 3/11/16.
 */

var FishView = (function () {

    var FishView = cc.Sprite.extend({
        _className: "FishView",
        _currentAnimationAction: null,
        // type : -1,

        ctor: function (parent, fishType) {
            this.type = fishType;
            this.doAnimation(FishAnimationEnum.default)

            this._super();
            this.setScale(0.5);
            parent.addChild(this, -1);
        },

        doAnimation : function(fishAnimationEnum) {
            if (this._currentAnimationAction) {
                this.stopAction(this._currentAnimationAction);
            }
            var data = FishAnimationData[this.type][fishAnimationEnum];

            var sequence = new cc.Sequence(data.animation.clone(), new cc.DelayTime(data.animationInterval));
            this._currentAnimationAction = new cc.RepeatForever(sequence);
            this.runAction(this._currentAnimationAction);

        },


    });
    return FishView;
})();