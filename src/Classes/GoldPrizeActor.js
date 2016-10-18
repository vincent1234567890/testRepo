var MinChestSpeed = 1;
var LUIChestTag = 11;

var GoldPrizeActor = BaseActor.extend({
    _particle:null,
    _speed:0,
    _dir:null,
    _point:0,
    _deleteBigChest:false,
    get_speed:function () {
        return this._speed;
    },
    set_speed:function (v) {
        this._speed = v;
    },
    getDir:function () {
        return this._dir;
    },
    setDir:function (v) {
        this._dir = v;
    },
    getPoint:function () {
        return this._point;
    },
    setPoint:function (v) {
        this._point = v;
    },
    getBDeleteBigChest:function () {
        return this._deleteBigChest;
    },
    setBDeleteBigChest:function (v) {
        this._deleteBigChest = v;
    },
    getParticle:function () {
        return this._particle;
    },
    setParticle:function (v) {
        if (this._particle != v) {
            this._particle = v;
        }
    },

    initWithDef:function (def) {
        this._def = def;

        this.setBDeleteBigChest(false);
        var ret = this.initWithSpriteName("coin", "GoldItem.png");
        if (ret) {
            this.playAction(0);
            this._speed = 100;
            this._dir = cc.PointZero();
            this._isAlive = true;
            this._group = GroupGoldPrizeActor;
        }

        return ret;
    },
    removeSelfFromScene:function () {
        if (this._particle != null) {
            this._particle.stopSystem();
            this._particle.setVisible(false);
            this._particle.removeFromParentAndCleanup(true);
            this._particle = null;
        }

        this.setBDeleteBigChest(false);
        this._super();
    },
    update:function (dt) {
        this._super(dt);
        //////////////////////////////////////////////////////////////////////////
        // 以下函数用来解决由于资源加载时间长导致金币刚出现就偏离设定初始位置太远的问题，
        // 和TutorialAwardAnimationBase.addGoldPrize(int score, int count, GameSceneBase *target) 配合工作。
        if (false == this.getUpdatebySelfValue()) {
            this.setUpdatebySelf(true);
            return;
        }
        //////////////////////////////////////////////////////////////////////////

        this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this._dir, this._speed * dt)));
        if (this._particle != null) {
            this._particle.setPosition(this.getPosition());
        }

        if (this.getIsAlive()) {
            if (!cc.Rect.CCRectContainsPoint(EScreenRect, this.getPosition())) {
                if (this._deleteBigChest) {
                    //by now, there should only be 1 max chest
                    var chest = this.getScene().getActors(GroupMaxChestActor)[0];
                    if(chest)
                    chest.deleteBigChest();

/*                    var chests = this.getScene().getActors(GroupMaxChestActor);
                    for (var i = chests.length-1; i>=0; i--) {
                        var chest = chests[i];
                        chest.deleteBigChest();
                        //chest.removeSelfFromScene();

                    }*/
                }
                this.removeSelfFromScene();
                return;
            }
        }
    },
    getBaseActortype:function () {
        return BaseActorType.eGoldPrizeActor;
    },
    dropGoldPrizeWithFishPoint:function (pt1, pt2) {
        this._dir = cc.pSub(pt2, pt1);

        this._speed = Math.pow(Math.pow(this._dir.x, 2) + Math.pow(this._dir.y, 2), 0.5) / 1.5;
        this._dir = cc.pNormalize(this._dir);
        var ang = Math.atan2(this._dir.x, this._dir.y);
        if (this._particle != null) {
            this._particle.setAngle(270 - ang / Math.PI * 180);
        }

    }
});

GoldPrizeActor.sharedActor = function () {
    if (!this._sharedActor) {
        this._sharedActor = new GoldPrizeActor();
        this._sharedActor.initWithDef("");
    }

    return this._sharedActor;
};

GoldPrizeActor._sharedActor = null;

var BigPrizeActor = BaseActor.extend({
    initWithDef:function (def_) {
        var ret = this.initWithSpriteName("nihongdeng", "SmallItem.png");
        if (ret) {
            this.playAction(0);
            this._group = GroupBigGoldPrizeActor;
        }
        return ret;
    },
    getBaseActortype:function () {
        return BaseActorType.eBigPrizeActor;
    },
    replayAction:function () {
        this.setUpdatebySelf(false);
        this.setUpdatebySelf(true);
        this.playAction(0);
    }
});

var ChestActor = BaseActor.extend({
    initWithDef:function(def_){
        this._def = def_;
        var bRet = this.initWithSpriteName("chest", "chest.png");
        if (bRet)
        {
            this.playAction(0);
            this._group = GroupChestActor;
            this.prizeNumber = 0;
            this.IsOpen = false;
        }
        return bRet;
    },
    getBaseActorType:function(){return ActorType.eChestActor},
    removeSelfFromScene:function(){
        this.getScheduler().unscheduleAllSelectorsForTarget(this);
        this._super();
    },
    resetState:function(){
        //this.setVisible(false);
        this._super();
    },
    addParticleSystem:function(){
        var tempParticle = cc.ParticleSystemQuad.create(ImageName("kaibaoxiang02.plist"));
        tempParticle.setPosition(this.getPosition());
        //self.pParticle = tempParticle;
        this.getScene().addChild(tempParticle, 10);
    },
    dropGoldPrizeWithFishPoint:function(pt1, pt2){},
    addScoreNumber:function(){},
    addGoldPrize:function(){},
    deleteChest:function(pNode){
        this.getScene().getChestGameLayer().addChest();
        this.removeSelfFromScene();
    },
    openChestFinished:function(){},
    replayAction:function(){},
    chestContainsPoint:function(pos){},
    initScoreNumber:function(pNode){},
    addGoldPrizeDel:function(dict){},
    getChestRect:function(){
        var chestWidth =  136.0;
        var chestHeight = 116.0;
        return new cc.Rect(this.getPosition().x - chestWidth / 2, this.getPosition().y - chestHeight / 2, chestWidth, chestHeight);
    },
    deleteBigChest:function(SceneSprite){},
    ChestMove:function(){
        var moveSprite = cc.MoveTo.create(1.00, VisibleRect.center());
        var call = cc.CallFunc.create(this, this.deleteChest);
        this.runAction(cc.Sequence.create(moveSprite, call));
    },
    DrawOval:function(){},
    prizeNumber:0,
    getPrizeNumber:function(){return this.prizeNumber},
    setPrizeNumber:function(prizeNumber){this.prizeNumber = prizeNumber},
    pParticle:null,
    getParticle:function(){return this.pParticle},
    setParticle:function(pParticle){
        if (pParticle != this.pParticle)
        {
            this.pParticle = pParticle;
        }
    },
    bMinOrMax:false,
    getMinOrMax:function(){return this.bMinOrMax},
    setMinOrMax:function(bMinOrMax){this.bMinOrMax = bMinOrMax},
    IsOpen:false,
    getIsOpen:function(){return this.IsOpen},
    setIsOpen:function(IsOpen){this.IsOpen = IsOpen},
    iDirection:0,
    getDirection:function(){return this.iDirection},
    setDirection:function(iDirection){this.iDirection = iDirection},
    bInvincible:false,
    getInvincible:function(){return this.bInvincible},
    setInvincible:function(bInvincible){this.bInvincible = bInvincible},

    OvalPos:null,
    getOvalPos:function(){return this.OvalPos},
    setOvalPos:function(OvalPos){this.OvalPos = OvalPos},
    OvalDirection:false,
    getOvalDirection:function(){return this.OvalDirection},
    setOvalDirection:function(OvalDirection){this.OvalDirection = OvalDirection},
    Angle:null,
    getAngle:function(){return this.Angle},
    setAngle:function(Angle){this.Angle = Angle},
    isInvalidateTimer:false,
    getIsInvalidateTimer:function(){return this.isInvalidateTimer},
    setIsInvalidateTimer:function(isInvalidateTimer){this.isInvalidateTimer = isInvalidateTimer},
    isMoveChest:false,
    getIsMoveChest:function(){return this.isMoveChest},
    setIsMoveChest:function(isMoveChest){this.isMoveChest = isMoveChest},
    GerRandomNum:0,
    getGerRandomNum:function(){return this.GerRandomNum},
    setGerRandomNum:function(GerRandomNum){this.GerRandomNum = GerRandomNum},
    isMoveBy:false,
    getIsMoveBy:function(){return this.isMoveBy},
    setIsMoveBy:function(isMoveBy){this.isMoveBy = isMoveBy},
    ChestGoldSprite:null,
    getChestGoldSprite:function(){return this.ChestGoldSprite},
    setChestGoldSprite:function(ChestGoldSprite){this.ChestGoldSprite = ChestGoldSprite},
    UPSprite:null,
    getUPSprite:function(){return this.UPSprite},
    setUPSprite:function(UPSprite){this.UPSprite = UPSprite},
    Chestlabel:null,
    getChestlabel:function(){return this.Chestlabel},
    setChestlabel:function(Chestlabel){this.Chestlabel = Chestlabel},
    prizeType:null,
    getPrizeType:function(){return this.prizeType},
    setPrizeType:function(prizeType){this.prizeType = prizeType},
    speed:0,
    dir:null
});
ChestActor.OvalCiShu = -1;

var MaxChestActor = ChestActor.extend({
    ctor:function(){
        this.prizeType = "";
    },
    initWithDef:function(def_){
        this._def = def_;
        var bRet = this.initWithSpriteName("chest", "chest.png");

        if (bRet)
        {
            this.playAction(0);
            this._group = GroupMaxChestActor;
        }
        return bRet;
    },
    deleteBigChest:function(SceneSprite){
        if (SceneSprite != null)
        {
            this.getScene().getChestGameLayer().removeChild(SceneSprite, true);
        }

        if (this.getPrizeType() == "Gold")
        {

        }
        else if (this.getPrizeType() == "Exp")
        {
            PlayerActor.sharedActor().updateTutorialCatchMoney(this.getPrizeNumber());
        }
        else if (this.getPrizeType() == "Laser")
        {
            var LaserNum = wrapper.getIntegerForKey(kLaserNum);
            var tempLaserNum =  LaserNum + this.getPrizeNumber();
            wrapper.setIntegerForKey(kLaserNum, tempLaserNum);
            wrapper.setIntegerForKey(kLaserSign, PlayerActor.laserSign(""+tempLaserNum));
        }

        this.getScene().getChestGameLayer().removeChild(this.getChestlabel(), true);
        this.getScene().getChestGameLayer().removeChild(this.getChestGoldSprite(), true);
        this.getScene().getChestGameLayer().removeChild(this.UPSprite, true);

        var chests = this.getScene().getActors(GroupMaxChestActor);
        var pChest = null;
        for(var i = chests.length-1; i>=0; i--)
        {
            var chest = chests[i];
            chest.removeSelfFromScene();
        }
    },
    initScoreNumber:function(pNode){
        if (this.iDirection == 0)
        {
            this.getScene().getChestGameLayer().DelChestScoreNumber();
        }
        cc.spriteFrameCache.addSpriteFrames(ImageName("chestreward.plist"));
        if (this.getPrizeType() === "Gold")
        {
            var temp =  this.getPrizeNumber();
            var labelNum = cc.LabelAtlas.create(temp, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
            var prizeSprite = cc.Sprite.createWithSpriteFrameName(("prizesign1.png"));
            labelNum.setScale(0.5);
            prizeSprite.setScale(0.5);
            var prizeOffset = cc.p(-35,90);

            var labelOffset = cc.p(-20, 80);
            prizeSprite.setPosition(cc.pAdd(this.getPosition(), prizeOffset));
            prizeSprite.setTag(LUIChestTag);
            this.getScene().getChestGameLayer().addChild(prizeSprite, 130);

            labelNum.setPosition(cc.pAdd(this.getPosition(), labelOffset));
            labelNum.setTag(LUIChestTag);
            this.getScene().getChestGameLayer().addChild(labelNum, 130);
        }
        else if (this.getPrizeType() == "Exp")
        {
            var EXPSprite = cc.Sprite.createWithSpriteFrameName(("EXP.png"));
            EXPSprite.setScale(0.5);
            var expYoffset =110;
            EXPSprite.setPosition(cc.pAdd(this.getPosition(), cc.p(0,expYoffset)));
            EXPSprite.setTag(LUIChestTag);
            this.getScene().getChestGameLayer().addChild(EXPSprite, 130);

            var temp = this.getPrizeNumber()+"";
            var labelNum = cc.LabelAtlas.create(temp, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
            labelNum.setScale(0.5);
            labelOffset = cc.p(-35,30);
            labelNum.setPosition(cc.pAdd(EXPSprite.getPosition(), labelOffset));
            labelNum.setTag(LUIChestTag);
            this.getScene().getChestGameLayer().addChild(labelNum, 130);
        }
        else if (this.getPrizeType() == "Laser")
        {
            var RewardSprite = cc.Sprite.createWithSpriteFrameName(("button_prop_Laser.png"));

            RewardSprite.setScale(0.5);
            var yOffset = 120;
            RewardSprite.setPosition(cc.pAdd(this.getPosition(), cc.p(0, yOffset)));
            RewardSprite.setTag(LUIChestTag);
            this.getScene().getChestGameLayer().addChild(RewardSprite, 130);
        }
    },
    addGoldAt:function(dictORdt){
        if((typeof dictORdt) === "object" )
        {
            var dict = dictORdt;
            playEffect(COIN_EFFECT1);
            var strPrePoint = dict["perPoint"];
            var perPoint = parseInt(strPrePoint);
            var p = cc.PointFromString(dict["position"]);
            var distpos = cc.PointFromString(dict["distpos"]);
            var pPParticle = cc.ParticleSystemQuad.create(ImageName("goldlizi.plist"));
            var goldcoin = ActorFactory.create("GoldPrizeActor");
            goldcoin.setPoint(perPoint);
            var oddsNumber = this.getScene().getOddsNumber();
            this.getScene().addPlayerMoney(perPoint / oddsNumber);
            goldcoin.setPosition(p);

            goldcoin.setParticle(pPParticle);
            goldcoin.resetState();
            goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), cc.pAdd(distpos,cc.p(100,-100)));
            //[pParticle setPosition:self.position];
            this.getScene().addChild(pPParticle, 10);
            this.getScene().addActor(goldcoin);
            this.deleteBigChest();
        }
        else{
            this.getScheduler().unscheduleSelector(this.addGoldAt, this);
            this.addGoldAt(this.m_pCallParamDict);
        }
    },
    addGoldPrizeDel:function(dictORdt){
        if((typeof dictORdt) === "object")
        {
            var dict = dictORdt
            playEffect(COIN_EFFECT1);
            var strPrePoint = dict["perPoint"];
            var perPoint = parseInt(strPrePoint);
            var pParticle = cc.ParticleSystemQuad.create(ImageName("goldlizi.plist"));
            var goldcoin  = ActorFactory.create("GoldPrizeActor");
            goldcoin.setPoint(perPoint);

            this.getScene().addPlayerMoney(perPoint/this.getScene().getOddsNumber());
            goldcoin.setPosition(this.getPosition());
            goldcoin.setParticle(pParticle);
            goldcoin.resetState();
            goldcoin.setBDeleteBigChest(true);
            goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), cc.p(195, 0));
            pParticle.setPosition(this.getPosition());
            this.getScene().addChild(pParticle, 10);
            this.getScene().addActor(goldcoin);
        }
        else{
            this.getScheduler().unscheduleSelector(this.addGoldPrizeDel, this);
            this.addGoldPrizeDel(this.m_pCallParamDict);
        }
    },
    ChestMove:function(){
        this.setPosition(VisibleRect.center());
        var moveSprite = cc.MoveTo.create(1.00, cc.p((this.iDirection + 1) * screenWidth / 6, VisibleRect.center().y));
        var call = cc.CallFunc.create(this, this.initScoreNumber);
        this.runAction(cc.Sequence.create(moveSprite, call, null));
    },
    ChestMoveCenter:function(){
        var moveSprite1 = cc.MoveTo.create(1.00, VisibleRect.center());
        var moveSprite2 = cc.MoveTo.create(0.50, cc.p((this.iDirection + 1) * screenWidth / 6, VisibleRect.center().y));
        if (this.iDirection == 0)
        {
            var call = cc.CallFunc.create(this.getScene().getChestGameLayer(), ChestGameLayer.prototype.RandomOvalForCall);
            this.runAction(cc.Sequence.create(moveSprite1, moveSprite2, call));
        }
        else
        {
            this.runAction(cc.Sequence.create(moveSprite1, moveSprite2));
        }
    },
    ChestMoveToPos:function(pos, timef){
        var moveSprite = cc.MoveTo.create(timef, pos);
        var call = cc.CallFunc.create(this, this.ChestMoveInit);

        this.runAction(cc.Sequence.create(moveSprite,call, 0));
    },
    ChestMoveInit:function(pNode){
        this.setPosition(cc.p((this.iDirection+1)*screenWidth/6,VisibleRect.center().y));
    },
    addGameReward:function(){
        var tempParticle = cc.ParticleSystemQuad.create(ImageName("kaibaoxiang02.plist"));
        tempParticle.setPosition(this.getPosition());
        this.setParticle(tempParticle);
        this.addChild(tempParticle, 10);
        if (this.getPrizeType() === "Exp")
        {
            this.UPSprite = cc.Sprite.createWithSpriteFrameName(("EXP.png"));
            var expPosOffset = cc.p(5,200);
            this.UPSprite.setPosition(cc.pAdd(this.getPosition(), expPosOffset));
            //this.getScene().getChestGameLayer().addChild(this.UPSprite);
            this.getScene().getChestGameLayer().addChild(this.UPSprite);
            var FlyingframeCache = cc.spriteFrameCache;

            // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
            FlyingframeCache.addSpriteFrames(ImageName("FlyingBook.plist"));

            var FlyingSpriteNode = [
            FlyingframeCache.getSpriteFrame("fb0000.png"),
            FlyingframeCache.getSpriteFrame("fb0001.png"),
            FlyingframeCache.getSpriteFrame("fb0002.png"),
            FlyingframeCache.getSpriteFrame("fb0003.png"),
            FlyingframeCache.getSpriteFrame("fb0004.png"),
            FlyingframeCache.getSpriteFrame("fb0005.png")
            ];

            var FlyingSpriteNode1 = [
            FlyingframeCache.getSpriteFrame("fb0005.png"),
            FlyingframeCache.getSpriteFrame("fb0004.png"),
            FlyingframeCache.getSpriteFrame("fb0003.png"),
            FlyingframeCache.getSpriteFrame("fb0002.png"),
            FlyingframeCache.getSpriteFrame("fb0001.png"),
            FlyingframeCache.getSpriteFrame("fb0000.png")];

            var pos1 =cc.p(5,100);
            var pos2 = cc.p(650,720);
            var angle = cc.pAngleSigned(cc.pAdd(this.getPosition(), pos1), pos2);
            var FlyingAnimation;
            if (angle>=0)
            {
                FlyingAnimation = cc.Animation.create(FlyingSpriteNode1, 0.1);
            }
            else
            {
                FlyingAnimation = cc.Animation.create(FlyingSpriteNode, 0.1);
            }

            var BookAnimate = cc.Animate.create(FlyingAnimation, false);
            var RewardSprite = cc.Sprite.createWithSpriteFrame(FlyingframeCache.getSpriteFrame("fb0000.png"));
            var BookRepeat = cc.RepeatForever.create(BookAnimate);
            var yOffset = 190;

            var targetPos= cc.p(156, -24);
            RewardSprite.setPosition(cc.pAdd(this.getPosition(), cc.p(5, yOffset)));
            RewardSprite.setScale(1.0);

            RewardSprite.setRotation(angle/Math.PI*180);
            var moveTo = cc.MoveTo.create(1.0, cc.pAdd(VisibleRect.top(), targetPos));//actionWithDuration: Distance/(kIsPad?200:100) position:cc.p(kIsPad?650:325-RewardSprite.position.x, kIsPad?720:310-RewardSprite.position.y)];

            var call1 = cc.CallFunc.create(this, this.deleteBigChest);
            RewardSprite.runAction(BookRepeat);
            RewardSprite.runAction(cc.Sequence.create(moveTo,call1));

            this.getScene().getChestGameLayer().addChild(RewardSprite, 100);

            var temp = this.getPrizeNumber()+"";
            this.Chestlabel = cc.LabelAtlas.create(temp, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
            this.Chestlabel.setScale(0.6);
            var labelOffset= cc.p(-20, 140);
            this.Chestlabel.setPosition(cc.pAdd(this.getPosition(), labelOffset));
            this.getScene().getChestGameLayer().addChild(this.Chestlabel);
        }
        else if (this.getPrizeType() === "Gold")
        {
            //应该调用掉金币的函数
            var score = this.getPrizeNumber() / this.getScene().getOddsNumber();
            var pos= cc.p(5,80);
            TutorialAwardAnimation.addScoreNumber(score, cc.pAdd(this.getPosition(),pos), this.getScene());
            this.addGoldPrizeWithPlayAnimation(false);
        }
        else if (this.getPrizeType() === "Laser")
        {
            playEffect(ACH_EFFECT);
            //应该调用收集到激光的函数
            this.UPSprite = cc.Sprite.createWithSpriteFrameName(("button_prop_Laser.png"));
            this.UPSprite.setScale(0.5);
            var posOffset = cc.p(5,200);
            this.UPSprite.setPosition(cc.pAdd(this.getPosition(), posOffset));
            //this.getScene().getChestGameLayer().addChild(this.UPSprite);
            this.getScene().getChestGameLayer().addChild(this.UPSprite);
            var RewardSprite = cc.Sprite.createWithSpriteFrameName(("button_prop_Laser.png"));
            RewardSprite.setScale(0.5);
            RewardSprite.setPosition(this.getPosition());

            var targetPosX = 700.0;
            var moveTo = cc.MoveTo.create(1.0, cc.p(targetPosX, VisibleRect.bottom().y));
            var call1 = cc.CallFunc.create(this, this.deleteBigChest);
            RewardSprite.runAction(cc.Sequence.create(moveTo, call1));
            this.getScene().getChestGameLayer().addChild(RewardSprite, 100);
        }

        var frameCache = cc.spriteFrameCache;
        // @warning 此 plist 在进游戏时预加载了。如有问题可在此重新加载
        frameCache.addSpriteFrames(ImageName("BaoXiangLight.plist"));

        var ChestSpriteNode = [
            frameCache.getSpriteFrame("boxlinght_01.png"),
            frameCache.getSpriteFrame("boxlinght_02.png"),
            frameCache.getSpriteFrame("boxlinght_03.png"),
            frameCache.getSpriteFrame("boxlinght_04.png"),
            frameCache.getSpriteFrame("boxlinght_05.png")];

        var ChestAnimation = cc.Animation.create(ChestSpriteNode, 0.2);
        var Chest01 = cc.Animate.create(ChestAnimation, false);
        this.ChestGoldSprite = cc.Sprite.createWithSpriteFrame(frameCache.getSpriteFrame("boxlinght_01.png"));
        var repeat = cc.RepeatForever.create(Chest01);
        var yOffset= 190.0;
        this.ChestGoldSprite.setPosition(cc.pAdd(this.getPosition(), cc.p(5, yOffset)));
        this.ChestGoldSprite.setScale(2.0);
        this.ChestGoldSprite.runAction(repeat);
        this.name = "hello";
        this.getScene().getChestGameLayer().addChild(this.ChestGoldSprite);
        //this.addChild(this.ChestGoldSprite,9999)
    },
    addGoldPrizeWithPlayAnimation:function(bPlayAnimation, dict){
        if(dict != null)
        {
            playEffect(COIN_EFFECT1);
            var strPrePoint = (dict["perPoint"]);
            var perPoint =  parseInt(strPrePoint);
            var pParticle = cc.ParticleSystemQuad.create(ImageName("goldlizi.plist"));
            var goldcoin = ActorFactory.create("GoldPrizeActor");
            goldcoin.setPoint(perPoint);

            this.getScene().addPlayerMoney(perPoint/this.getScene().getOddsNumber());
            goldcoin.setPosition(this.getPosition());
            goldcoin.setParticle(pParticle);
            goldcoin.resetState();
            goldcoin.setBDeleteBigChest(true);
            goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), cc.p(195, 0));
            pParticle.setPosition(this.getPosition());
            this.getScene().addChild(pParticle, 10);
            this.getScene().addActor(goldcoin);
        }
        else{
            var count = this.getPrizeNumber() / 100 + 2;
            if (count>3) {
                count = 3;
            }
            var distpos = cc.p(195, 0);
            PlayerActor.sharedActor().setPlayerMoney(PlayerActor.sharedActor().getPlayerMoney() + this.getPrizeNumber());
            //ApparkDataManagerWrapper.addCoinsEarned(getPrizeNumber());

            var perPoint = 0;
            for (var idx = 0; idx < count; idx++)
            {
                /*var dict = new cc.Dictionary<std.string, cc.Object*>();
                dict.autorelease();*/
                var dict = {};
                var pPoint = perPoint+"";
                dict["perPoint"] = pPoint;

                var pPos = "{"+this.getPosition().x+","+this.getPosition().y+"}";
                dict["position"] = pPos;

                var pPos2 = "{"+distpos.x+","+distpos.y+"}";
                dict["distpos"] = pPos2;;
                this.m_pCallParamDict = dict;

                if (idx == count-1)
                {
/*                    var  call = cc.CallFunc.create(this, this.deleteBigChest);
                    var call2 = cc.CallFunc.create(this, this.addGoldPrizeDel);
                    var delay = cc.DelayTime.create(0.5);*/
                    this.schedule(this.addGoldPrizeDel, 0.5, false);
                    //this.runAction(cc.Sequence.create(delay,call,call2))
                }
                else
                {
                    this.getScheduler().scheduleSelector(this.addGoldAt, this, 0.5, false);
                }
            }
        }
    },
    resetState:function(){
        this._super();
        this.setPrizeNumber(0);
        this.setPrizeType(null);
        this.setIsOpen(false);
        this.setGetRandomNum(0);
    },

    prizeNumber:0,
    getPrizeNumber:function(){return this.prizeNumber},
    setPrizeNumber:function(prizeNumber){this.prizeNumber = prizeNumber},

    prizeType:null,
    getPrizeType:function(){return this.prizeType},
    setPrizeType:function(prizeType){
        if (prizeType == null)
        {
            this.prizeType = "";
        }
        else
        {
            this.prizeType = prizeType;
        }
    },

    getRandomNum:0,
    getGetRandomNum:function(){return this.getRandomNum},
    setGetRandomNum:function(getRandomNum){this.getRandomNum = getRandomNum},
    iDirection:0,
    getIDirection:function(){return this.iDirection},
    setIDirection:function(iDirection){this.iDirection = iDirection},
    isOpen:false,
    getIsOpen:function(){return this.isOpen},
    setIsOpen:function(isOpen){this.isOpen = isOpen},

    ChestGoldSprite:null,
    getChestGoldSprite:function(){return this.ChestGoldSprite},
    setChestGoldSprite:function(ChestGoldSprite){this.ChestGoldSprite = ChestGoldSprite},
    UPSprite:null,
    getUPSprite:function(){return this.UPSprite},
    setUPSprite:function(UPSprite){this.UPSprite = UPSprite},
    Chestlabel:null,
    getChestlabel:function(){return this.Chestlabel},
    setChestlabel:function(Chestlabel){this.Chestlabel = Chestlabel},
    m_pCallParamDict:null
});