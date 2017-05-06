//need delete.
const AnimatedButton = (function () {
    "use strict";
    const AnimatedButton = function (animationName, animationSpeed, isToggle, callback) {
        this._parent = new cc.Node();
        const _wrapper = new ccui.Widget();

        const animation = GUIFunctions.getAnimation(animationName, animationSpeed);
        const _animationSequence = new cc.Sequence(animation, cc.callFunc(onAnimationEnd));
        const _spriteTarget = new cc.Sprite();
        const frame = animation.getAnimation().getFrames()[0];
        const animate = new cc.Animate(new cc.Animation([frame.clone()], 0.01));
        _spriteTarget.runAction(new cc.Sequence(animate));

        let isOn = false;
        const touchEvent = (sender, type) => {
            // console.log("touch",sender,type);
            switch (type) {
                case ccui.Widget.TOUCH_MOVED:
                    break;
                case ccui.Widget.TOUCH_BEGAN:
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    _toggle();
                    callback(isToggle && isOn);

                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    break;
            }
        };

        _wrapper.addChild(_spriteTarget);
        const size = frame.getSpriteFrame().getRect();
        _wrapper.setContentSize(size.width, size.height);
        _spriteTarget.setPosition(size.width / 2, size.height / 2);
        _wrapper.setTouchEnabled(true);
        _wrapper.addTouchEventListener(touchEvent);
        this._parent.addChild(_wrapper);

        function onAnimationEnd() {// filler for bug when not declared, runs animation twice
        }

        this.setState = (state) => {
            if (state && isOn && isToggle || !state && !(isOn && isToggle)) {
                return;
            }
            touchEvent(undefined, ccui.Widget.TOUCH_ENDED);
        };

        this.setLook = (state) =>{
            if (state && isOn && isToggle || !state && !(isOn && isToggle)) {
                return;
            }
            _toggle();
        };

        function _toggle(){
            if (isToggle && isOn) {
                _spriteTarget.runAction(_animationSequence.clone().reverse());
                isOn = false;
            } else {
                _spriteTarget.runAction(_animationSequence.clone());
                isOn = true;
            }
        }

        this.setVisible = function (visibility ) {
            _wrapper.setEnabled(visibility);
            _wrapper.setVisible(visibility);
        };
    };

    const proto = AnimatedButton.prototype;

    proto.getParent = function () {
        return this._parent;
    };

    return AnimatedButton;
}());