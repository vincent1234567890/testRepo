var AutoAdapterScreen = cc.Class.extend({
    _elem:null,
    _tag:"gameCanvas",
    _width:1024,
    _height:650,

    _maxWidth:1440,
    _maxHeight:900,

    _minWidth:1024,
    _minHeight:550,
    ctor:function () {
        this._elem = document.querySelector('body');
        this.getWinSize();
    },
    enterFullScreen:function () {
        /* var that = this;
         this._elem.onwebkitfullscreenchange = function (e) {
         //KingFisher cc.log("Entered fullscreen!");
         that._elem.onwebkitfullscreenchange = that.exitFullScreen;
         };
         this._elem.webkitRequestFullScreen();*/
    },
    exitFullScreen:function () {
        /*//KingFisher cc.log("exitFullscreen");
         document.webkitCancelFullScreen();*/
    },
    getWinSize:function () {
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;

        if (width > this._maxWidth) {
            this._width = this._maxWidth;
        }
        else if (width < this._minWidth) {
            this._width = this._minWidth;
        }
        else {
            this._width = width;
        }

        if (height > this._maxHeight) {
            this._height = this._maxHeight;
        }
        else if (height < this._minHeight) {
            this._height = this._minHeight;
        }
        else {
            this._height = height;
        }

        return new cc.Size(this._width, this._height);
    },
    adjustSize:function () {
        this.getWinSize();
        this.setVisibleRect();
        cc._canvas.width = this._width;
        cc._canvas.height = this._height;

        var parentDiv = document.querySelector("#Cocos2dGameContainer");
        var KingFisher = document.querySelector("#KingFisher");

        if (parentDiv) {
            parentDiv.style.width = this._width + "px";
            parentDiv.style.height = this._height + "px";
        }
        if (KingFisher) {
            KingFisher.style.width = this._width + "px";
            KingFisher.style.height = this._height + "px";
        }

        // cc._renderContext.translate(0, cc._canvas.height);
        // if (cc._renderType == cc.game.RENDER_TYPE_WEBGL) {
        //     if (cc._renderType == cc.game.RENDER_TYPE_CANVAS) {
        //         cc._renderContext.translate(0, cc._canvas.height);
        //     }else if (cc._renderType == cc.game.RENDER_TYPE_WEBGL){
                //cc._renderContext.viewport(0, 0, cc._canvas.width, cc._canvas.height);
            // }
        // }
    },

    setWinSize:function (tag) {
        this._tag = tag;
        // console.log(tag);
        // cc.setup(tag, this._width, this._height);
        this.setVisibleRect();
    },
    getScaleMultiple:function () {
        var widthMultiple = this._width / 1280;
        var heightMultiple = this._height / 800;
        return  Math.max(widthMultiple, heightMultiple)
    },
    setVisibleRect:function () {
        // 获取Screen在View中的坐标
        s_rcVisible = cc.rect(0, 0, this._width, this._height);

        s_ptCenter.x = this._width / 2;
        s_ptCenter.y = this._height / 2;

        s_ptTop.x = this._width / 2;
        s_ptTop.y = this._height;

        s_ptCenter.x = this._width / 2;
        s_ptCenter.y = this._height / 2;

        s_ptTop.x = this._width / 2;
        s_ptTop.y = this._height;

        s_ptTopRight.x = this._width;
        s_ptTopRight.y = this._height;

        s_ptRight.x = this._width;
        s_ptRight.y = this._height / 2;

        s_ptBottomRight.x = this._width;
        s_ptBottomRight.y = 0;

        s_ptBottom.x = this._width / 2;
        s_ptBottom.y = 0;

        s_ptLeft.x = 0;
        s_ptLeft.y = this._height / 2;

        s_ptTopLeft.x = 0;
        s_ptTopLeft.y = this._height;

        screenWidth = this._width;
        screenHeight = this._height;
        EScreenRect = cc.rect(1.0, 1.0, this._width + 10, this._height + 10);
        LEVINBULLETALIVERECT = cc.rect(-10.0, -10.0, this._width + 20, this._height + 20);
    }
});

AutoAdapterScreen.getInstance = function () {
    if (!this._instance) {
        var ret = new AutoAdapterScreen();
        return ret;
    }
    return this._instance;
};

AutoAdapterScreen._instance = null;