var JackpotFloatPanel = cc.LayerColor.extend({
    ctor: function(){
        cc.LayerColor.prototype.ctor.call(this, new cc.Color(10, 10, 10, 128));

        cc.spriteFrameCache.addSpriteFrames(res.LobbyJackpotPlist);
        cc.spriteFrameCache.addSpriteFrames(res.JackpotMiniGamePlist);

        this._layerEventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                let target = event.getCurrentTarget();
                return cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                    target.convertToNodeSpace(touch.getLocation()));
            },
            onTouchEnded: function (touch, event) {
                let target = event.getCurrentTarget();
                if (cc.rectContainsPoint(cc.rect(0, 0, target._contentSize.width, target._contentSize.height),
                        target.convertToNodeSpace(touch.getLocation()))) {
                    //do nothing 屏蔽事件
                }
            }
        });

        let spJackpotPopBase = new ccui.Scale9Sprite(ReferenceName.JackpotPopBase, new cc.Rect(20, 20, 108, 93));
        spJackpotPopBase.setPreferredSize(new cc.Size(517, 452));
        this.addChild(spJackpotPopBase);
        spJackpotPopBase.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);

        let spJackpotPopFrame1 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame1.setPreferredSize(new cc.Size(371, 125));
        spJackpotPopBase.addChild(spJackpotPopFrame1);
        spJackpotPopFrame1.setPosition(517 * 0.5, 332);

        let spJackpotPopFrame2 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame2.setPreferredSize(new cc.Size(260, 92));
        spJackpotPopBase.addChild(spJackpotPopFrame2);
        spJackpotPopFrame2.setPosition(517 * 0.5, 180);

        let spJackpotPopFrame3 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame3.setPreferredSize(new cc.Size(166, 72));
        spJackpotPopBase.addChild(spJackpotPopFrame3);
        spJackpotPopFrame3.setPosition(163, 48);

        let spJackpotPopFrame4 = new ccui.Scale9Sprite(ReferenceName.JackpotPopFrame, new cc.Rect(20, 20, 86, 26));
        spJackpotPopFrame4.setPreferredSize(new cc.Size(166, 72));
        spJackpotPopBase.addChild(spJackpotPopFrame4);
        spJackpotPopFrame4.setPosition(358, 48);
    },

    onEnter: function(){
        cc.LayerColor.prototype.onEnter.call(this);
        if (this._layerEventListener && !this._layerEventListener._isRegistered())
            cc.eventManager.addListener(this._layerEventListener, this);
    },

    cleanup: function(){
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.LobbyJackpotPlist);
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.JackpotMiniGamePlist);
        cc.LayerColor.prototype.cleanup.call(this);
    }
});
