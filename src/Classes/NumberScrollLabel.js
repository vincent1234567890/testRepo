var NumberScrollLabel = cc.Layer.extend({
    _componentNumber:0,
    _number:null,
    _preNumber:null,
    _itemWidth:0,
    _itemHeight:0,
    _dtNum:0,
    _dtTime:0,
    _updateTime:0,
    _componentSize:null,
    _components:0,
    _durations:null,
    _charMapFile:0,
    _scissorRect:null,
    init:function () {
        if (this._super()) {
            this._setIntNumber(PlayerActor.sharedActor().getPlayerMoney());
            this._setPreNumber(PlayerActor.sharedActor().getPlayerMoney());
            this._componentNumber = 1;
            this._updateTime = 0.0;
            this._componentSize = cc.SizeMake(20, 30);
            this._charMapFile = ImageName("ui_text_01.png");
            this._itemWidth = TextWidth2;
            this._itemHeight = TextHeight2;
            this._scissorRect = cc.RectZero();
            this._components = [];
            this._durations = [];
            this.initAllComponents();
            this.schedule(this.update);
        }
        return true;
    },
    initWithSize:function (mapFile, size, iWidth, iHeight) {
        if (this.init()) {
            this._setIntNumber(PlayerActor.sharedActor().getPlayerMoney());
            this._setPreNumber(PlayerActor.sharedActor().getPlayerMoney());
            this._componentNumber = 1;
            this._updateTime = 0.0;
            //this.componentSize = cc.SizeMake(TextWidth2+5, TextHeight2);
            this._componentSize = size;
            this._itemWidth = iWidth;
            this._itemHeight = iHeight;
            this._charMapFile = mapFile;
            this._scissorRect = cc.RectZero();
            this._components = [];
            this.initAllComponents();
            this.schedule(this.update);
        }
        return true;
    },
    reloadAllComponents:function () {
        this.setContentSize(cc.SizeMake(this._componentSize.width * this._componentNumber, this._componentSize.height));

        for (var idx = 0; idx < this._componentNumber; idx++) {
            var temp = this._getPreNumber() / Math.pow(10.0, idx);
            var num = temp % 10;
            var label = this._components[idx];
            label.setString(num);
        }
    },
    initAllComponents:function () {
        this.setContentSize(cc.SizeMake(this._componentSize.width * this._componentNumber, this._componentSize.height));

        this._durations = [];
        //this.durations.assign(this.componentNumber, 1.0);

        this.removeAllChildrenWithCleanup(true);
        this._components = [];

        for (var idx = 0; idx < this._componentNumber; idx++) {
            var temp = this._getPreNumber() / Math.pow(10, idx);
            var num = parseInt(temp % 10);

            var labelNum = cc.LabelAtlas.create(num, this._charMapFile, this._itemWidth, this._itemHeight, '0');
            labelNum.setAnchorPoint(cc.p(0.5, 0.5));
            labelNum.setPosition(cc.p(this._componentSize.width * (0.5 + (this._componentNumber - 1 - idx)), this._componentSize.height / 2));
            this._components.push(labelNum);
            this.addChild(labelNum);
        }
    },
    visit:function () {
        this._super();

        if (false == this.isVisible()) {
            return;
        }

        if (this._scissorRect.width <= 0 && this._scissorRect.height <= 0) {
            var pos = this.getPosition();
            var cs = this.getContentSize();
            this._scissorRect = new cc.Rect(pos.x, pos.y, cs.width, cs.height);
        }
    },
    draw:function (ctx) {
        if (cc.renderContextType == cc.CANVAS) {
            var context = ctx || cc.renderContext;
            var size = this._scissorRect.size;
            context.beginPath();
            context.moveTo(-size.width / 2, -size.height / 2);
            context.lineTo(size.width / 2, -size.height / 2);
            context.lineTo(size.width / 2, size.height / 2);
            context.lineTo(-size.width / 2, size.height / 2);
            context.clip();
            context.closePath();
        }
    },
    setComponentNumber:function (d) {
        this._componentNumber = d;
        this.initAllComponents();
    },
    setNumber:function (n) {
        if (n == this._getIntNumber()) return;
        this._setIntNumber(n);
        this.updateNumber();
    },
    setComponentSize:function (c) {
        this._componentSize = c;
        this.initAllComponents();
    },
    getScissorRect:function () {
        return this._scissorRect;
    },
    setScissorRect:function (v) {
        this._scissorRect = v;
    },
    updateNumber:function () {
        var delta = this._getIntNumber() - this._getPreNumber();

        if (delta == 0) {
            return;
        }

        this._dtNum = delta / 300;
        if (delta > 0 && this._dtNum < 1) this._dtNum = 1;
        if (delta < 0 && this._dtNum > -1) this._dtNum = -1;

        this._dtTime = 1.0 / Math.abs(delta);

        for (var idx = 0; idx < this._componentNumber; idx++) {
            var deltaNum = Math.abs(delta / Math.pow(10.0, idx));
            if (deltaNum != 0) {
                this._durations[idx] = 1.0 / deltaNum;
            }
        }

        this._updateTime = this._dtTime;
    },
    resetNumber:function () {
        this._setIntNumber(0);
        this._setPreNumber(0);
    },
    update:function (dt) {
        var first = this._components[0];
        if (first.getPosition().y != (this._componentSize.height / 2)) {
            return;
        }

        if (this._preNumber == this._number) {
            return;
        }

        var tempNum = this._getPreNumber();
        this._setPreNumber(this._getPreNumber() + this._dtNum);

        if ((this._dtNum > 0 && this._preNumber > this._number) ||
            (this._dtNum < 0 && this._preNumber < this._number)) {
            this._preNumber = this._number;
        }

        for (var idx = 0; idx < this._componentNumber; idx++) {
            var newNum = parseInt((this._getPreNumber() / Math.pow(10.0, idx)) % 10);
            var oldNum = parseInt((tempNum / Math.pow(10.0, idx)) % 10);

            if (newNum != oldNum) {
                var old = this._components[idx];
                var newLabel = cc.LabelAtlas.create(newNum, this._charMapFile, this._itemWidth, this._itemHeight, '0');
                this.addChild(newLabel);
                this._components.splice(idx, 1, newLabel);
                newLabel.setAnchorPoint(cc.p(0.5, 0.5));
                newLabel.setScale(kUiItemScale);
                var duration = this._dtTime;
                if (idx > 0) {
                    duration *= 10;
                    if (duration > 1.0)
                        duration = 1.0;
                }

                if (this._dtNum > 0) {
                    newLabel.setPosition(cc.p(this._componentSize.width * (0.5 + (this._componentNumber - 1 - idx)), this._componentSize.height * 1.5));
                    var oldAction = cc.Sequence.create(cc.MoveTo.create(this._dtTime, cc.p(old.getPosition().x, -this._componentSize.height / 2 * kUiItemScale))
                        , cc.CallFunc.create(this, this.removeComponent));
                    old.runAction(oldAction);
                    newLabel.runAction(cc.MoveTo.create(this._dtTime, cc.p(newLabel.getPosition().x, this._componentSize.height / 2 * kUiItemScale)));
                }
                else {
                    newLabel.setPosition(cc.p(this._componentSize.width * (0.5 + (this._componentNumber - 1 - idx)), this._componentSize.height * (-0.5)));
                    var oldAction = cc.Sequence.create(cc.MoveTo.create(this._dtTime, cc.p(old.getPosition().x, this._componentSize.height * 1.5))
                        , cc.CallFunc.create(this, this.removeComponent));
                    old.runAction(oldAction);
                    newLabel.runAction(cc.MoveTo.create(this._dtTime, cc.p(newLabel.getPosition().x, this._componentSize.height / 2)));
                }

            }
        }
    },
    removeComponent:function (sender) {
        this.removeChild(sender, true);
    },
    _getIntNumber:function () {
        return   this._number;
    },
    _setIntNumber:function (num) {
        this._number = num;
    },
    _getPreNumber:function () {
        return  this._preNumber;
    },
    _setPreNumber:function (num) {
        this._preNumber = num;
    }
});

NumberScrollLabel.create = function () {
    var ret = new NumberScrollLabel();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};