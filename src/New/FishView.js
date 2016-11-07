/**
 * Created by eugeneseah on 3/11/16.
 */

var FishView = (function(){
    
    var FishView = cc.Sprite.extend({
        _className : "FishView",
        type : -1,

        ctor: function (parent, fishType) {
            this._super("#Sting ray_00000.png");
            this.type = fishType;

            var frameArray = []
            var name =  "Sting ray_";

            for (var i = 0; i < 16 /*???*/; i++){
                var number = i + '';
                while (number.length < 5){
                    number = '0' + number;
                }
                var frameName = name + number + '.png';
                var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
                frameArray.push(frame);
            }
            // create the animation out of the frames
            var animation = new cc.Animation(frameArray, 0.1);
            var animate = new cc.Animate(animation);

// run it and repeat it forever
            this.runAction(new cc.RepeatForever(animate));




            parent.addChild(this, 200);
        },






    });
    return FishView;
})();