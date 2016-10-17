var ActorFactory = cc.Class.extend({
    _def:null,
    _actor:null,
    initWithType:function(type){
        this._def = type;

        if (this._def == "SharkActor") {
            this._actor = new SharkActor();
        }
        else if (this._def == "SmallFishActor") {
            this._actor = new SmallFishActor();
        }
        else if (this._def == "RayActor") {
            this._actor = new RayActor();
        }
        else if (this._def == "LanternActor") {
            this._actor = new LanternActor();
        }
        else if (this._def == "PorgyActor") {
            this._actor = new PorgyActor();
        }
        else if (this._def == "AmphiprionActor") {
            this._actor = new AmphiprionActor();
        }
        else if (this._def == "PufferActor") {
            this._actor = new PufferActor();
        }
        else if (this._def == "CroakerActor") {
            this._actor = new CroakerActor();
        }
        else if (this._def == "ChelonianActor") {
            this._actor = new ChelonianActor();
        }
        else if (this._def == "BreamActor") {
            this._actor = new BreamActor();
        }
        else if (this._def == "AngleFishActor") {
            this._actor = new AngleFishActor();
        }
        else if (this._def == "MarlinsFishActor") {
            this._actor = new MarlinsFishActor();
        }
        else if (this._def == "GrouperFishActor") {
            this._actor = new GrouperFishActor();
        }
        else if (this._def == "FishNetActor") {
            this._actor = new FishNetActor();
        }
        else if (this._def == "FishNetActor1") {
            this._actor = new FishNetActor1();
        }
        else if (this._def == "FishNetActor2") {
            this._actor = new FishNetActor2();
        }
        else if (this._def == "FishNetActor3") {
            this._actor = new FishNetActor3();
        }
        else if (this._def == "FishNetActor4") {
            this._actor = new FishNetActor4();
        }
        else if (this._def == "FishNetActor5") {
            this._actor = new FishNetActor5();
        }
        else if (this._def == "FishNetActor6") {
            this._actor = new FishNetActor6();
        }
        else if (this._def == "FishNetActor7") {
            this._actor = new FishNetActor7();
        }
        else if (this._def == "FishNetActor10") {
            this._actor = new FishNetActor10();
        }
        else if (this._def == "BulletActor") {
            this._actor = new BulletActor();
        }
        else if (this._def == "BulletActor10")  // 创建10级子弹对象
        {
            this._actor = new BulletActor10();
        }
        else if (this._def == "RayBulletActor") {
            this._actor = new RayBulletActor();
        }
        else if (this._def == "GoldPrizeActor") {
            this._actor = new GoldPrizeActor();
        }
        else if (this._def == "BigPrizeActor") {
            this._actor = new BigPrizeActor();
        }
        else if (this._def == "GSharkActor") {
            this._actor = new GSharkActor();
        }
        else if (this._def == "GMarlinsFishActor") {
            this._actor = new GMarlinsFishActor();
        }
        else if (this._def == "LevinStormBulletActor") {
            this._actor = new LevinStormBulletActor();
        }
        else if (this._def == "SwirlBulletActor") {
            this._actor = new SwirlBulletActor();
        }
        else if (this._def == "HarpoonBulletActor") {
            this._actor = new HarpoonBulletActor();
        }
        else if (this._def == "ChestActor") {
            this._actor = new ChestActor();
        }
        else if (this._def == "MaxChestActor") {
            this._actor = new MaxChestActor();
        }
        else if (this._def == "Starfish") {
            this._actor = new Starfish();
        } else if (this._def == "ButterflyActor") {
            this._actor = new ButterflyActor();
        } else if (this._def == "PomfretActor") {
            this._actor = new PomfretActor();
        } else if (this._def == "GoldenTroutActor") {
            this._actor = new GoldenTroutActor();
        }

        if (this._actor) {
            this._actor.initWithDef(this._def);
        }

       return true;
    }
});

ActorFactory.index = 10;

ActorFactory.poolDict = [];

ActorFactory.registerType = function (type) {
    if (!ActorFactory.poolDict) {
        ActorFactory.poolDict = {};
    }

    var pool = ActorFactory.poolDict[type];
    if (pool == null) {
        pool = SPReusablePool.poolWithCapacityDef(0, type);
        ActorFactory.poolDict[type] = pool;
    }
};

ActorFactory.create = function (type) {
    var af = new ActorFactory();
    if(af.initWithType(type)){
        return af._actor;
    }
};

ActorFactory.returnActor = function (m) {
    var pool = ActorFactory.poolDict[m.getDef()];
    if (null != pool) {
        pool.returnObject(m);
    }
};

ActorFactory.loadStatus = function () {
    if (ActorFactory.poolDict) {
        var keys = ActorFactory.poolDict;
        for (var i in keys) {
            var pool = keys[i];
            pool.logActorCounter();
        }
    }
};

ActorFactory.cleanAllRes = function () {
    this.poolDict = {};
};

ActorFactory.cleanRes = function () {
    this.poolDict = {};
};