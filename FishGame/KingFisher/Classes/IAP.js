var googleSrc = "Resource/shop/google.png";
var alipaySrc = "Resource/shop/alipay.png";
var paypalSrc = "Resource/shop/paypal.png";

var IAP_GUIDSTRINGS = "IapGuidStrings";

var paypalButton = cc.$("#submitBtn");
var paypalForm = cc.$("#paypal_form");
if (paypalForm) {
    paypalForm.remove();
}

//var server = "http://chrome.KingFisher.com/level3/";
//var server = "http://localhost:7839/";
var server = "http://fishingjoy.sinonet.sg/level3/";

var PaymentPopUp = cc.Class.extend({
    ctor:function (pos, cb1, cb2, cb3) {
        //make whole screen canceler
        this.k = cc.$new("div");
        this.k.style.width = "100%";
        this.k.style.height = "100%";
        cc.$('html').style.height = "100%";
        cc.$('body').style.height = "100%";
        this.k.style.position = "absolute";
        this.k.style.top = 0;
        this.k.style.background = "rgba(255,255,255,0.1)";
        this.k.appendTo(document.body);

        //make an arrow
        var a = cc.$new("div");
        a.style.width = 0;
        a.style.height = 0;
        a.style.borderLeft = "10px solid transparent";
        a.style.borderRight = "10px solid transparent";
        a.style.borderTop = "30px solid #FFF";
        a.style.margin = "0 auto";

        //make a box
        var b = cc.$new("div");
        b.style.width = "326px";
        b.style.height = "142px";
        b.style["borderRadius"] = "10px";
        b.style.background = "#FFF";
        b.style["boxShadow"] = "0 25px 46px #535353";
        b.style.overflow = "hidden";

        //make a container
        this.c = cc.$new("div");
        this.c.style.display = "inline-block";
        this.c.style.position = "absolute";
        this.c.style.top = "0";
        this.c.appendChild(b);
        this.c.appendChild(a);
        this.c.appendTo(document.body);

        var that = this;
        this.remove = function () {
            that.k.remove();
            that.c.remove();
        };
        this.k.onclick = this.remove;

        //add some text
        var text = cc.$new("div");
        text.textContent = (cc.Application.getCurrentLanguage()) ? "选择支付：" : "Proceed with:";
        text.appendTo(b);
        text.style.fontSize = "14px";
        text.style.margin = "10px 10px 5px 10px";

        //add the logos
        this.google = cc.$new("img");
        this.google.src = googleSrc;
        this.google.onclick = cb1;
        this.google.style.cursor = "pointer";

        //fake paypal img
        this.paypal = cc.$new("div");
        var fakepaypal = cc.$new("img").appendTo(this.paypal);
        fakepaypal.src = paypalSrc;
        fakepaypal.style["webkitFilter"] = "grayscale(80%)";
        fakepaypal.style.cursor = "wait";
        //var paypal = paypalForm;

        this.alipay = cc.$new("img");
        this.alipay.src = alipaySrc;
        this.alipay.onclick = cb3;
        this.alipay.style["webkitFilter"] = "grayscale(80%)";
        this.alipay.style.cursor = "no-drop";

        var imgContainer = cc.$new("div");
        imgContainer.appendTo(b);
        imgContainer.style.marginLeft = "10px";
        imgContainer.style.display = "inline-block";
        [this.google, this.paypal, this.alipay].forEach(function (img) {
            img.appendTo(imgContainer);
            img.style.margin = "2px 10px";
            //img.style.cursor= "pointer";
            img.style.display = "inline-block";
        });

        if (pos && pos.x && pos.y) {
            this.c.translates(pos.x - 163, pos.y - 190);
        }
        this.c.style.transformOrigin = "50% 100%";
        this.c.style["webkitTransformOrigin"] = "50% 100%";
        this.c.style["mozTransformOrigin"] = "50% 100%";
        this.animate();

        var that = this;
        if (paypalButton && !paypalButton.customClickAdded) {
            paypalButton.addEventListener("click", function () {
                //with an interval, check if dg is closed
                that.paypalChecker = setInterval(PaymentPopUp.checkPaypal.bind(that), 1000 / 2);
            });
            paypalButton.customClickAdded = true;
        }
    },
    paypalChecker:null,
    animate:function () {
        this.tick = 0;
        this.step();
    },
    step:function () {
        if (this.tick < 10) {
            this.c.resize(this.tick / 10, this.tick / 10);
            this.tick++;

            setTimeout(this.step.bind(this), 1000 / 60);
        }
    },
    setPaypalToken:function (event) {
        if (event.target.readyState === 4) {
            if (event.target.status === 200) {
                if (event.target.response && event.target.response != "") {
                    var responseArr = event.target.response.split("&");
                    if (responseArr) {
                        this.paypalToken = responseArr[0];
                        //save guid string to local storage
                        var guidString = responseArr[1];
                        var guidArr = JSON.parse(wrapper.getStringForKey(IAP_GUIDSTRINGS, "[]"));
                        if (!guidArr)
                            guidArr = [];

                        guidArr.push(guidString);
                        guidString = JSON.stringify(guidArr);
                        wrapper.setStringForKey(IAP_GUIDSTRINGS, guidString);

                        paypalForm.action = "https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=" + this.paypalToken;
                        //paypalForm.action = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=" + this.paypalToken;
                        this.paypal.remove();
                        this.alipay.parentNode.insertBefore(paypalForm, this.alipay);
                        paypalForm.style.display = "inline-block";
                        paypalForm.style.margin = "2px 10px";
                        PaymentPopUp.guid = JSON.parse(guidString);
                    }
                }
            }
        }
    }
});

PaymentPopUp.checkPaypal = function () {
    if (window["dg"]) {
        if (!window["dg"]["isOpen"]()) {
            PaymentPopUp.guid = PaymentPopUp.guid || JSON.parse(wrapper.getStringForKey(IAP_GUIDSTRINGS, "[]"));
            for (var x = 0; x < PaymentPopUp.guid.length; x++) {
                var http = new XMLHttpRequest();
                var params = "guid=" + PaymentPopUp.guid[x];
                var selfPointer = this;

                http.onreadystatechange = function (event) {
                    var iapGuid = JSON.parse(wrapper.getStringForKey(IAP_GUIDSTRINGS));
                    if (event.target.readyState === 4) {
                        if (event.target.status === 200) {
                            if (event.target.response && event.target.response != "") {
                                var res = (cc.Codec.Base64.decode(event.target.response)).split("&");
                                if (res) {
                                    if(res[0] == "3"){
                                        if (res[3]) {
                                            //if there is money to
                                            PlayerActor.sharedActor().addMoney(parseInt(res[3]));

                                            var dbcheck = new XMLHttpRequest();
                                            dbcheck.open("get", server + "rh?guid=" + res[1]);
                                            dbcheck.send(null);

                                            if (ShopLayer.willGoBack) {
                                                ShopLayer.willGoBack = false;

                                                ShopLayer.getInstance().backToGame().goBackAnimation();
                                                selfPointer.remove();
                                            }
                                            wrapper.logEvent("Shop", "PurchaseState", "Success of the purchase", 1);
                                        }
                                    }
                                    /* else if( res[0] == 2){
                                     //recharged
                                     }*/
                                    if (res[2]) {
                                        var found = iapGuid.indexOf(res[1]);
                                        if (found !== -1)
                                            iapGuid.splice(found, 1);
                                    }
                                }
                            }
                        }
                    }
                    wrapper.setStringForKey(IAP_GUIDSTRINGS, JSON.stringify(iapGuid));
                };
                http.open("get", server + "rch?" + params);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.send(null);
            }
            clearInterval(this.paypalChecker);
        }
    } else {
        clearInterval(this.paypalChecker);
    }
};

var ShopLayer = cc.Layer.extend({
    ctor:function () {
        this.init();
        var board = cc.Sprite.create(ImageName("shop/ui_prop_002.png"));
        board.setPosition(VisibleRect.center());
        this.addChild(board);

        cc.SpriteFrameCache.getInstance().addSpriteFrames(ImageName("shop/ui_shop.plist"));
        var lang = cc.Application.getCurrentLanguage() === cc.LANGUAGE_CHINESE ? "cn" : "en";
        var awardNotice = cc.Sprite.createWithSpriteFrameName(("shop_awarding_notice_" + lang + ".png"));
        this.addChild(awardNotice);
        awardNotice.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y + 126));

        var shopTitle = cc.Sprite.createWithSpriteFrameName("shop_title_" + lang + ".png");
        this.addChild(shopTitle);
        shopTitle.setPosition(cc.p(VisibleRect.center().x, VisibleRect.center().y + 240));

        var totalAwarding = cc.Sprite.createWithSpriteFrameName("total_awarding_" + lang + ".png");
        this.addChild(totalAwarding);
        totalAwarding.setPosition(cc.p(VisibleRect.center().x - 86, VisibleRect.center().y + 160));

        var coinIcon = cc.Sprite.create(ImageName("shop/ui_pur_buton_01xiao.png"));
        this.addChild(coinIcon);
        coinIcon.setPosition(cc.p(VisibleRect.center().x + 132, VisibleRect.center().y + 162));

        var back = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName("ui_button_17.png"), cc.Sprite.createWithSpriteFrameName("ui_button_18.png"), this, this.goBackAnimation);
        this.menu = cc.Menu.create(back);
        back.ignoreAnchorPointForPosition(true);
        back.setPosition(cc.p(VisibleRect.topLeft().x, VisibleRect.topLeft().y - 76));
        this.addChild(this.menu);
        this.menu.setPosition(cc.p(0, 0));
        //back.setPosition(cc.p(VisibleRect.center().x+132,VisibleRect.center().y));

        this.addItemForSale();

        var number = NumberScrollLabel.create();
        //number._charMapFile = ImageName("shop/ui_shop_num_02.png");
        number.setPosition(cc.pAdd(VisibleRect.center(), cc.p(0, 150)));
        number.initWithSize = function (mapFile, size, iWidth, iHeight) {
            this._setIntNumber(0);
            this._setPreNumber(0);
            this._componentNumber = 5;
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
        };
        number.initWithSize(ImageName("shop/ui_shop_num_02.png"), cc.SizeMake(20, 20), 14, 20);
        number.setNumber((0 | (PlayerActor.sharedActor().getTotalGain() * 0.0141583)));
        this.addChild(number);
    },
    goBackAnimation:function () {
        var scene = PlayerActor.sharedActor().getScene();
        scene.resumeGame();
        scene.showAllMenu();
        this.removeFromParentAndCleanup(true);
        cc.SpriteFrameCache.getInstance().removeSpriteFrameByName(ImageName("shop/ui_shop.plist"));
    },
    addLabel:function (gold, usd, p) {
        var coin = cc.Sprite.create(ImageName("shop/ui_pur_buton_01xiao.png"));
        this.addChild(coin);
        coin.setPosition(cc.pAdd(VisibleRect.center(), p));

        var goldcount = cc.LabelAtlas.create(gold, ImageName("shop/ui_shop_num_01.png"), 14, 20, "0");
        goldcount.setPosition(cc.pAdd(coin.getPosition(), cc.p(20, -15)));
        this.addChild(goldcount);

        var usdcount = cc.LabelTTF.create("$" + usd, 'Impact', 16);
        usdcount.setPosition(cc.pAdd(coin.getPosition(), cc.p(20, -17)));
        usdcount.setAnchorPoint(cc.p(0, 1));
        this.addChild(usdcount);

    },
    addItemForSale:function () {
        var gold200 = new ShopGoldItem(200);
        this.menu.addChild(gold200);
        gold200.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-235, 0)));
        this.addLabel(200, 0.99, cc.p(-270, 63));

        var gold500 = new ShopGoldItem(500);
        this.menu.addChild(gold500);
        gold500.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-135, 0)));
        this.addLabel(500, 1.99, cc.p(-170, 63));


        var gold800 = new ShopGoldItem(800);
        this.menu.addChild(gold800);
        gold800.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-23, 0)));
        this.addLabel(800, 2.99, cc.p(-58, 63));


        var gold2000 = new ShopGoldItem(2000);
        this.menu.addChild(gold2000);
        gold2000.setPosition(cc.pAdd(VisibleRect.center(), cc.p(111, 0)));
        this.addLabel(2000, 7.99, cc.p(66, 63));


        var gold5000 = new ShopGoldItem(5000);
        this.menu.addChild(gold5000);
        gold5000.setPosition(cc.pAdd(VisibleRect.center(), cc.p(230, 0)));
        this.addLabel(5000, "19.00", cc.p(195, 63));


        var gold10000 = new ShopGoldItem(10000);
        this.menu.addChild(gold10000);
        gold10000.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-204, -193)));
        this.addLabel(10000, "36.00", cc.p(-255, -120));


        var gold20000 = new ShopGoldItem(20000);
        this.menu.addChild(gold20000);
        gold20000.setPosition(cc.pAdd(VisibleRect.center(), cc.p(-75, -193)));
        this.addLabel(20000, "70.00", cc.p(-125, -120));


        var gold30000 = new ShopGoldItem(30000);
        this.menu.addChild(gold30000);
        gold30000.setPosition(cc.pAdd(VisibleRect.center(), cc.p(67, -193)));
        this.addLabel(30000, "99.00", cc.p(20, -120));

    },
    success:function (res) {
        //get the money from res
        /*console.log(res);*/
        var data = res["request"]["sellerData"];
        data = data.replace(/M:/i, "");
        PlayerActor.sharedActor().addMoney(parseInt(data));
        ShopLayer.getInstance().backToGame().goBackAnimation();
        wrapper.logEvent("Shop", "PurchaseState", "Success of the purchase", 1);
    },
    failure:function (str, sec) {
        ShopLayer.getInstance().backToGame();
        var http = new XMLHttpRequest();
        var params = "f=" + JSON.stringify(str);
        http.onreadystatechange = function () {/*console.log("Payment fails, sent to server", params)*/
        };//TODO remove when obfuscating
        http.open("post", ShopLayer.getInstance().server + "spfr");
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(params);

        var failureState = str["response"]["errorType"];
        wrapper.logEvent("Shop", "PurchaseState", failureState, 1);
    },
    backToGame:function () {
        this.menu.setTouchEnabled(true);
        if (this.menu.screen)
            this.menu.screen.remove();
        return this;
    },
    server:"http://chrome.KingFisher.com/level2/",
    dropdown:function () {
        this.setPositionY(cc.canvas.height);
        this.runAction(cc.EaseElasticOut.create(cc.MoveTo.create(1, cc.p(0, 0)), 1));
    },
    googError:false
});
ShopLayer.getInstance = function () {
    return this.instance || (this.instance = new this());
};

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.parentNode;
    }
    return { top:_y, left:_x };
}

var ShopGoldItem = cc.MenuItemSprite.extend({
    ctor:function (value) {
        switch (value) {
            case 200:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_01-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_01-2.png"));
                this.id = 1;
                break;
            case 500:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_02-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_02-2.png"));
                this.id = 2;
                break;
            case 800:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_03-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_03-2.png"));
                this.id = 3;
                break;
            case 2000:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_04-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_04-2.png"));
                this.id = 4;
                break;
            case 5000:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_05-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_05-2.png"));
                this.id = 5;
                break;
            case 10000:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_06-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_06-2.png"));
                this.id = 6;
                break;
            case 20000:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_07-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_07-2.png"));
                this.id = 7;
                break;
            case 30000:
                var sp1 = cc.Sprite.create(ImageName("shop/ui_pur_buton_08-1.png"));
                var sp2 = cc.Sprite.create(ImageName("shop/ui_pur_buton_08-2.png"));
                this.id = 8;
                break;
        }
        if (this.id) {
            this.initWithNormalSprite(sp1, sp2, null, this, this.initBuy);
            var s = this.getContentSize();

            if (this.id < 6) {
                this.setContentSize(cc.size(s.width, 147));
            }
            else {
                this.setContentSize(cc.size(s.width, 160));
            }
        }
    },
    id:0,
    initBuy:function () {
        var pos = this.getPosition();
        //find canvas position, canvas is always at the top, finding canvas height will find canvas origin
        var cheight = cc.canvas.height;
        pos.y = cheight - pos.y;
        pos.x = pos.x + getOffset(cc.canvas).left;
        ShopLayer.willGoBack = true;
        var box = new PaymentPopUp(pos, this.initGoogBuy.bind(this), this.initPaypalBuy.bind(this));
        window.box = box;
        var lang = cc.Application.getCurrentLanguage() === cc.LANGUAGE_CHINESE ? "cn" : "en";
        var offset = (lang === "cn") ? 8 : 0;
        //get paypaltoken
        var http = new XMLHttpRequest();
        http.onreadystatechange = box.setPaypalToken.bind(box);
        http.open("get", server + "gts?pid=" + (this.id + offset) + "&lang=" + lang);
        http.send(null);
    },

    initPaypalBuy:function () {

    },
    initGoogBuy:function () {
        if (ShopLayer.getInstance().googError
            || typeof goog === 'undefined') {
            wrapper.logEvent("Shop", "PurchaseState", "Error: Can not reach Google checkout!", 1);
            alert("Error: Can not reach Google checkout!");
            return;
        }
        //disable menu touch event
        this.getParent().setTouchEnabled(false);
        //create a mask on top of everything
        var div = cc.$new("div");
        div.style.position = "absolute";
        div.style.height = document.body.clientHeight + "px";
        div.style.width = "100%";
        div.style.background = "rgba(255,255,255,0.75)";
        div.style.backgroundImage = "url(" + ImageName("fishloading.gif") + ")";
        div.style.backgroundPosition = "center";
        div.style.backgroundRepeat = "no-repeat";
        div.style.top = 0;
        div.appendTo(document.body);
        this.getParent().screen = div;
        //get lang
        var lang = cc.Application.getCurrentLanguage() === cc.LANGUAGE_CHINESE ? "cn" : "en";
        var offset = (lang === "cn") ? 8 : 0;
        //get jwt from server
        var http = new XMLHttpRequest();
        http.onreadystatechange = this.openBuy;
        http.open("get", ShopLayer.getInstance().server + "gjs?pid=" + (this.id + offset) + "&lang=" + lang);
        http.send(null);
        //if after 10 seconds, no response, then it means cannot reach google
        setTimeout(function () {
            if (cc.$("#goog-cia-frame-container") && cc.$("#goog-cia-frame-container").style.backgroundImage !== "none") {
                //clean up google stuff
                cc.$("#goog-cia-frame-container").remove();
                if (cc.$("#goog-cia-screen-lock"))
                    cc.$("#goog-cia-screen-lock").remove();
                ShopLayer.getInstance().googError = true;
                wrapper.logEvent("Shop", "PurchaseState", "Error: Can not reach Google checkout!", 1);
                alert("Error: Can not reach Google checkout!");
                ShopLayer.getInstance().backToGame();
            }
        }, 15000);

        this.logEvent();
    },
    logEvent:function () {
        var money = 0;
        switch (this.id) {
            case 1:
                money = 200;
                break;
            case 2:
                money = 500;
                break;
            case 3:
                money = 800;
                break;
            case 4:
                money = 2000;
                break;
            case 5:
                money = 5000;
                break;
            case 6:
                money = 10000;
                break;
            case 7:
                money = 20000;
                break;
            case 8:
                money = 30000;
                break;
        }
        wrapper.logEvent("Shop", "Tap", "Get" + money + " button", money);
    },
    openBuy:function (event) {
        if (event.target.readyState === 4) {
            if (event.target.status === 200) {
                var jwt = event.target.response;
                goog['payments']['inapp']['buy']({
                    'parameters':{},
                    'jwt':jwt,
                    'success':ShopLayer.getInstance().success,
                    'failure':ShopLayer.getInstance().failure
                });
                var screenLock = cc.$("#goog-cia-screen-lock");
                if (screenLock) {
                    screenLock.remove();
                }
                //cc.$("#goog-cia-frame-container").style.backgroundImage = null;
            }
            else {
                alert("Error contacting server");
                ShopLayer.getInstance().failure();
            }
        }
    }
});