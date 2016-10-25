//鱼的种类
var FISH = {
    Base:0,
    Shark:1,
    GoldShark:2,
    Lantern:3,
    Porgy:4,
    Amphiprion:5,
    Puffer:6,
    Croaker:7,
    Ray:8,
    Chelonian:9,
    Bream:10,
    AngleFish:11,
    SmallFish:12,
    MarlinsFish:13,
    GMarlinsFish:14,
    GrouperFish:15,
    ButterFly:16,
    Pomfret:17,
    GoldenTrout:18
};

var valueOfDropShell = [80, 50, 30, 20, 10];

var valueOfSecKilling = [
    [500, 1000, 1200, 1500, 2000],
    [500, 1000, 1200, 1500, 2000]
];
var kOneAngleMore = 361.0;

var SCARE_MODE = {
    runAway:0,
    pop:1,
    runWithGroup:2
};

var BaseFishActor = BaseActor.extend({
    prizeScore:0,
    getPrizeScore:function () {
        return this.prizeScore
    },
    setPrizeScore:function (prizeScore) {
        this.prizeScore = prizeScore
    },

    offset:null, //point
    getOffset:function () {
        return new cc.Point(this.offset.x, this.offset.y);
    },
    setOffset:function (offset) {
        this.offset.x = offset.x;
        this.offset.y = offset.y;
    },

    GoldPos:null,
    getGoldPos:function () {
        return {x:this.GoldPos.x, y:this.GoldPos.y}
    },
    setGoldPos:function (GoldPos) {
        this.GoldPos.x = GoldPos.x;
        this.GoldPos.y = GoldPos.y;
    },

    //当前碰撞索引
    curCollideIndex:0,
    getCurCollideIndex:function () {
        return this.curCollideIndex
    },
    setCurCollideIndex:function (curCollideIndex) {
        this.curCollideIndex = curCollideIndex
    },

    beRightDir:false,
    getBeRightDir:function () {
        return this.beRightDir
    },
    setBeRightDir:function (beRightDir) {
        this.beRightDir = beRightDir
    },

    //鱼类型
    _fishType:FISH.smallFish,
    getFishType:function () {
        return this._fishType
    },
    setFishType:function (fishType) {
        this._fishType = fishType
    },

    radiusOffset:0,
    getRadiusOffset:function () {
        return this.radiusOffset
    },
    setRadiusOffset:function (radiusOffset) {
        this.radiusOffset = radiusOffset
    },

    _fishLevel:FishLevel.eFishLevel1,
    getFishLevel:function () {
        return this._fishLevel
    },

    _actorType:ActorType.eActorTypeTL,
    getActorType:function () {
        return this._actorType
    },
    setActorType:function (actorType) {
        this._actorType = actorType
    },

    FishID:0,
    getFishID:function () {
        return this.FishID
    },
    setFishID:function (FishID) {
        this.FishID = FishID
    },

    IsChangeColor:false,
    getIsChangeColor:function () {
        return this.IsChangeColor
    },
    setIsChangeColor:function (IsChangeColor) {
        this.IsChangeColor = IsChangeColor
    },

    HP:0,
    getHP:function () {
        return this.HP
    },
    setHP:function (HP) {
        this.HP = HP
    },

    CaptureRandom:0,
    getCaptureRandom:function () {
        return this.CaptureRandom
    },
    setCaptureRandom:function (CaptureRandom) {
        this.CaptureRandom = CaptureRandom
    },

    ChestFishID:0,
    getChestFishID:function () {
        return this.ChestFishID
    },
    setChestFishID:function (ChestFishID) {
        this.ChestFishID = ChestFishID
    },

    stimulateId:null,
    getStimulateId:function () {
        return this.stimulateId
    },
    setStimulateId:function (stimulateId) {
        this.stimulateId = stimulateId
    },

    noFeedBackPro:null,
    getNoFeedBackPro:function () {
        return this.noFeedBackPro
    },
    setNoFeedBackPro:function (noFeedBackPro) {
        this.noFeedBackPro = noFeedBackPro
    },

    fishAttackedType:FishAttackedType.eFishAttackedNormal,
    getFishAttackedType:function () {
        return this.fishAttackedType
    },
    setFishAttackedType:function (fishAttackedType) {
        this.fishAttackedType = fishAttackedType
    },

    mortality:false,
    getMortality:function () {
        return this.mortality
    },
    setMortality:function (mortality) {
        this.mortality = mortality
    },

    createPosition:null,
    getCreatePosition:function () {
        return {x:this.createPosition.x, y:this.createPosition.y}
    },
    setCreatePosition:function (createPosition) {
        this.createPosition.x = createPosition.x;
        this.createPosition.y = createPosition.y;
    },

    expectation:0.1,
    getExpectation:function () {
        return this.expectation
    },
    setExpectation:function (expectation) {
        this.expectation = expectation
    },

    ctor:function (defname, imgname) {
        this.fishSortLevel = ["10", "9", "8", "7", "6", "5", "4", "12", "3", "2", "1", "0", "11"];
        this._super(defname, imgname);

        this.offset = {x:0, y:0};
        this.createPosition = {x:0, y:0};
        this.straightDirVec = {x:0, y:0};
        this.position = {x:0, y:0};
        this.straightStartPosition = {x:0, y:0};
        this.straightEndPosition = {x:0, y:0};
        this.controlPoint = {x:0, y:0};


        this._group = GroupFishActor;
        this._fishType = FISH.smallFish;
        this.speed = 100;
        this.curCollideIndex = -1;
        this.curAttackState = AttackState.eAttackStateNone;
        this.HP = 0;
        this.fishAttackedType = FishAttackedType.eFishAttackedNormal;
        this.curAction = 0;
        this.setAction(this.curAction);
    },

    _group:null,
    getGroup:function () {
        return this._group
    },
    setGroup:function (group) {
        this._group = group
    },

    resetState:function () {
        this._super();
        this.curAttackState = AttackState.eAttackStateNone;
        this.stateChangeTime = 0.0;
        this.speedScale = 0.6;
        this.actorType = ActorType.eActorTypeNormal;

        var AchieveArray = GameSetting.getInstance().getChestFishArray();
        var pOneDict = AchieveArray[this.ChestFishID];
        this.HP = pOneDict["Maximum"];
        this.fPullAngle = 0.0;
        this.fPullDis = 0.0;
        this.bPulled = false;
    },

    update:function (dt) {
        this._super(dt);
        if (!this.getIsAlive()) {
            return;
        }

        if (this.controlledByServer) {
            this.copyPositionFromModel();
            return;
        }

        if (this.bPulled) {
            this.passivityMoveToRoundPositon(dt);
        }
        else {
            if (this.curAttackState == AttackState.eAttackStateHited) {
                this.stateChangeTime += dt;
                if (this._fishType == FishType.bigFish) {
                    this.speedScale = 0.6;
                } else if (this._fishType == FishType.mediumFish) {
                    this.speedScale = 0.8;
                } else if (this._fishType == FishType.smallFish) {
                    this.speedScale = 1.2;
                } else {
                    this.speedScale = 0.6;
                }
            }

            if (this.stateChangeTime >= 3.0) {
                this.curAttackState = AttackState.eAttackStateNone;
                this.stateChangeTime = 0.0;
                this.speedScale = 0.6;

                if (this.getFishActorType() == FISH.Puffer) {
                    this.playAction(4);
                    this.setActionDidStopSelector(this.backToNormalState, this);
                }
            }

            switch (this.eMoveType) {
                case MoveType.eMoveByBeeline://0
                    this.fishMoveByBeeline(dt, this.beRightDir);
                    break;
                case MoveType.eMoveByEllipse://1
                    if (this.beRightDir) {
                        this.fishMovebyEllipse(dt, true);
                        if (this.getPosition().x > (VisibleRect.right().x + this.getSize().width)) {
                            this.removeSelfFromScene();
                        }
                    }
                    else if (!this.beRightDir) {
                        this.fishMovebyEllipse(dt, false);
                        //[self fishWheelMove:dt dir:false] ;
                        if (this.getPosition().x < (VisibleRect.left().x - this.getSize().width)) {
                            this.removeSelfFromScene();
                        }
                    }
                    break;
                case MoveType.eMoveByWheel://2
                    this.fishWheelMove(dt, this.beRightDir);
                    break;
                case MoveType.eMoveByCircles://3
                    this.turningInCircles(dt, false);
                    break;
                case MoveType.eMoveByCircleWithCount://4
                    this.turningInCircles(dt, false, 1);
                    break;
                default:
                    break;
            }
        }
    },
    updateInfo:function () {
        this.updateOldInfo();
    },

    updateNewInfo:function () {
    },

    updateOldInfo:function () {
        this.prizeScore = GameSetting.getInstance().getPrizeScoreArray()[this._fishLevel];
        this.expectation = GameSetting.getInstance().getExpectationArray()[this._fishLevel];

        this.topRotationAngle = 0.0;
        this.bottomRotationAngle = 360.0;
        this.wheelAngle = 180.0;
        this.turningCount = 0;
        var radius = 300.0;
        var length = Math.PI * radius;
        this.time1 = length / this.speed;
        this.speedScale = 0.6;

        // When we create server-spawned fish without a path descriptor, the following code will not work.
        // It is not enough to check `this.controlledByServer` because it has not yet been set (because this function is called from the constructor).
        if (this.controlledByServer || !this.controlValues) {
            return;
        }
        this.controlIndex = 0;
        var controlradius = this.getControlRadius(this.controlIndex);
        if (!this.beRightDir) {
            this.controlPoint = cc.p(this.getPosition().x - controlradius.x, this.getPosition().y);
        }
        else {
            this.controlPoint = cc.p(this.getPosition().x + controlradius.x, this.getPosition().y);
        }
        this._passTime = 0;
        var Dir = cc.pSub(this.getPosition(), cc.pAdd(this.getCreatePosition(), cc.p(0.1, 0.1)));
        Dir = cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y);
        this.circlesAngle = ang / Math.PI * 180.0;
        this.moveOut = false;
    },

    copyPositionFromModel:function () {
        var arena = GameCtrl.sharedGame().getArena();
        var fishModel = arena.getFish(this.FishID);
        if (fishModel) {
            //console.log(`Moving fish ${this.FishID} to ${fishModel.position}`);
            this.setPositionX(fishModel.position[0]);
            this.setPositionY(fishModel.position[1]);
            this.setRotation(180 - fishModel.angle * 180 / Math.PI);
        }
    },

    removeSelfFromScene:function () {
        this.getScheduler().unscheduleAllForTarget(this);
        this._super();
    },
    getBaseActorType:function () {
        return BaseActorType.eFishActor;
    },
    getFishActorType:function () {
        return FISH.Base;
    },
    setTurningCount:function (c) {
        this.turningCount = c;
    },
    addScoreNumber:function () {
        this.ScoreNum(this.getPosition());
    },
    ScoreNum:function (Pos) {
        if (this.prizeScore <= 0) {
            return;
        }
        var str = "" + (this.prizeScore * this.getScene().getOddsNumber());
        var labelNum = cc.LabelAtlas.create(str, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
        var prizeSprite = new cc.Sprite("#prizesign1.png");
        var movePoition = cc.p(0, 48);
        var move = cc.p(prizeSprite.getContentSize().width / 2, -prizeSprite.getContentSize().height / 2);
        switch (this.actorType) {
            case ActorType.eActorTypeBL:
                prizeSprite.setRotation(90);
                break;
            case ActorType.eActorTypeBR:
                prizeSprite.setRotation(90);
                break;
            case ActorType.eActorTypeTL:
                movePoition = cc.p(48, 0);
                prizeSprite.setRotation(90);
                labelNum.setRotation(90);
                move = cc.p(-prizeSprite.getContentSize().width / 2, -prizeSprite.getContentSize().height / 2);
                break;
            case ActorType.eActorTypeTR:
            {
                movePoition = cc.p(-48, 0);
                prizeSprite.setRotation(270);
                labelNum.setRotation(270);
                move = cc.p(prizeSprite.getContentSize().height / 2, prizeSprite.getContentSize().width / 2);
            }
                break;
            case ActorType.eActorTypeNormal:
                //[prizeSprite setRotation:90];
                break;
            default:
                break;
        }

        var moveBy = cc.MoveBy.create(1.05, movePoition);
        var fadeIn = cc.FadeIn.create(0.35);
        var fadeOut = cc.FadeOut.create(0.35);
        var delayTime = cc.DelayTime.create(0.35);

        //CCScaleBy *scaleby = [CCScaleBy actionWithDuration:0.2f scale:1.2 ];
        //id scaleRev = [scaleby reverse];
        var sequ = cc.Sequence.create(fadeIn, delayTime, fadeOut);
        var spawn = cc.Spawn.create(sequ, moveBy);

        var call = cc.callFunc(this.getScene().removeSprite, prizeSprite);
        prizeSprite.runAction(cc.Sequence.create(spawn, call));
        prizeSprite.setPosition(Pos);
        prizeSprite.setScale(1.0);
        this.getScene().addChild(prizeSprite, 120);

        var moveBy1 = cc.MoveBy.create(1.05, movePoition);
        var fadeIn1 = cc.FadeIn.create(0.35);
        var fadeOut1 = cc.FadeOut.create(0.35);
        var delayTime1 = cc.DelayTime.create(0.35);
        var sequ1 = cc.Sequence.create(fadeIn1, delayTime1, fadeOut1);
        var spawn1 = cc.Spawn.create(sequ1, moveBy1);

        var call1 = cc.callFunc(this.getScene().removeSprite, labelNum );
        labelNum.runAction(cc.sequence(spawn1, call1));
        labelNum.setPosition(cc.pAdd(Pos, move));
        this.getScene().addChild(labelNum, 130);
    },
    playPrizeAnimation:function () {
        if (this.getPrizeScore() >= 80) {
            var pScene = GameCtrl.sharedGame().getCurScene();
            var pScene1 = pScene;
            if (pScene1) {
                pScene1.coinsAnimation(this.getPosition());
            }
        }
        else if (this.getPrizeScore() >= 60) {
            playEffect(COIN_EFFECT2);

            this.addJinDunAnimation(this.getPosition(), 60, this.getActorType());
        }
        else if (this.getPrizeScore() >= 50) {
            playEffect(COIN_EFFECT2);

            this.addJinDunAnimation(this.getPosition(), 50, this.getActorType());
        }
        else if (this.getPrizeScore() >= 40) {
            playEffect(COIN_EFFECT2);

            this.addJinDunAnimation(this.getPosition(), 40, this.getActorType());
        }
        else if (this.getPrizeScore() >= 20) {
            playEffect(COIN_EFFECT2);
        }
        else {
            playEffect(COIN_EFFECT1);
        }
    },
    addGoldPrizeWithPlayAnimation:function (playAnimation) {
        var count = this.referencePointCount();

        var offset = cc.p(256, 30);
        var distpos = cc.pSub(VisibleRect.bottom(), offset);

        if (this.getPrizeScore()) {
            var perPoint = (count == 0) ? this.prizeScore : this.prizeScore / count;

            for (var idx = 0; idx < count; idx++) {
                var p = this.referencePoint(idx);
                var distance = cc.pDistance(p, cc.p());
                p = cc.p(distance * Math.cos(this.getCurRotation()), distance * Math.sin(this.getCurRotation()));

                var pParticle = particleSystemFactory.createParticle(ImageName("goldlizi.plist"));
                pParticle._dontTint = true;

                var goldcoin = ActorFactory.create("GoldPrizeActor");
                goldcoin.setPoint(perPoint);
                goldcoin.setPosition(cc.pAdd(this.getPosition(), p));
                goldcoin.setParticle(pParticle);
                goldcoin.resetState();
                goldcoin.dropGoldPrizeWithFishPoint(goldcoin.getPosition(), distpos);
                pParticle.setPosition(cc.pAdd(this.getPosition(), p));
                this.getScene().addChild(pParticle, 10);
                this.getScene().addActor(goldcoin);
            }
        }
        this.getScene().addPlayerMoney(this.prizeScore);

        if (playAnimation) {
            this.playPrizeAnimation();
        }
    },
    getControlRadius:function (index) {
        if (index >= this.controlValus.length - 1)
            index = this.controlValus.length - 1;

        if (this.controlValus[index])
            return this.controlValus[index];

        return {x:0, y:0};
    },
    deleteLabelScoreNumber:function (sender) {
        this.ScoreNum(this.GoldPos);
        this.getScene().removeSprite(sender);
        this.removeParticle();
    },
    updatePath:function (dict) {
        var strKey = "Radius";
        this.controlValus = (dict[strKey]);

        var speedKey = "speed";
        var pSpeedStr = (dict[speedKey]);
        this.speed = 0;
        if (pSpeedStr != null) {
            this.speed = parseFloat(pSpeedStr);
        }

        //CCLOG(@"speed  is %.f", speed);
        var pMoveTypeStr = dict["MoveDict"];
        this.eMoveType = MoveType.eMoveByBeeline;
        if (pMoveTypeStr != null) {
            this.eMoveType = parseInt(pMoveTypeStr);
        }

        var pOnTheRrcStr = dict["onTheRrc"];
        this.onTheRrc = false;
        if (pOnTheRrcStr != null) {
            this.onTheRrc = (pOnTheRrcStr != "0");
        }
        var pAngle = dict["Angle"];
        if (pAngle != null) {
            this._moveAngle = parseFloat(pAngle);
        }
        else {
            this._moveAngle = 361;
        }
    },
    addFishNetAt:function (pt, weaponType, actType, flag) {
        var NetName = "FishNetActor" + weaponType;
        var net = ActorFactory.create(NetName);
        if (flag) {
            this.setShootFlag(flag);
            net.setShootFlag(flag);
        }
        var tempPar;
        if (weaponType === FishWeaponType.eWeaponLevel5) {
            tempPar = particleSystemFactory.createParticle(res.lizibianhua1Plist);
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else if (weaponType == FishWeaponType.eWeaponLevel7) {
            tempPar = particleSystemFactory.createParticle(res.lizibianhua2Plist);
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else if (weaponType == FishWeaponType.eWeaponLevel10) {
            tempPar = particleSystemFactory.createParticle(res.lizibianhua3Plist);
            tempPar.setDrawMode(cc.PARTICLE_SHAPE_MODE);
            tempPar.setShapeType(cc.PARTICLE_STAR_SHAPE);
        } else {
            tempPar = particleSystemFactory.createParticle(res.yuwangliziPlist);
        }
        if (net != null) {
            net.setParticle(tempPar);
        }
        tempPar._dontTint = true;
        tempPar.setPosition(pt);

        this.getScene().addChild(tempPar, BulletActorZValue + 1);
        if (net != null) {
            net.setGroup(GroupFishNetActor);
            net.resetState();
            net.updateInfo();
            net.setPosition(pt);
            net.setZOrder(BulletActorZValue);
            net.playCatchAction();
            this.getScene().addActor(net);
            if (actType) {
                net.setActorType(actType);
            }
        }
    },
    handleCollide:function (plane) {
        if (this._super(plane)) {
            if (BaseActorType.eBulletActor == plane.getBaseActortype() && this.handleCollideWithBullet(plane)) {
                return true;
            }

            if (BaseActorType.eFishNetActor == plane.getBaseActortype() && this.handleCollideWithNet(plane)) {
                return true;
            }

        }
        return false;
    },
    handleCollideForTutorial:function (shouldCatch, pTarget) {
        var target = pTarget instanceof  BulletActor ? pTarget : false;
        if (target) {
            var pLevin = target instanceof  LevinStormBulletActor;
            if (pLevin) {
                if (target.finalEvent()) {

                }
                else {
                    if (this._fishLevel != FishLevel.eFishLevel13 && this._fishLevel != FishLevel.eFishLevel12 && this._fishLevel > FishLevel.eFishLevel7) {
                        return false;
                    }
                    target.collisionEvent();
                }

            }
            this.addFishNetAt(target.getPosition(), target.getCurWeaponLevel());
            if (!(target instanceof  RayBulletActor) && !(target instanceof  LevinStormBulletActor)) {
                target.removeSelfFromScene();

                if (!this.getScene().getAddPrizeGroup()) {
                    if (this instanceof PufferActor) {
                        this.playAction(2);
                        this.setActionDidStopSelector(this.backToNormalState, this);
                        this.curAttackState = AttackState.eAttackStateHited;
                    }
                }
            }
            else {
                this.playAction(1);
                this.setActionDidStopSelector(this.actionAfterArrested, this);
                this._isAlive = false;

                return true;
            }
            return true;
        }
        else if (pTarget instanceof FishNetActor) {
            if (shouldCatch) {
                if (this instanceof PufferActor) {
                    if (this.curAttackState == AttackState.eAttackStateHited) {
                        return false;
                    }
                }

                this.playAction(1);
                PlayerActor.sharedActor().updateTutorialCatchMoney(this.prizeScore);
                PlayerActor.sharedActor().catchFish(this.getDef());

                this.setActionDidStopSelector(this.actionAfterArrested, this);
                this._isAlive = false;
                return true;
            } else {
                return false;
            }
        }

        return false;
    },

    /**
     * creates fish net, or if its special bullet, kills fishes
     * @param bullet
     * @return {Boolean}
     */
    handleCollideWithBullet:function (bullet) {
        if (this.controlledByServer) {
            return;
        }

        if (BulletType.eRayBullet == bullet.getBulletType() ||
            BulletType.eLevinStormBullet == bullet.getBulletType()) {
            if (BulletType.eLevinStormBullet == bullet.getBulletType()) {
                if (!bullet.finalEvent()) {
                    if (this.getFishLevel() != FishLevel.eFishLevel13 && this.getFishLevel() != FishLevel.eFishLevel12 && this.getFishLevel() > FishLevel.eFishLevel7) {
                        return false;
                    }
                    bullet.collisionEvent();
                }
            }
            this.playAction(1);
            this.setActorType(bullet.getActorType());
            switch (bullet.getActorType()) {
                case ActorType.eActorTypeTL:
                    PlayerActor.sharedActorTL().updateCatchMoney(this.getPrizeScore(), true, false, false);
                    PlayerActor.sharedActorTL().catchFish(this.getDef());

                    break;
                case ActorType.eActorTypeTR:
                    PlayerActor.sharedActorTR().updateCatchMoney(this.getPrizeScore(), true, false, false);
                    PlayerActor.sharedActorTR().catchFish(this.getDef());
                    break;
                case ActorType.eActorTypeBL:
                    break;

                case ActorType.eActorTypeBR:
                    break;

                case ActorType.eActorTypeNormal:
                    if (this.getIsChangeColor()) {
                        var baoixangParticle = particleSystemFactory.createParticle(ImageName("bianbaoxiangl03.plist"));
                        baoixangParticle._dontTint = true;
                        baoixangParticle.setPosition(this.getPosition());
                        this.getScene().addChild(baoixangParticle);
                        this.getScene().getChestGameLayer().addMinChest(this.getChestFishID(), this.getPosition());    //TODO chest game layer
                    }

                    PlayerActor.sharedActor().updateCatchMoney(this.getPrizeScore(), false, false, true);
                    if (PlayerActor.sharedActor().canLevelUp()) {
                        PlayerActor.sharedActor().setPlayerLevel(PlayerActor.sharedActor().getPlayerLevel() + 1);
                        this.getScene().levelUp();
                    }

                    if (FISH.Shark == this.getFishActorType()) {
                        if (PlayerActor.sharedActor().getAutoSave()) {
                            PlayerActor.sharedActor().setCatchSharkWithRay(true);
                            PlayerActor.sharedActor().submitAchievement(0);
                        }
                    }
                    PlayerActor.sharedActor().catchFish(this.getDef(), this.getShootFlag());
                    break;
                default:
                    break;
            }

            this.setActionDidStopSelector(this.actionAfterArrested, this);
            this._isAlive = false;
            return true;
        } else if (BulletType.eHarpoonBullet == bullet.getBulletType()) {
            this.playAction(1);
            this.setActorType(bullet.getActorType());
            switch (bullet.getActorType()) {
                case ActorType.eActorTypeNormal:
                    PlayerActor.sharedActor().updateCatchMoney(this.prizeScore, false, true, true);
                    if (FISH.Shark == this.getFishActorType()) {
                        if (PlayerActor.sharedActor().getAutoSave()) {
                            PlayerActor.sharedActor().setCatchSharkWithRay(true);
                            PlayerActor.sharedActor().submitAchievement(0.0);
                        }
                    }
                    PlayerActor.sharedActor().catchFish(this.getDef(), this.getShootFlag());
                    break;

                default:
                    break;
            }

            this.setActionDidStopSelector(this.actionAfterArrested, this);
            this._isAlive = false;
            return true;
        } else if (BulletType.eSwirlBullet == bullet.getBulletType()) {
            this.bPassivityToRound(bullet.getPosition());

            PlayerActor.sharedActor().updateCatchMoney(this.prizeScore, false, true, true);
            if (FISH.Shark == this.getFishActorType()) {
                if (PlayerActor.sharedActor().getAutoSave()) {
                    PlayerActor.sharedActor().setCatchSharkWithRay(true);
                    PlayerActor.sharedActor().submitAchievement(0.0);
                }
            }
            PlayerActor.sharedActor().catchFish(this.getDef());

            this.playAction(1);
            this.setActionDidStopSelector(this.actionAfterArrested, this);
            this.setIsAlive(false);
            return true;
        }

        if (!this.getScene().getAddPrizeGroup()) {
            if (FISH.Puffer == this.getFishActorType()) {
                this.playAction(2);
                this.setActionDidStopSelector(this.backToNormalState, this);
            }
            if (this.curAttackState == AttackState.eAttackStateNone)
                this.curAttackState = AttackState.eAttackStateHited;
        }

        this.addFishNetAt(bullet.getPosition(), bullet.getCurWeaponLevel(), bullet.getActorType(), bullet.getShootFlag());
        bullet.collisionEvent();
        return false;
    },

    handleCollideWithNet:function (netActor) {
        this.getFinalRandom(netActor);

        if (FISH.Puffer == this.getFishActorType()) {
            if (this.curAttackState == AttackState.eAttackStateHited)
                return false;
        }

        return false;
    },
    SpikeFish:function (isPlayer1) {
        this.playAction(1);
        if (isPlayer1) {
            PlayerActor.sharedActorTL().updateCatchMoney(this.prizeScore, true, true, false);
            PlayerActor.sharedActorTL().catchFish(this.getDef());
        }
        else {
            PlayerActor.sharedActorTR().updateCatchMoney(this.prizeScore, true, true, false);
            PlayerActor.sharedActorTR().catchFish(this.getDef());
        }
        this.setActionDidStopSelector(this.actionAfterArrested, this);
        this._isAlive = false;
    },
    canSecKilling:function () {
        var prizeScoreAvailable = this.prizeScore >= 30;
        var attackTaupeAvailable = this.fishAttackedType != FishAttackedType.eFishAttackedNone;
        return prizeScoreAvailable && attackTaupeAvailable;
    },

    handleSecKillingWith:function (fishnet) {
        var secKillingValue = Math.random() * 10000;
        switch (this.fishAttackedType) {
            case FishAttackedType.eFishAttackedNormal:
                this.fishAttackedType = FishAttackedType.eFishAttackedFirst;
                return secKillingValue <= valueOfSecKilling[0][this._fishLevel];
                break;
            case FishAttackedType.eFishAttackedFirst:
                this.fishAttackedType = FishAttackedType.eFishAttackedSecond;
                return (secKillingValue <= valueOfSecKilling[1][this._fishLevel]);
                break;
            case FishAttackedType.eFishAttackedSecond:
                this.fishAttackedType = FishAttackedType.eFishAttackedNone;
                break;
            case FishAttackedType.eFishAttackedNone:
                break;
            default:
                break;
        }
        return false;
    },

    canDropShell:function () {
        return false;
    },

    dropShellActor:function () {
        if (!this.canDropShell()) {
            return;
        }

        var dropShellValue = Math.random() * 100;
        if (dropShellValue <= valueOfDropShell[this._fishLevel]) {
            cc.assert(0);//ShellActor.shareShellActor().dropAtPosition(this.getPosition());
        }
    },

    fishMoveByBeeline:function (dt, right) {
        var nextStep = cc.p(0, 0);
        if (this._moveAngle >= kOneAngleMore) {
            this._moveAngle = right?360: 180;
        }


        var moveDistance = this.speed * this.speedScale * dt * 0.4;
        var fAngle = Math.PI * this._moveAngle / 180;
        var delta = cc.p(moveDistance * Math.cos(fAngle), moveDistance * Math.sin(fAngle));
        var pos = this.getPosition();
        nextStep = cc.pAdd(pos, delta);

        var Dir = cc.pSub(nextStep, pos);
        Dir = cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y) + Math.PI / 2;

        this.setRotation(ang / Math.PI * 180.0);
        this.setPosition(nextStep);
        pos = this.getPosition();
        var fishSize = this.getSize();//TODO get size of spSprite
        if (this._moveAngle == 180) {
            if (pos.x < VisibleRect.left().x - fishSize.width)
                this.removeSelfFromScene();

        } else if (this._moveAngle == 360) {
            if (pos.x > VisibleRect.right().x + fishSize.width)
                this.removeSelfFromScene();
        } else if (this._moveAngle < 180) {
            if (pos.y > VisibleRect.right().x + fishSize.width)
                this.removeSelfFromScene();
        } else if (this._moveAngle > 180) {
            if (pos.y < VisibleRect.bottom().y - fishSize.height)
                this.removeSelfFromScene();
        }
    },

    turningInCircles:function (dt, right, count) {
        if (count != null) {
            var controlradius = this.getControlRadius(this.controlIndex);
            this.controlPoint = this.createPosition;
            if (this.turningCount > count) {
                this.removeSelfFromScene();
            } else {
                var l = this.getEllipsePerimeter(this.controlPoint.x, this.controlPoint.y);

                this.circlesAngle -= (this.speed * 180.0) * dt / l;
                //circlesAngle -= 10 ;

                if (this.circlesAngle >= 360) {
                    this.circlesAngle -= 360;
                    this.turningCount++;
                }
                else if (this.circlesAngle < 0) {
                    this.circlesAngle += 360;
                    this.turningCount++;
                }
                var angle = this.circlesAngle / 180.0 * Math.PI;

                var nextStep = cc.p(this.controlPoint.x + (controlradius.x + this.radiusOffset) * Math.cos(angle), this.controlPoint.y + (controlradius.y + this.radiusOffset) * Math.sin(angle));

                var Dir = cc.pSub(nextStep, this.getPosition());
                Dir = cc.pNormalize(Dir);
                var ang = Math.atan2(Dir.x, Dir.y) + Math.PI / 2;

                this.setRotation(ang / Math.PI * 180.0);
                this.setPosition(nextStep);
            }
        } else {
            var controlradius = this.getControlRadius(this.controlIndex);
            this.controlPoint = VisibleRect.center();

            count = 3;
            if (this.getScene().getPlayTutorial()) {
                count = 1000;
            }

            if (this.turningCount > count && this.circlesAngle < 220.0 && this.circlesAngle > 190.0) {
                var pt , dir;
                var ang;

                pt = cc.p(100, screenHeight + 200);
                this.moveOut = true;
                dir = cc.pSub(pt, this.getPosition());
                dir = cc.pNormalize(dir);
                ang = Math.atan2(dir.x, dir.y) + Math.PI / 2;

                this.setRotation(ang / Math.PI * 180.0);

                this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(dir, dt * 200)));
                if (this.getPosition().y > screenHeight + 100) {
                    this.removeSelfFromScene();
                }

            } else {
                var l = this.getEllipsePerimeter(controlradius.x, controlradius.y);

                this.circlesAngle -= (this.speed * 180.0) * dt / l;
                //circlesAngle -= 10 ;

                if (this.circlesAngle >= 360) {
                    this.circlesAngle -= 360;
                    this.turningCount++;
                }
                else if (this.circlesAngle < 0) {
                    this.circlesAngle += 360;
                    this.turningCount++;
                }
                //NSLog(@"....angle = %f", circlesAngle) ;
                //220-190
                var angle = this.circlesAngle / 180.0 * Math.PI;

                var nextStep = cc.p(this.controlPoint.x + (controlradius.x + this.radiusOffset) * Math.cos(angle),
                    this.controlPoint.y + (controlradius.y + this.radiusOffset) * Math.sin(angle));
                var curPos = this.getPosition();
                var Dir = cc.pSub(nextStep, curPos);
                Dir = cc.pNormalize(Dir);
                var ang = Math.atan2(Dir.x, Dir.y) + Math.PI / 2;

                this.setRotation(ang / Math.PI * 180.0);
                this.setPosition(nextStep);
            }
        }
    },

    fishWheelMove:function (dt, right) {
        var controlradius = this.getControlRadius(this.controlIndex);
        var l = this.getEllipsePerimeter(controlradius.x, controlradius.y);
        this.wheelAngle -= (this.speed * this.speedScale * 180.0) * dt / l;

        var angle = this.wheelAngle / 180.0 * Math.PI;

        var nextStep = this.getPosition();

        if (right) {
            nextStep = cc.p(this.controlPoint.x + (controlradius.x + this.offset.x) * Math.cos(angle), this.controlPoint.y + (controlradius.y + this.offset.x) * Math.sin(angle));
        }
        else {
            nextStep = cc.p(this.controlPoint.x - (controlradius.x + this.offset.x) * Math.cos(angle), this.controlPoint.y + (controlradius.y + this.offset.x) * Math.sin(angle));
        }

        var Dir = cc.pSub(nextStep, this.getPosition());
        Dir = cc.pNormalize(Dir);
        var ang = Math.atan2(Dir.x, Dir.y) + Math.PI / 2;

        this.setRotation(ang / Math.PI * 180.0);

        this.setPosition(nextStep);
        if (this.wheelAngle < -180) {
            this.removeSelfFromScene();
        }
    },

    fishMovebyEllipse:function (dt, right) {
        var controlradius = this.getControlRadius(this.controlIndex), tmppoint; // ;

        if (this.topRotationAngle >= 180) {
            this.topRotationAngle = 0;
            this.onTheRrc = false;
            tmppoint = this.getControlRadius(this.controlIndex);
            this.controlIndex++;
            controlradius = this.getControlRadius(this.controlIndex);
            (right) ?
                (this.controlPoint.x += (controlradius.x + tmppoint.x) )
                : (this.controlPoint.x -= (controlradius.x + tmppoint.x));
        }

        if (this.bottomRotationAngle <= 180) {
            this.bottomRotationAngle = 360;
            this.onTheRrc = true;
            tmppoint = this.getControlRadius(this.controlIndex);
            this.controlIndex++;
            controlradius = this.getControlRadius(this.controlIndex);
            (right) ?
                (this.controlPoint.x += (controlradius.x + tmppoint.x) )
                : (this.controlPoint.x -= (controlradius.x + tmppoint.x) );
        }
        var l = this.getEllipsePerimeter(controlradius.x, controlradius.y);
        if (this.onTheRrc) {
            this.topRotationAngle += (this.speed * this.speedScale * 180) * dt / l;
        } else {
            this.bottomRotationAngle -= (this.speed * this.speedScale * 180) * dt / l;
        }

        if (this.topRotationAngle >= 180)
            this.topRotationAngle = 180;

        if (this.bottomRotationAngle <= 180)
            this.bottomRotationAngle = 180;

        var angle = (this.onTheRrc) ? this.topRotationAngle / 180.0 * Math.PI : this.bottomRotationAngle / 180.0 * Math.PI;
        var nextStep = right ? ( cc.p(this.controlPoint.x - controlradius.x * Math.cos(angle), this.controlPoint.y + controlradius.y * Math.sin(angle)) )
            : ( cc.p(this.controlPoint.x + controlradius.x * Math.cos(angle), this.controlPoint.y + controlradius.y * Math.sin(angle)) );
        var Dir = cc.pSub(nextStep, this.getPosition());
        Dir = cc.pNormalize(Dir);

        var ang = Math.atan2(Dir.x, Dir.y) + Math.PI / 2;
        this.setRotation(ang / Math.PI * 180.0);
        this.setPosition(nextStep);
    },

    handleCollideForRequired:function (target, gainGold) {
    },

    passivityMoveToRoundPositon:function (dt) {
        this.roundPos = Pos;
        if (!this.bPulled) {
            this.bPulled = true;
            var pos = this.getPosition();
            this.fPullDis = Math.sqrt(Math.pow((this.roundPos.x - pos.x), 2.0) + Math.pow((this.roundPos.y - pos.y), 2.0));
            if (pos.x != this.roundPos.x) {
                this.fPullAngle = Math.atan((pos.y - this.roundPos.y) / (pos.x - this.roundPos.x));

                if (pos.x < this.roundPos.x) {
                    this.fPullAngle += Math.PI;
                }
                else {
                    this.fPullAngle += Math.PI * 2;
                }
            }
            else if (pos.y < this.roundPos.y) {
                this.fPullAngle = Math.PI * 3 / 2;
            }
            else {
                this.fPullAngle = Math.PI / 2;
            }
        }
    },
    bPassivityToRound:function (pos) {
    },

    simpleUpdate:function (dt) {
        this.setPosition(cc.p(this.getPosition().x - 10, this.getPosition().y));
    },
    addSprite:function (node) {
        node.setOpacity(255);
    },
    backToNormalState:function () {
        this.playAction(0);
    },

    getEllipsePerimeter:function (a, b) {
        var _a = a > b ? a : b;
        var _b = a < b ? a : b;
        var l = 2 * Math.PI * _b + 4 * (_a - _b);
        return l;
    },
    addOddNumber:function () {
        if (this.prizeScore <= 0) {
            return;
        }
        var labelNum = cc.LabelAtlas.create("2", ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
        var prizeScore = "" + this.prizeScore;
        var labelNum1 = cc.LabelAtlas.create(prizeScore, ImageName("prizenum.png"), PrizeNum_TextWidth, PrizeNum_TextHeight, '0');
        var prizeSprite = new cc.Sprite("#prizesign1.png");
        var prizeSprite1 = new cc.Sprite("#prizesign1.png");

        var move = cc.p(-prizeSprite.getContentSize().width * 4, prizeSprite.getContentSize().height * 0.7);
        var spawnL = cc.spawn(cc.fadeOut(0.5), cc.scaleTo(0.5, 0.5));
        var call = cc.callFunc(GameScene.removeSprite, this.getScene());
        var sequ = cc.sequence(spawnL, cc.delayTime(0.1));

        var addCall = cc.callFunc(this.addSprite, this);
        prizeSprite.setOpacity(0);
        labelNum.setOpacity(0);

        prizeSprite.runAction(cc.sequence(cc.delayTime(0.5), addCall, sequ, call));
        prizeSprite.setPosition(cc.pAdd(this.getPosition(), move));
        prizeSprite.setScale(1.6);

        var fadeOut1 = new cc.FadeOut(0.5);
        var scaleTo1 = new cc.ScaleTo(0.5, 0.5);
        var delayTime1 = new cc.DelayTime(0.05);
        var spawnL1 = new cc.Spawn(fadeOut1, scaleTo1);
        var sequ1 = cc.sequence(spawnL1, delayTime1);
        var spawn1 = new cc.Spawn(sequ1, sequ1);
        var call1 = cc.callFunc(GameScene.removeSprite, this.getScene());

        labelNum.runAction(cc.sequence(delay, addCall, sequ1, call1));
        labelNum.setPosition(this.getPosition());
        labelNum.setScale(1.6);
        var call2 = cc.callFunc(this.DeletelabelScoreNumber, this);
        var move1 = cc.p(-prizeSprite.getContentSize().width * 0.4, prizeSprite.getContentSize().height * 0.5);
        var delay1 = cc.delayTime(0.5);
        labelNum1.runAction(cc.sequence(delay1, call1));
        labelNum1.setPosition(this.getPosition());
        labelNum1.setScale(1.0);
        prizeSprite1.runAction(cc.sequence(delay1, call2));
        prizeSprite1.setPosition(cc.pAdd(this.getPosition(), move1));
        prizeSprite1.setScale(1.0);

        this.getScene().getScene().addChild(labelNum1, 100);
        this.getScene().getScene().addChild(prizeSprite1, 100);
        this.setGoldPos(this.getPosition());
    },
    removeParticle:function () {
        this.getScene().getScene().removeChildByTag(kParticleDoubleTag, true);
    },
    actionAfterArrested:function () {
        this.addGoldPrizeWithPlayAnimation(true);
        this.addScoreNumber();
        this.removeSelfFromScene();
    },

    getFishExpect:function () {
        var temp;
        var fishIdArray = (GameSetting.getInstance().getFishIdArray());
        var dict = fishIdArray[this._fishLevel];
        temp = dict["weapon5Expect"];
        return temp;
    },
    handleStimulate:function (weaponLevel) {
        var temp;
        var attackIdArray = (GameSetting.getInstance().getAttackIdArray());
        var dict = attackIdArray[weaponLevel - 1];
        switch (this._fishLevel) {
            case FishLevel.eFishLevel1:
                temp = dict["StimulateUnit1"];
                break;
            case FishLevel.eFishLevel2:
                temp = dict["StimulateUnit2"];
                break;
            case FishLevel.eFishLevel3:
                temp = dict["StimulateUnit3"];
                break;
            case FishLevel.eFishLevel4:
                temp = dict["StimulateUnit4"];
                break;
            case FishLevel.eFishLevel5:
                temp = dict["StimulateUnit5"];
                break;
            case FishLevel.eFishLevel6:
                temp = dict["StimulateUnit6"];
                break;
            case FishLevel.eFishLevel7:
                temp = dict["StimulateUnit7"];
                break;
            case FishLevel.eFishLevel8:
                temp = dict["StimulateUnit8"];
                break;
            case FishLevel.eFishLevel9:
                temp = dict["StimulateUnit9"];
                break;
            case FishLevel.eFishLevel10:
                temp = dict["StimulateUnit10"];
                break;
            case FishLevel.eFishLevel11:
                temp = dict["StimulateUnit11"];
                break;
            case FishLevel.eFishLevel12:
                temp = dict["StimulateUnit12"];
                break;
            case FishLevel.eFishLevel13:
                temp = dict["StimulateUnit13"];
                break;
            case FishLevel.eFishLevel14:
                temp = dict["StimulateUnit14"];
                break;
            case FishLevel.eFishLevel15:
                temp = dict["StimulateUnit15"];
                break;
        }
        var stimulateIdArray = (GameSetting.getInstance().getStimulateIdArray());
        for (var i = 0; i < stimulateIdArray.length; i++) {
            dict = stimulateIdArray[i];
            var sId = dict["StimulateID"];
            if (sId == temp) {
                this.stimulateId = sId;
                var nFBP = dict["NoFeedbackPro"];
                this.noFeedBackPro = nFBP;
                break;
            }
        }
    },

    setMoveData:function (data) {
        this.moveData = data;
        //nut
        this.isCompages = false;
        this.bezieratTime = 0;
        this.bezieratTime_total = 0;
        this.comagesId = 0;
    },

    unwindMoveData:function () {
        if (!this.isCompages) {
            this.curMoveType = this.moveData.dataType;
        }
        switch (this.curMoveType) {
            case SW_MOVETYPE.MOVETYPE_STRAIGHT:
            {
                if (this.isCompages) {
                    var ar = (this.moveData.moveData).datas;
                    var db = ar[comagesId].moveData;
                    var sd = db;
                    this.speed = sd.speed;
                    this.setPosition(cc.p(sd.startPosition.x, sd.startPosition.y));
                    this.straightDirVec = cc.pNormalize(cc.pSub(sd.endPosition, this.position));
                    this.straightStartPosition = sd.startPosition;
                    this.straightEndPosition = sd.endPosition;
                    this.straightEndDistance = cc.pDistance(sd.startPosition, sd.endPosition);
                }
                else {
                    var sd;
                    sd = (this.moveData.moveData);
                    this.speed = sd.speed;
                    this.setPosition(cc.p(sd.startPosition.x, sd.startPosition.y));
                    this.straightDirVec = cc.pNormalize(cc.pSub(sd.endPosition, this.position));
                    this.straightStartPosition = sd.startPosition;
                    this.straightEndPosition = sd.endPosition;
                    this.straightEndDistance = cc.pDistance(sd.startPosition, sd.endPosition);
                }
                break;
            }
            case SW_MOVETYPE.MOVETYPE_ELLIPSE:
            {
                var ed = (this.moveData.moveData);
                var array = [];
                var pt = ed.radius;
                array.push("{" + pt.x + ", " + pt.y + "}");
                this.controlPoints = array;
                this.speed = ed.speed;
                this.setPosition(this.moveData.initPosition);
                this.onTheRrc = ed.onTheRrc;
                this.beRightDir = ed.beRightDir;

                this.topRotationAngle = 0.0;
                this.bottomRotationAngle = 360;
                this.wheelAngle = 90.0;
                this.controlIndex = 0;
                var controlradius = this.getControlRadius(this.controlIndex);
                if (!this.beRightDir)
                    this.controlPoint = cc.p(this.position.x - controlradius.x, this.position.y);
                else {
                    this.controlPoint = cc.p(this.position.x + controlradius.x, this.position.y);
                }
                break;
            }
            case SW_MOVETYPE.MOVETYPE_UTYPE:
            {
                this.uTypeStep = 0;
                var ud = (this.moveData.moveData);
                this.speed = ud.speed;
                this.setPosition(this.moveData.initPosition);
                this.initDir = ud.initDir;
                this.clockwise = ud.clockwise;
                this.radius = ud.radius;
                this.playAction(ud.action);
                switch (this.initDir) {
                    case 0:
                        this.controlPointOffsetX = this.clockwise ? -this.radius : this.radius;
                        this.controlPointOffsetY = 0;
                        this.startAngle = this.clockwise ? 0 : 0;
                        this.endAngle = this.startAngle - 180;
                        this.straightDir = cc.p(0, -1);
                        this.straightDirReverse = cc.p(0, 1);
                        break;
                    case 1:
                        this.controlPointOffsetX = this.clockwise ? this.radius : -this.radius;
                        this.controlPointOffsetY = 0;
                        this.startAngle = this.clockwise ? 180 : 180;
                        this.endAngle = this.startAngle - 180;
                        this.straightDir = cc.p(0, 1);
                        this.straightDirReverse = cc.p(0, -1);
                        break;
                    case 2:
                        this.controlPointOffsetX = 0;
                        this.controlPointOffsetY = this.clockwise ? -this.radius : this.radius;
                        this.startAngle = this.clockwise ? 90 : -90;
                        this.endAngle = this.startAngle - 180;
                        this.straightDir = cc.p(1, 0);
                        this.straightDirReverse = cc.p(-1, 0);
                        break;
                    case 3:
                        this.controlPointOffsetX = 0;
                        this.controlPointOffsetY = this.clockwise ? this.radius : -this.radius;
                        this.startAngle = this.clockwise ? -90 : 90;
                        this.endAngle = this.startAngle - 180;
                        this.straightDir = cc.p(-1, 0);
                        this.straightDirReverse = cc.p(1, 0);
                        break;
                    default:
                        break;
                }
                break;
            }
            case SW_MOVETYPE.MOVETYPE_CUTTLESTYLE:
            {
                var cd = (this.moveData.moveData);
                this.speedup = true;
                this.speedCittle = cd.originalSpeed;
                this.acceleration = cd.acceleration;
                this.minusAcceleration = 0 - cd.minusAcceleration;
                this.speedUpFrameStart = cd.speedUpFrameStart;
                this.speedUpFrameEnd = cd.speedUpFrameEnd;
                this.speedDownFrameStart = cd.speedDownFrameStart;
                this.speedDownFrameEnd = cd.speedDownFrameEnd;
                this.setPosition(this.moveData.initPosition);
                this.cuttleDirVec = cc.pNormalize(cc.pSub(cd.endPosition, this.position));
                this.cuttleEndPosition = cd.endPosition;
                this.cuttleStartPosition = cd.startPosition;
                this.cuttleEndDistance = cc.pDistance(this.position, this.cuttleEndPosition);
                break;
            }
            case SW_MOVETYPE.MOVETYPE_BEZIERAT:
            {
                if (this.isCompages) {
                    var ar = ((this.moveData.moveData)).datas;
                    var db = (ar[this.comagesId]).moveData;
                    var sd = db;
                    this.setPosition(sd.startPosition);
                    this.startPosition_ = this.position;
                    this.bc.controlPoint_1 = sd.controlPoint;
                    this.bc.controlPoint_2 = sd.controlPoint2;
                    this.bc.controlPoint_3 = sd.controlPoint3;
                    this.bc.controlPoint_4 = sd.controlPoint4;
                    this.bc.endPosition = sd.endPosition;
                    this.bezieratTime_total = sd.time;
                }
                else {
                    var sd = (this.moveData.moveData);
                    this.setPosition(this.moveData.initPosition);
                    this.startPosition_ = this.position;
                    this.bc.controlPoint_1 = sd.controlPoint;
                    this.bc.controlPoint_2 = sd.controlPoint2;
                    this.bc.controlPoint_3 = sd.controlPoint3;
                    this.bc.controlPoint_4 = sd.controlPoint4;
                    this.bc.endPosition = sd.endPosition;
                    this.bezieratTime_total = sd.time;
                }
                break;
            }
            case SW_MOVETYPE.MOVETYPE_COMPAGES:
                this.setPosition(this.moveData.initPosition);
                this.isCompages = true;
                break;
            case SW_MOVETYPE.MOVETYPE_RETURN:
                break;
        }
    },

    runStraightNormalLogic:function (dt) {
        this.runStraight(dt, this.straightDirVec);
    },
    runStraight:function (dt, dirVec) {
        var nextStep;
        nextStep = cc.pAdd(this.position, cc.p(this.speed * this.speedScale * dt * dirVec.x, this.speed * this.speedScale * dt * dirVec.y));
        var Dir = cc.pSub(nextStep, this.position);
        Dir = cc.pNormalize(Dir);
        //    var ang = atan2f(Dir.x, Dir.y) + M_PI/2;
        //    this.handleActorRotation(ang/M_PI*180.0f);
        this.handleActorRotation(Dir);

        var destDistance = this.straightEndDistance;
        var curDistance = cc.pDistance(nextStep, this.straightStartPosition);

        if (curDistance >= destDistance && this.curMoveType == SW_MOVETYPE.MOVETYPE_STRAIGHT) {
            this.setPosition(this.straightEndPosition);
        }
        else {
            this.setPosition(nextStep);
        }
    },
    handleActorRotation:function (angleOrDir) {
        if (angleOrDir.y != null) {
            this.forwardDir = angleOrDir;
            var ang = Math.atan2(angleOrDir.x, angleOrDir.y) + Math.PI / 2;
            this.handleActorRotation(ang / Math.PI * 180.0);
            this.setRotation(ang / Math.PI * 180.0);
        }
        else {
            this.setRotation(angleOrDir);
        }
    },
    runEllipseNormalLogic:function (dt) {
        var right = this.beRightDir;
        var controlradius = this.getControlRadius(this.controlIndex);
        if (this.topRotationAngle >= 180) {
            this.topRotationAngle = 0;
            this.onTheRrc = false;
            var tmppoint = this.getControlRadius(this.controlIndex);
            this.controlIndex++;
            controlradius = this.getControlRadius(this.controlIndex);
            right ?
                (this.controlPoint.x += (controlradius.x + tmppoint.x) )
                : (this.controlPoint.x -= (controlradius.x + tmppoint.x));
        }
        if (this.bottomRotationAngle <= 180) {
            this.bottomRotationAngle = 360;
            this.onTheRrc = true;
            var tmppoint = this.getControlRadius(this.controlIndex);
            this.controlIndex++;
            controlradius = this.getControlRadius(this.controlIndex);
            right ?
                (this.controlPoint.x += (controlradius.x + tmppoint.x) )
                : (this.controlPoint.x -= (controlradius.x + tmppoint.x) );
        }
        var l = this.getEllipsePerimeter(controlradius.x, controlradius.y);
        if (this.onTheRrc)
            this.topRotationAngle += (this.speed * this.speedScale * 180) * dt / (l / 2);
        else
            this.bottomRotationAngle -= (this.speed * this.speedScale * 180) * dt / (l / 2);

        if (this.topRotationAngle >= 180) {
            this.topRotationAngle = 180;
        }
        if (this.bottomRotationAngle <= 180) {
            this.bottomRotationAngle = 180;
        }

        var angle = this.onTheRrc ? this.topRotationAngle / 180.0 * Math.PI : this.bottomRotationAngle / 180.0 * Math.PI;
        var nextStep;
        right ? (nextStep = cc.p(this.controlPoint.x - controlradius.x * Math.cos(angle), this.controlPoint.y + controlradius.y * Math.sin(angle)) )
            : (nextStep = cc.p(this.controlPoint.x + controlradius.x * Math.cos(angle), this.controlPoint.y + controlradius.y * Math.sin(angle)) );
        var Dir = cc.pSub(nextStep, this.position);
        Dir = cc.pNormalize(Dir);
        this.handleActorRotation(Dir);
        this.setPosition(nextStep);
    },
    runUTypeNormalLogic:function (dt) {
        switch (this.uTypeStep) {
            case 0:
                this.runStraight(dt, this.straightDir);
                if (this.checkUTypeCondition(((this.moveData.moveData)).initDir)) {
                    this.uTypeStep++;
                    this.wheelAngle = this.startAngle;

                    this.controlPoint.x = this.position.x + this.controlPointOffsetX;
                    this.controlPoint.y = this.position.y + this.controlPointOffsetY;
                    //                clockwise?([self playSWAction:MOVE_RIGHT]):([self playSWAction:MOVE_LEFT]);
                    this.playAction(0);
                }
                break;
            case 1:
            {
                var l = this.getEllipsePerimeter(this.radius, this.radius);
                this.wheelAngle -= (this.speed /** speedScale */ * 180.0) * dt / l;
                var angle = this.wheelAngle / 180.0 * Math.PI;

                var nextStep = this.position;

                if (this.clockwise)
                    nextStep = cc.p(this.controlPoint.x + (this.radius + this.offset.x) * Math.cos(angle), this.controlPoint.y + (this.radius + this.offset.x) * Math.sin(angle));
                else
                    nextStep = cc.p(this.controlPoint.x - (this.radius + this.offset.x) * Math.cos(angle), this.controlPoint.y + (this.radius + this.offset.x) * Math.sin(angle));


                var Dir = cc.pSub(nextStep, this.position);
                Dir = cc.pNormalize(Dir);
                this.handleActorRotation(Dir);
                this.setPosition(nextStep);
                if (this.wheelAngle < this.endAngle) {

                    this.playAction(0);
                    this.uTypeStep++;
                }

                break;
            }
            case 2:
                this.runStraight(dt, this.straightDirReverse);
                break;
            default:
                break;
        }
    },
    checkUTypeCondition:function (dir) {
        switch (dir) {
            case 0:
                if (this.position.y <= this.moveData.moveData.straightDistance) {
                    return true;
                }
                break;
            case 1:
                if (this.position.y >= this.moveData.moveData.straightDistance) {
                    return true;
                }
                break;
            case 2:
                if (this.position.x >= this.moveData.moveData.straightDistance) {
                    return true;
                }
                break;
            case 3:
                if (this.position.x <= this.moveData.moveData.straightDistance) {
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    },
    runCuttleStyleLogic:function (dt) {
        var nextStep;
        if (this.getSequenceIndex() >= this.speedUpFrameStart && this.getSequenceIndex() < this.speedUpFrameEnd) {

            this.acceleration -= this.acceleration * dt;
            var speedIncrement = this.acceleration * dt;


            nextStep = cc.pAdd(this.position, cc.p((this.speedCittle += speedIncrement) * dt * this.cuttleDirVec.x, (this.speedCittle += speedIncrement) * dt * this.cuttleDirVec.y));
            var Dir = cc.pSub(nextStep, this.position);
            Dir = cc.pNormalize(Dir);
            //        var ang = atan2f(Dir.x, Dir.y) + M_PI/2;
            //        this.handleActorRotation(ang/M_PI*180.0f);
            this.handleActorRotation(Dir);
        }
        else {
            this.setUpdatebySelf(false);
            this.setFrame(this.speedUpFrameEnd);
            var speedIncrement = this.minusAcceleration * dt;

            nextStep = cc.pAdd(this.position, cc.p((this.speedCittle += speedIncrement) * dt * this.cuttleDirVec.x, (this.speedCittle += speedIncrement) * dt * this.cuttleDirVec.y));
            var Dir = cc.pSub(nextStep, this.position);
            Dir = cc.pNormalize(Dir);
            this.handleActorRotation(Dir);
            if (this.speedCittle <= (this.moveData.moveData).originalSpeed) {
                this.setFrame(0);
                this.setUpdatebySelf(true);
                this.acceleration = (this.moveData.moveData).acceleration;
            }
        }

        var destDistance = this.cuttleEndDistance;
        var curDistance = cc.pDistance(nextStep, this.cuttleStartPosition);
        if (curDistance >= destDistance) {
            this.setPosition(this.cuttleEndPosition);

        }
        else {
            this.setPosition(nextStep);
        }
    },
    runCompagesLogic:function (dt) {
        var ar = this.moveData.moveData.datas;
        if (this.comagesId >= ar.count()) {

            return;
        }
        var db = ar[this.comagesId].moveData;
        this.curMoveType = db.moveType;
        this.usingTransition = false;
        if ((this.comagesId - 1) >= 0) {
            var dbPrev = ar[this.comagesId - 1].moveData;
            var transitionalAction = this.obtianTransitionalAction(dbPrev.action, db.action);
            if (transitionalAction != -1) {
                this.playAction(transitionalAction);
                this.compagesActionAfterTransition = db.action;
                this.usingTransition = true;
            }
            else {
                this.usingTransition = false;
            }
        }

        this.unwindMoveData();
        this.comagesId++;
    },
    obtianTransitionalAction:function (prevAction, nextAction) {
        return 0;
    },
    runBezierLogic:function (dt) {
        this.bezieratTime += dt;

        var xa = this.startPosition_.x;
        var xb = this.bc.controlPoint_1.x;
        var xc = this.bc.controlPoint_2.x;
        var xd = this.bc.controlPoint_3.x;
        var xe = this.bc.controlPoint_4.x;
        var xf = this.bc.endPosition.x;

        var ya = this.startPosition_.y;
        var yb = this.bc.controlPoint_1.y;
        var yc = this.bc.controlPoint_2.y;
        var yd = this.bc.controlPoint_3.y;
        var ye = this.bc.controlPoint_4.y;
        var yf = this.bc.endPosition.y;


        var pT;
        pT = this.bezieratTime / this.bezieratTime_total;


        var x = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, pT);
        var y = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, pT);

        var npT = (this.bezieratTime + dt) / this.bezieratTime_total;

        var nx = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, npT);
        var ny = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, npT);
        if (!((this.bezieratTime + dt) / this.bezieratTime_total >= 1)) {
            var np = cc.p(nx, ny);
            var Dir = cc.pSub(np, this.position);
            Dir = cc.pNormalize(Dir);
            this.handleActorRotation(Dir);
        }
        this.setPosition(cc.p(x, y));
    },
    obtainBezierat:function (a, b, c, d, t) {
        return (Math.pow(1 - t, 3) * a +
            3 * t * (Math.pow(1 - t, 2)) * b +
            3 * Math.pow(t, 2) * (1 - t) * c +
            Math.pow(t, 3) * d );
    },
    obtainBezierat5:function (a, b, c, d, e, f, t) {
        return (
            Math.pow(1 - t, 5) * a + 5 * t * (Math.pow(1 - t, 4)) * b + 10 * Math.pow(t, 2) * (Math.pow(1 - t, 3)) * c + 10 * Math.pow(t, 3) * (Math.pow(1 - t, 2)) * d + 5 * Math.pow(t, 4) * (1 - t) * e + Math.pow(t, 5) * f
            );
    },
    checkMoveEnd:function () {
        if (this.runningAway) {
            if (this.runAway_bezieratTime / this.runAwayData.time >= 1) {
                this.afterRunAway = true;
                this.runningAway = false;
                if (this.outOfScreen()) {
                    this.removeSelfFromScene();
                    return;
                }
                var endpo = this.position;
                var ep = this.runAwayData.endPosition;
                if (!this.runWithGroup)
                    this.createMoveDataAfterRunAway();
            }
            return;
        }
        switch (this.curMoveType) {
            case SW_MOVETYPE.MOVETYPE_STRAIGHT:
                if (cc.pDistance(this.position, this.straightStartPosition) >= this.straightEndDistance) {
                    if (!this.isCompages) {
                        this.removeSelfFromScene();
                    }
                    else {
                        this.curMoveType = SW_MOVETYPE.MOVETYPE_COMPAGES;
                        if (this.comagesId >= this.moveData.moveData.datas.length) {
                            this.removeSelfFromScene();
                            return;
                        }
                    }
                }
                break;
            case SW_MOVETYPE.MOVETYPE_BEZIERAT:

                if (this.bezieratTime / this.bezieratTime_total >= 1) {
                    this.bezieratTime = 0;
                    if (this.isCompages) {
                        this.curMoveType = SW_MOVETYPE.MOVETYPE_COMPAGES;
                        if (this.comagesId >= this.moveData.moveData.datas.length) {
                            //                        this.removeSelfFromScene();
                            this.removeSelfFromScene();

                            return;
                        }
                    }
                    else {
                        this.removeSelfFromScene();
                    }
                }

                break;
            case SW_MOVETYPE.MOVETYPE_RETURN:
                break;
            case SW_MOVETYPE.MOVETYPE_CUTTLESTYLE:
                if (cc.pDistance(this.position, this.cuttleStartPosition) >= this.cuttleEndDistance) {
                    this.removeSelfFromScene();
                }
                break;
            default:
                break;
        }
    },
    beScared:function () {
        switch (this._fishLevel) {
            case FishLevel.eFishLevel1:
            case FishLevel.eFishLevel2:
            case FishLevel.eFishLevel3:
            case FishLevel.eFishLevel4:
                break;
            case FishLevel.eFishLevel5:
            case FishLevel.eFishLevel6:
            case FishLevel.eFishLevel7:
            case FishLevel.eFishLevel8:
            case FishLevel.eFishLevel9:
            case FishLevel.eFishLevel10:
            case FishLevel.eFishLevel11:
            case FishLevel.eFishLevel12:
            case FishLevel.eFishLevel13:
                if (0 | (Math.random() * 10) == 0) {
                    this.runAway();
                }
                break;

            default:
                break;
        }
    },
    runAway:function () {
        if (this.runningAway) {
            return;
        }
        this.runningAway = true;
        this.createRunAwayMoveData();
    },
    runAwayGroup:function (data) {
        if (this.runningAway) {
            return;
        }
        this.runningAway = true;
        this.createRunAwayGroupMoveData(data);
    },
    handleRunAway:function (dt) {
        this.runAway_bezieratTime += dt;

        var xa = this.runAwayData.startPosition.x;
        var xb = this.runAwayData.controlPoint.x;
        var xc = this.runAwayData.controlPoint2.x;
        var xd = this.runAwayData.controlPoint3.x;
        var xe = this.runAwayData.controlPoint4.x;
        var xf = this.runAwayData.endPosition.x;

        var ya = this.runAwayData.startPosition.y;
        var yb = this.runAwayData.controlPoint.y;
        var yc = this.runAwayData.controlPoint2.y;
        var yd = this.runAwayData.controlPoint3.y;
        var ye = this.runAwayData.controlPoint4.y;
        var yf = this.runAwayData.endPosition.y;


        var pT;
        pT = this.runAway_bezieratTime / this.runAwayData.time;


        var x = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, pT);
        var y = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, pT);

        var npT = (this.runAway_bezieratTime + dt) / this.runAwayData.time;

        var nx = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, npT);
        var ny = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, npT);
        if (!((this.runAway_bezieratTime + dt) / this.runAwayData.time >= 1)) {
            var np = cc.p(nx, ny);
            var Dir = cc.pSub(np, this.position);
            Dir = cc.pNormalize(Dir);
            this.handleActorRotation(Dir);
        }
        this.setPosition(cc.p(x, y));
    },
    createRunAwayMoveData:function (data) {
        this.runAwayData = new MoveDataBezier();

        switch (this.inWitchArea()) {
            case 0:
                switch (this.getForwardDir()) {
                    case 0:
                    case 2:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 512, 768 + 80 + Math.random() * 512);
                        this.runAwayData.controlPoint = cc.p(Math.random() * this.position.x, this.position.y + Math.random() * (768 - this.position.y));
                        this.runAwayData.controlPoint2 = cc.p(Math.random() * 512, this.position.y + Math.random() * (768 - this.position.y));
                        this.runAwayData.controlPoint3 = cc.p(-512 + Math.random() * 1024, this.position.y + Math.random() * (768 - this.position.y));
                        this.runAwayData.controlPoint4 = this.runAwayData.controlPoint3;
                        break;
                    case 1:
                    case 3:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(512 + Math.random() * 512, 768 + 80 + Math.random() * 768);
                        this.runAwayData.controlPoint = cc.p(this.position.x + Math.random() * (1024 - this.position.x), Math.random() * 768);
                        this.runAwayData.controlPoint2 = cc.p(this.runAwayData.controlPoint.x, Math.random() * 768);
                        this.runAwayData.controlPoint3 = cc.p(Math.random() * 1024, Math.random() * 768);
                        this.runAwayData.controlPoint4 = cc.p(Math.random() * 1024, Math.random() * 768);
                        break;
                    default:
                        break;
                }
                break;
            case 1:
                switch (this.getForwardDir()) {
                    case 0:
                    case 2:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 512, 768 + 80 + Math.random() * 768);
                        this.runAwayData.controlPoint = cc.p(Math.random() * (0 | (this.position.x)), Math.random() * 768);
                        this.runAwayData.controlPoint2 = cc.p(Math.random() * (0 | (this.position.x)), Math.random() * 768);
                        this.runAwayData.controlPoint3 = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), Math.random() * 768);
                        this.runAwayData.controlPoint4 = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), Math.random() * 768);
                        break;
                    case 1:
                    case 3:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(512 + Math.random() * 512, 768 + 80 + Math.random() * 512);
                        this.runAwayData.controlPoint = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), this.position.y + Math.random() * (0 | (768 - this.position.y)));
                        this.runAwayData.controlPoint2 = this.runAwayData.controlPoint;
                        this.runAwayData.controlPoint3 = cc.p(position.x + Math.random() * (0 | (1024 - position.x)), this.position.y + Math.random() * (0 | (768 - position.y)));
                        this.runAwayData.controlPoint4 = cc.p(position.x + Math.random() * (0 | (1024 - position.x)), this.position.y + Math.random() * (0 | (768 - position.y)));
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                switch (this.getForwardDir()) {
                    case 0:
                    case 2:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 1024, 768 + 80 + Math.random() * 384);
                        this.runAwayData.controlPoint = cc.p(Math.random() * (0 | (this.position.x)), this.position.y + Math.random() * (0 | (768 - this.position.y)));
                        this.runAwayData.controlPoint2 = this.runAwayData.controlPoint;
                        this.runAwayData.controlPoint3 = cc.p(Math.random() * 1024, this.runAwayData.controlPoint2.y + Math.random() * (0 | (768 - this.runAwayData.controlPoint2.y)));
                        this.runAwayData.controlPoint4 = this.runAwayData.controlPoint3;
                        break;
                    case 1:
                    case 3:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 1024, 768 + 80 + Math.random() * 384);
                        this.runAwayData.controlPoint = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), this.position.y + Math.random() * (0 | (768 - this.position.y)));
                        this.runAwayData.controlPoint2 = this.runAwayData.controlPoint;
                        this.runAwayData.controlPoint3 = cc.p(Math.random() * 1024, this.runAwayData.controlPoint2.y + Math.random() * (0 | (768 - this.runAwayData.controlPoint2.y)));
                        this.runAwayData.controlPoint4 = this.runAwayData.controlPoint3;
                        break;
                    default:
                        break;
                }
                break;
            case 3:
                switch (this.getForwardDir()) {
                    case 0:
                    case 2:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 1024, 768 + 80 + Math.random() * 384);
                        this.runAwayData.controlPoint = cc.p(Math.random() * (0 | (this.position.x)), this.position.y + Math.random() * (0 | (768 - this.position.y)));
                        this.runAwayData.controlPoint2 = this.runAwayData.controlPoint;
                        this.runAwayData.controlPoint3 = cc.p(Math.random() * 1024, this.runAwayData.controlPoint2.y + Math.random() * (0 | (768 - this.runAwayData.controlPoint2.y)));
                        this.runAwayData.controlPoint4 = this.runAwayData.controlPoint3;
                        break;
                    case 1:
                    case 3:
                        this.runAwayData.time = 3.0;
                        this.runAwayData.startPosition = this.position;
                        this.runAwayData.endPosition = cc.p(Math.random() * 1024, 768 + 80 + Math.random() * 384);
                        this.runAwayData.controlPoint = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), this.position.y + Math.random() * (0 | (768 - this.position.y)));
                        this.runAwayData.controlPoint2 = this.runAwayData.controlPoint;
                        this.runAwayData.controlPoint3 = cc.p(Math.random() * 1024, this.runAwayData.controlPoint2.y + Math.random() * (0 | (768 - this.runAwayData.controlPoint2.y)));
                        this.runAwayData.controlPoint4 = this.runAwayData.controlPoint3;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    },
    inWitchArea:function () {
        if (this.position.x <= 512 && this.position.y >= 384) {
            return 0;
        }
        else if (this.position.x > 512 && this.position.y >= 384) {
            return 1;
        }
        else if (this.position.x <= 512 && this.position.y < 384) {
            return 2;
        }
        else {
            return 3;
        }
    },
    getForwardDir:function () {
        var dirX = this.forwardDir.x;
        var dirY = this.forwardDir.y;
        var compareValue = 0;
        if (dirX < compareValue && dirY > compareValue) {
            return 0;
        }
        else if (dirX > compareValue && dirY > compareValue) {
            return 1;
        }
        else if (dirX < compareValue && dirY < compareValue) {
            return 2;
        }
        else {
            return 3;
        }
    },
    outOfScreen:function () {
        var halfSize = this.getSize();
        halfSize.width /= 2;
        halfSize.height /= 2;
        return (this.position.x > VisibleRect.right().x + halfSize.width || this.position.x < VisibleRect.left().x - halfSize.width ||
        this.position.y > VisibleRect.top().y + halfSize.height || this.position.y < VisibleRect.bottom().y - halfSize.height);
    },

    createMoveDataAfterRunAway:function () {
        this.afterRunAwayData = new MoveDataBezier();
        switch (this.getForwardDir()) {
            case 0:
            case 2:
                this.afterRunAwayData.time = 9;
                this.afterRunAwayData.startPosition = this.position;
                this.afterRunAwayData.endPosition = cc.p(-512 + Math.random() * 256, Math.rand() * 768);
                this.afterRunAwayData.controlPoint = cc.p(Math.random() * (0 | (this.position.x)), Math.random() * 768);
                this.afterRunAwayData.controlPoint2 = this.afterRunAwayData.controlPoint;
                this.afterRunAwayData.controlPoint3 = cc.p(Math.random() * (0 | (this.afterRunAwayData.controlPoint2.x)), Math.random() * 768);
                this.afterRunAwayData.controlPoint4 = this.afterRunAwayData.controlPoint3;
                break;
            case 1:
            case 3:
                this.afterRunAwayData.time = 9;
                this.afterRunAwayData.startPosition = this.position;
                this.afterRunAwayData.endPosition = cc.p(1024 + Math.random() * 256, Math.random() * 768);
                this.afterRunAwayData.controlPoint = cc.p(this.position.x + Math.random() * (0 | (1024 - this.position.x)), Math.random() * 768);
                this.afterRunAwayData.controlPoint2 = this.afterRunAwayData.controlPoint;
                this.afterRunAwayData.controlPoint3 = cc.p(this.afterRunAwayData.controlPoint2.x + Math.random() * (0 | (1024 - this.afterRunAwayData.controlPoint2.x)), Math.random() * 768);
                this.afterRunAwayData.controlPoint4 = this.afterRunAwayData.controlPoint3;
                break;
            default:
                break;
        }
    },
    cloneSimilarMoveData:function (data) {
        this.afterRunAwayData = new MoveDataBezier();
        this.afterRunAwayData.time = data.time * 2 / 3;
        this.afterRunAwayData.startPosition = this.position;
        this.afterRunAwayData.endPosition = data.endPosition;
        this.afterRunAwayData.controlPoint = data.controlPoint;
        this.afterRunAwayData.controlPoint2 = data.controlPoint2;
        this.afterRunAwayData.controlPoint3 = data.controlPoint3;
        this.afterRunAwayData.controlPoint4 = data.controlPoint4;
    },
    handleAfterRunAway:function (dt) {
        this.afterRunAway_bezieratTime += dt;

        var xa = this.afterRunAwayData.startPosition.x;
        var xb = this.afterRunAwayData.controlPoint.x;
        var xc = this.afterRunAwayData.controlPoint2.x;
        var xd = this.afterRunAwayData.controlPoint3.x;
        var xe = this.afterRunAwayData.controlPoint4.x;
        var xf = this.afterRunAwayData.endPosition.x;

        var ya = this.afterRunAwayData.startPosition.y;
        var yb = this.afterRunAwayData.controlPoint.y;
        var yc = this.afterRunAwayData.controlPoint2.y;
        var yd = this.afterRunAwayData.controlPoint3.y;
        var ye = this.afterRunAwayData.controlPoint4.y;
        var yf = this.afterRunAwayData.endPosition.y;


        var pT;
        pT = this.afterRunAway_bezieratTime / this.afterRunAwayData.time;


        var x = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, pT);
        var y = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, pT);

        var npT = (this.afterRunAway_bezieratTime + dt) / this.afterRunAwayData.time;

        var nx = this.obtainBezierat5(xa, xb, xc, xd, xe, xf, npT);
        var ny = this.obtainBezierat5(ya, yb, yc, yd, ye, yf, npT);
        if (!((this.afterRunAway_bezieratTime + dt) / this.afterRunAwayData.time >= 1)) {
            var np = cc.p(nx, ny);
            var Dir = cc.pSub(np, this.position);
            Dir = cc.pNormalize(Dir);
            this.handleActorRotation(Dir);
        }
        this.setPosition(cc.p(x, y));
    },

    getFishActorName:function () {
        return this.fishActorName
    },
    setFishActorName:function (name) {
        this.fishActorName = name
    },

    bPulled:false,
    getIsPulled:function () {
        return this.bPulled
    },
    setIsPulled:function (bPulled) {
        this.bPulled = bPulled
    },
    grapedByFishNet:function (netActor) {
        this.playAction(1);
        this.setActorType(netActor.getActorType());
        if (netActor.getActorType() == ActorType.eActorTypeNormal) {
            var curScene = this.getScene();
            if (curScene.getGameCenterGCHelper()) {
                netActor.setActorType(ActorType.eActorTypeTR);
            }
        }

        switch (netActor.getActorType()) {
            case ActorType.eActorTypeTL:
                if (this.getIsChangeColor()) {
                    /*CCParticleSystem *baoixangParticle=[CCParticleSystemQuad particleWithFile:@"bianbaoxiangl03.plist"];*/
                }

                PlayerActor.sharedActorTL().updateCatchMoney(this.prizeScore, true, true, false);
                //
                PlayerActor.sharedActorTL().catchFish(this.getDef());
                var curScene = this.getScene();
                break;
            case ActorType.eActorTypeTR:
            {
                if (this.getIsChangeColor()) {
                    var baoixangParticle = particleSystemFactory.createParticle(ImageName("bianbaoxiangl03.plist"));
                }

                PlayerActor.sharedActorTR().updateCatchMoney(this.prizeScore, true, true, false);
                PlayerActor.sharedActorTR().catchFish(this.getDef());
                var curScene = this.getScene();

            }
                break;
            case ActorType.eActorTypeBL:

                break;

            case ActorType.eActorTypeBR:

                break;

            case ActorType.eActorTypeNormal:
            {
                var playerActor = PlayerActor.sharedActor();
                if (playerActor.getAutoSave()) {
                    if (this.getIsChangeColor()) {
                        var baoixangParticle = particleSystemFactory.createParticle(ImageName("bianbaoxiangl03.plist"));
                        baoixangParticle.setPosition(this.getPosition());
                        this.getScene().addChild(baoixangParticle);

                        this.getScene().getChestGameLayer().addMinChest(this.ChestFishID, this.getPosition());//TODO Chest game layer
                    }
                    if (netActor.getFishNetSource() == FishNetSource.eFishNetSourcePrize) {
                        playerActor.updateCatchMoney(this.prizeScore, false, false, true);
                    }
                    else {
                        playerActor.updateCatchMoney(this.prizeScore, false, true, true);
                    }
                    if (playerActor.canLevelUp()) {
                        playerActor.setPlayerLevel(playerActor.getPlayerLevel() + 1);

                        this.getScene().levelUp();
                    }

                    if (this.getFishActorType() == FISH.Shark) //@todo 需要验证鲨鱼的子类只有这个
                    {
                        if (playerActor.getAutoSave()) {
                            playerActor.setCatchSharkWithRay(true);
                            playerActor.submitAchievement(0);
                        }
                    }

                    playerActor.catchFish(this.getDef(), this.getShootFlag());
                }

            }
                break;
            default:
                break;
        }

        this.setActionDidStopSelector(this.actionAfterArrested, this);
        this._isAlive = false;
    },

    _shootFlag:null,
    getShootFlag:function () {
        return this._shootFlag
    },
    setShootFlag:function (shootFlag) {
        this._shootFlag = shootFlag
    },
    handleCollideBulletActor:function (target) {
    },
    createRunAwayGroupMoveData:function (data) {
        this.runAwayData = new MoveDataBezier();
        this.runAwayData.time = 3.0;
        this.runAwayData.startPosition = this.position;
        this.runAwayData.endPosition = data.endPosition;
        this.runAwayData.controlPoint = data.controlPoint;
        this.runAwayData.controlPoint2 = data.controlPoint2;
        this.runAwayData.controlPoint3 = data.controlPoint3;
        this.runAwayData.controlPoint4 = data.controlPoint4;
        var xPlus = Math.random() * 2;
        var yPlus = Math.random() * 2;
        this.runAwayData.controlPoint = cc.p((xPlus == 0) ? this.runAwayData.controlPoint.x + Math.random() * 100 : this.runAwayData.controlPoint.x - Math.random() * 100, (yPlus == 0) ? this.runAwayData.controlPoint.y - Math.random() * 100 : this.runAwayData.controlPoint.y + Math.random() * 100);
        this.runAwayData.controlPoint2 = cc.p((xPlus == 0) ? this.runAwayData.controlPoint2.x + Math.random() * 100 : this.runAwayData.controlPoint2.x - Math.random() * 100, (yPlus == 0) ? this.runAwayData.controlPoint2.y - Math.random() * 100 : this.runAwayData.controlPoint2.y + Math.random() * 100);
        this.runAwayData.controlPoint3 = cc.p((xPlus == 0) ? this.runAwayData.controlPoint3.x + Math.random() * 100 : this.runAwayData.controlPoint3.x - Math.random() * 100, (yPlus == 0) ? this.runAwayData.controlPoint3.y - Math.random() * 100 : this.runAwayData.controlPoint3.y + Math.random() * 100);
        this.runAwayData.controlPoint4 = cc.p((xPlus == 0) ? this.runAwayData.controlPoint4.x + Math.random() * 100 : this.runAwayData.controlPoint4.x - Math.random() * 100, (yPlus == 0) ? this.runAwayData.controlPoint4.y - Math.random() * 100 : this.runAwayData.controlPoint4.y + Math.random() * 100);

        var tPlus = Math.random() * 2;
        var pTime = this.runAwayData.time;
        this.runAwayData.time = (tPlus == 0) ? data.time + (Math.random() * 10) / 10.0 : data.time - ((Math.random() * 10)) / 10.0;
        if (this.runAwayData.time <= 0) {
            this.runAwayData.time = pTime;
        }
    },
    addJinDunAnimation:function (val, number, type) {
        var frameCache = cc.spriteFrameCache;
        frameCache.addSpriteFrames(res.JindunPlist);
        var str = "#jindun_" + number + "_01.png";
        var coin = new cc.Sprite(str);
        this.getScene().addChild(coin);
        coin.setPosition(val);
        var frames = [];
        for (var i = 1; i <= 4; ++i) {
            str = "jindun_" + number + "_0" + i + ".png";
            frames.push(frameCache.getSpriteFrame(str));
        }
        var animation = cc.animation(frames, 0.1);
        var ac = cc.animate(animation);
        ac = cc.repeat(ac, 3);
        var last = cc.callFunc(this.getScene().removeSprite, coin );
        coin.runAction(cc.sequence(ac, last, 0));

        switch (type) {
            case ActorType.eActorTypeBL:
                coin.setRotation(90);
                break;
            case ActorType.eActorTypeBR:
                coin.setRotation(90);
                break;
            case ActorType.eActorTypeTL:
                coin.setRotation(90);
                break;
            case ActorType.eActorTypeTR:
                coin.setRotation(270);
                break;
            case ActorType.eActorTypeNormal:
                coin.setRotation(0);
                break;
        }
    },

    getFinalRandom:function (netActor) {
        var gameSetting = GameSetting.getInstance();
        var fishRandom = gameSetting.getFishRandomArray()[this._fishLevel];
        if (this.getIsChangeColor()) {
            fishRandom *= this.CaptureRandom;
        }

        // 10级炮 捕鱼随机数暂时用7级代替
        var netActorCurWeaponLecel = 0;
        if (netActor.getCurWeaponLevel() == 10) {
            netActorCurWeaponLecel = 7;
        }
        else {
            netActorCurWeaponLecel = netActor.getCurWeaponLevel();
        }

        var naclUnit = function (that) {
            this.fish = that;
            this.netActor = netActor;
            this.index = naclFishIndex;
        };
        var tempUnit = new naclUnit(this);
        naclFishPool.push(tempUnit);
        (naclFishIndex > 100) ? (naclFishIndex = 0) : naclFishIndex++;
        finalRandomProcess(tempUnit.index, this._fishLevel, fishRandom, netActorCurWeaponLecel, this.getCurCollideIndex(),
            netActor.getCurRatio(), this.getScene().getOddsNumber(), PlayerActor.sharedActor().getPlayerMoney(),
            gameSetting.getExperienceRatio(), gameSetting.getPreReturnRatio());

        gameSetting.setBulletShootCount(gameSetting.getBulletShootCount() + 1);
    },

    curAttackState:AttackState.eAttackStateNone, //EAttackState
    stateChangeTime:0,
    speedScale:0,
    hitedRandom:0,
    speed:0,
    outSpeedScale:0,
    pathId:0,
    groupId:0,
    beginPoint:null, //ccpoint
    eMoveType:MoveType.eMoveByBeeline, //EMoveType
    controlPoints:null, //array of points
    controlValus:null, //Array
    offsetArray:null, //Array
    controlIndex:0,
    _passTime:null, //time
    time1:null, //time
    controlPoint:null, //point
    turningCount:0,
    topRotationAngle:0,
    bottomRotationAngle:360,
    circlesAngle:0,
    onTheRrc:false,
    wheelAngle:0,
    moveOut:false,

    fishSortLevel:null, //array
    fishActorName:"",
    fPullAngle:0,
    fPullDis:0,
    roundPos:null, //ccpoint
    _moveAngle:0,
    curMoveType:0, //SW_MOVETYPE

    isCompages:false,
    comagesId:0,

    straightDirVec:null, //ccpoint
    straightStartPosition:null, //ccpoint
    straightEndDistance:0,
    straightEndPosition:null, //ccpoint

    uTypeStep:0,
    initDir:0,
    clockwise:false,
    radius:0,
    controlPointOffsetX:0,
    controlPointOffsetY:0,
    straightDir:null, //ccpoint
    startAngle:0,
    endAngle:0,
    straightDirReverse:null, //ccpoint
    speedCittle:0,
    acceleration:0,
    deceleration:0,
    speedUpFrameStart:0,
    speedUpFrameEnd:0,
    speedDownFrameStart:0,
    speedDownFrameEnd:0,
    cuttleDirVec:null, //ccpoint
    cuttleEndPosition:null, //ccpoint
    cuttleEndDistance:0,
    cuttleStartPosition:null, //ccpoint
    speedup:false,
    startPosition_:null, //ccpoint
    bezierPointIdx:0,
    bezierPointMax:0,
    bezieratTime_total:0,
    bezieratTime:0,
    bc:null, //beziercnfig5
    usingTransition:false,
    compagesActionAfterTransition:0,

    groupInfo:null, //FishGroupInfoData
    moveData:null, //ActorTrackData
    tagInGroup:0,

    runningAway:false,
    hightLighting:false,
    poping:false,
    runWithGroup:false,

    runAwayData:null, //MoveDataBezier
    runAway_bezieratTime:0,
    forwardDir:null, //ccpoint

    afterRunAway:false,
    afterRunAwayData:null, //MoveDataBezier
    afterRunAway_bezieratTime:0
});


var LanternActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.LanternSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel3;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 73;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Lantern
    }
});

var SharkActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.SharkSprite, res.SharkPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel1;
            this._fishType = FishType.bigFish;
            this._collideRadius = 125;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Shark
    }
});

var PorgyActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.ProgySprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel5;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 32;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Porgy
    }
});

var AmphiprionActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.AmphiprionSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel7;
            this._fishType = FishType.smallFish;
            this._collideRadius = 30;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Amphiprion
    }
});

var PufferActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.PufferSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel8;
            this._fishType = FishType.balloonfish;
            this._collideRadius = 22;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Puffer
    }
});

var CroakerActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.CroakerSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel10;
            this._fishType = FishType.smallFish;
            this._collideRadius = 25;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Croaker
    }
});

var RayActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.RaySprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel2;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 60;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Ray
    }
});

var ChelonianActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.ChelonianSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel4;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 43;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Chelonian
    }
});

var BreamActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.BreamSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel6;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 40;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Bream
    }
});

var AngleFishActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.AngelfishSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel9;
            this._fishType = FishType.smallFish;
            this._collideRadius = 30;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.AngleFish
    }
});

var SmallFishActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.SmallFishActorSprite, res.FishPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel11;
            this._fishType = FishType.smallFish;
            this._collideRadius = 20;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.SmallFish
    }
});

var MarlinsFishActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.MarlinSprite, res.MarlinPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel12;
            this._fishType = FishType.bigFish;
            this._collideRadius = 125;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.MarlinsFish
    }
});

var GrouperFishActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.GrouperSprite, res.GrouperPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel13;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 32;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.GrouperFish
    }
});

var GSharkActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.GSharkSprite, res.GSharkPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel1;
            this._fishType = FishType.bigFish;
            this._collideRadius = 125;
        }
        this.setIsChangeColor(true);
        return bRet;
    },
    getFishActorType:function () {
        return FISH.GoldShark
    }
});

var GMarlinsFishActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.GMarlinSprite, res.GMarlinPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel12;
            this._fishType = FishType.bigFish;
            this._collideRadius = 125;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.GMarlinsFish
    }
});

var ButterflyActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.ButterflySprite, res.ButterflyPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel7;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 25;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.ButterFly
    }
});

var PomfretActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.PomfretSprite, res.ButterflyPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel9;
            this._fishType = FishType.smallFish;
            this._collideRadius = 22;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.Pomfret
    }
});

var GoldenTroutActor = BaseFishActor.extend({
    ctor:function (def_) {
        this._def = def_;
        var bRet = false;
        bRet = this._super(res.GoldenTroutSprite, res.GoldenTroutPng);
        if (bRet) {
            this._fishLevel = FishLevel.eFishLevel5;
            this._fishType = FishType.mediumFish;
            this._collideRadius = 32;
        }

        return bRet;
    },
    getFishActorType:function () {
        return FISH.GoldenTrout
    }
});


