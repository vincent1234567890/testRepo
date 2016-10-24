/*var SPGameObject  = cc.Class.extend({
 this.def:null,
 scale
 initWiththis.def:function(this.def){},
 gameObjectDidLoad:function(){},
 //!从scene中保存的普通SPGameObject,转换为具体游戏中继承的类


 initWithCoder:function(aDecoder){},
 encodeWithCoder:function(aCoder){},

 // properties

 //!Transform
 CC_SYNTHESIZE(cocos2d::CCPoint, scale, Scale);
 CC_SYNTHESIZE(cocos2d::CCPoint, position, Position);
 CC_SYNTHESIZE(float, rotation, Rotation);

 CC_SYNTHESIZE(bool, enable, IsEnabled);

 //!Z坐标
 CC_SYNTHESIZE(int, z, ZOrder);

 //!父子关系
 CC_PROPERTY(SPGameObject*, parent, Parent);
 CC_PROPERTY(cocos2d::CCArray*, children, Children);

 //!SPActorthis.def, SPMapthis.def, SPScenethis.def
 getthis.def:function() { return this.def; }
 setthis.def:function(std::string& val) { this.def = val;}

 //!tag
 CC_SYNTHESIZE(std::string, group, Group);

 //!script
 //!绑定那个游戏的具体类;nil或length=0,则根据this.def绑定默认;if(Class=nil),throw exception
 CC_SYNTHESIZE(std::string, bindClass, BindClass);

 });

 SPGameObject.objectFormObject = function(obj){};
 SPGameObject.gameObject = function(){};*/

/*
 管理一个可以复制的,重复利用的物体; i.e. 子弹(dullet) 
 */

var SPReusablePool = cc.Class.extend({
    unused:null,
    used:null,
    org:null,
    _def:null,
    creator:null,
    mat:null,
    ctor:function () {
        this.unused = [];
        this.used = [];
    },
    //!取actor,不够则新生成 
    getObject:function () {
        var obj = null;

        if (this.unused.length > 0) {
            obj = this.unused[this.unused.length - 1];
            this.unused.pop();
            this.used.push(obj);
        }
        else {
            obj = this.creator;
            this.used.push(obj);
        }

        return obj;
    },
    //!归还actor,以备重复使用 
    returnObject:function (obj) {
        if (null == obj) {
            return;
        }

        this.used.removeObject(obj);
        for (var i = 0; i < this.used.length; i++) {
            var a = this.used[i];
            if (a == obj) {
                this.used.splice(i, 1);
            }
        }

        this.unused.push(obj);
    },

    cleanAllObj:function () {
        this.unused = [];
    },
    cleanObj:function (obj) {
        this.unused = [];
    },
    logActorCounter:function () {
        return 0;
    },
    createWithCapacity:function (numItems) {
        this.used = [];
        this.unused = [];
        for (var i = 0; i < numItems; ++i) {
            this.unused.push(this.creator);
        }
    },
    createGameObjectByCopy:function () {
        return null;
    },
    createGameObjectByObj:function () {
        return null;
    },
    createGameObjectByDef:function () {
        var obj;

        if (this._def == "SharkActor") {
            obj = new SharkActor();
        }
        else if (this._def == "SmallFishActor") {
            obj = new SmallFishActor();
        }
        else if (this._def == "RayActor") {
            obj = new RayActor();
        }
        else if (this._def == "LanternActor") {
            obj = new LanternActor();
        }
        else if (this._def == "PorgyActor") {
            obj = new PorgyActor();
        }
        else if (this._def == "AmphiprionActor") {
            obj = new AmphiprionActor();
        }
        else if (this._def == "PufferActor") {
            obj = new PufferActor();
        }
        else if (this._def == "CroakerActor") {
            obj = new CroakerActor();
        }
        else if (this._def == "ChelonianActor") {
            obj = new ChelonianActor();
        }
        else if (this._def == "BreamActor") {
            obj = new BreamActor();
        }
        else if (this._def == "AngleFishActor") {
            obj = new AngleFishActor();
        }
        else if (this._def == "MarlinsFishActor") {
            obj = new MarlinsFishActor();
        }
        else if (this._def == "GrouperFishActor") {
            obj = new GrouperFishActor();
        }
        else if (this._def == "FishNetActor") {
            obj = new FishNetActor();
        }
        else if (this._def == "FishNetActor1") {
            obj = new FishNetActor1();
        }
        else if (this._def == "FishNetActor2") {
            obj = new FishNetActor2();
        }
        else if (this._def == "FishNetActor3") {
            obj = new FishNetActor3();
        }
        else if (this._def == "FishNetActor4") {
            obj = new FishNetActor4();
        }
        else if (this._def == "FishNetActor5") {
            obj = new FishNetActor5();
        }
        else if (this._def == "FishNetActor6") {
            obj = new FishNetActor6();
        }
        else if (this._def == "FishNetActor7") {
            obj = new FishNetActor7();
        }
        else if (this._def == "FishNetActor10") {
            obj = new FishNetActor10();
        }
        else if (this._def == "BulletActor") {
            obj = new BulletActor();
        }
        else if (this._def == "BulletActor10")  // 创建10级子弹对象
        {
            obj = new BulletActor10();
        }
        else if (this._def == "RayBulletActor") {
            obj = new RayBulletActor();
        }
        else if (this._def == "GoldPrizeActor") {
            obj = new GoldPrizeActor();
        }
        else if (this._def == "BigPrizeActor") {
            obj = new BigPrizeActor();
        }
        else if (this._def == "GSharkActor") {
            obj = new GSharkActor();
        }
        else if (this._def == "GMarlinsFishActor") {
            obj = new GMarlinsFishActor();
        }
        else if (this._def == "LevinStormBulletActor") {
            obj = new LevinStormBulletActor();
        }
        else if (this._def == "SwirlBulletActor") {
            obj = new SwirlBulletActor();
        }
        else if (this._def == "HarpoonBulletActor") {
            obj = new HarpoonBulletActor();
        }
        else if (this._def == "ChestActor") {
            obj = new ChestActor();
        }
        else if (this._def == "MaxChestActor") {
            obj = new MaxChestActor();
        }
        else if (this._def == "Starfish") {
            obj = new Starfish();
        } else if (this._def == "ButterflyActor") {
            obj = new ButterflyActor();
        } else if (this._def == "PomfretActor") {
            obj = new PomfretActor();
        } else if (this._def == "GoldenTroutActor") {
            obj = new GoldenTroutActor();
        }
        // @todo
//     else if (this.def == "ShellActor")
//     {
//         obj = new ShellActor();
//     }
//     else if (this.def == "LightActor")
//     {
//         obj = new LightActor();
//     }
//     else if (this.def == "BoxActor")
//     {
//         obj = new BoxActor();
//     }
//     else if (this.def == "LotteryActor")
//     {
//         obj = new LotteryActor();
//     }
//     else if (this.def == "JackActor")
//     {
//         obj = new JackActor();
//     }
//     else if (this.def == "BasketActor")
//     {
//         obj = new BasketActor();
//     }
//     else if (this.def == "BasketGameBreamActor")
//     {
//         obj = new BasketGameBreamActor();
//     }

        if (obj) {
            // obj.initWithDef(this._def); //Eugene potential legacy breakage
            //obj.gameObjectDidLoad();
            obj = new BaseActor();
        }

        return obj;
    },
    creatorFunc:function () {
    },
    initWithCapacityGameObj:function (numItems, obj) {
        this.org = obj;

        this.creator = this.createGameObjectByObj();
        this.createWithCapacity(numItems);

        return true;
    },
    initWithCapacityCloneableObj:function (numItems, obj) {
        this.mat = obj;

        this.creator = this.createGameObjectByCopy();
        this.createWithCapacity(numItems - 1);

        return true;
    },
    initWithCapacityDef:function (numItems, d) {
        this._def = d;
        this.creator = this.createGameObjectByDef();
        this.createWithCapacity(numItems);

        return true;
    }
});

//!适合场景中的管理
SPReusablePool.poolWithCapacityGameObj = function (numItems, obj) {
    var ret = new SPReusablePool();
    ret.initWithCapacityGameObj(numItems, obj);
    return ret.creator;
};

//!support [obj copy],
SPReusablePool.poolWithCapacityCloneableObj = function (numItems, obj) {
    var ret = new SPReusablePool();
    ret.initWithCapacityCloneableObj(numItems, obj);
    return ret.creator;
};

//适合游戏中生成的
SPReusablePool.poolWithCapacityDef = function (numItems, d) {
    var ret = new SPReusablePool();
    ret.initWithCapacityDef(numItems, d);
    return ret.creator;
};
