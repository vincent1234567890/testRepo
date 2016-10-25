/**
 * Created by eugeneseah on 25/10/16.
 */

var CannonView = cc.Sprite.extend({
    _className: "CannonView",



    //@param {String} spriteResource path (use res)
    ctor: function(spriteResource){
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.GameUIPlist);
        cc.Sprite.prototype.ctor.call(this, "#" + ReferenceName.Cannon);
        this.setPosition(300,300);
    },



});