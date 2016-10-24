var INIT_POS_Y_STEP = 80;//(IsTablet ? 80 : 20)

var GameMainSessionController = GameSessionController.extend({
    _prepareNextWave:false,
    _accTimer:0, //cctime
    _timeScale:0, //cctime
    _time:0, //cctime
    _curWaveTime:0,
    _waveDuration:0,
    _maxTime:0,
    _addStarTime:0,
    _FishFactoryMgr:null,
    _sessionRunning:false,
    updateStarFish:function (time) {
        var tmpArray = this._currentScene.getActors(GroupStarfishActor);
        for (var i = 0; i < tmpArray.length; i++) {
            var StarfishNode = tmpArray[i];
            StarfishNode.update(time);
        }

        var tmpArray1 = this._currentScene.getActors(GroupStarfishActor);
        for (var i = 0; i < tmpArray1.length; i++) {
            var StarfishNode = tmpArray1[i];
            var pActors = this._currentScene.getActors(GroupHeroBullet);
            for (var j = 0; j < pActors.length; j++) {
                var bullet = pActors[j];
                var levin = bullet instanceof LevinStormBulletActor;
                var ray = bullet instanceof RayBulletActor;
                if (ray || levin) {
                    continue;
                }

                if (bullet.collideWith(StarfishNode)) {
                    StarfishNode.DeleteStarfish();
                    var ray = bullet instanceof RayBulletActor;
                    if (ray) {
                        bullet.removeSelfFromScene();
                    }
                }
            }
        }
    },
    addFishGroup:function (startPos, delay) {
        // Don't do it!  We will only add fish to the scene when the server tells us to.
        return;

        if (!startPos || !delay) {
            var fishStartPosition = (cc.p(VisibleRect.right().x + 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2 + INIT_POS_Y_STEP));
            this.addFishGroup(fishStartPosition, 0.5);
            return true;
        }
        this._time = 0;
        //ActorFactory.loadStatus();
        this.addFishAtPosition(startPos);

        var scheduler = cc.director.getScheduler();
        scheduler.schedule(this.addSec, this, 0.2, false);
        scheduler.schedule(this.addThird, this, 0.3, false);
        scheduler.schedule(this.addFourth, this, 0.4, false);
        scheduler.schedule(this.addFifth, this, 0.5, false);
        scheduler.schedule(this.addSixth, this, delay, false);
    },
    addFishAtPosition:function (startPos) {
        var tempGameScene = this._currentScene;
        FishGroup.shareFishGroup().setInitPoint(startPos);
        FishGroup.shareFishGroup().createFishGroup(tempGameScene.getCurStage());
    },
    nextWave:function () {
        alert('next wave');
    },
    addSec:function (time) {
        cc.director.getScheduler().unschedule(this.addSec, this);
        var position = (cc.p(VisibleRect.right().x + 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2 - INIT_POS_Y_STEP));
        this.addFishAtPosition(position);
    },
    addThird:function (time) {
        cc.director.getScheduler().unschedule(this.addThird, this);
        var position = (cc.p(VisibleRect.left().x - 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2 + INIT_POS_Y_STEP));
        this.addFishAtPosition(position);
    },
    addFourth:function (time) {
        cc.director.getScheduler().unschedule(this.addFourth, this);
        var position = (cc.p(VisibleRect.left().x - 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2 - INIT_POS_Y_STEP));
        this.addFishAtPosition(position);
    },
    addFifth:function (time) {
        cc.director.getScheduler().unschedule(this.addFifth, this);
        var position = (cc.p(VisibleRect.right().x + 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2));
        this.addFishAtPosition(position);
    },
    addSixth:function (time) {
        cc.director.getScheduler().unschedule(this.addSixth, this);
        var position = (cc.p(VisibleRect.left().x - 5.0, Math.random() * 10 + VisibleRect.bottom().y + VisibleRect.rect().height / 2));
        this.addFishAtPosition(position);
    },
    getSessionType:function () {
        return eSessionType.GameMain;
    },
    initWithDelegate:function (delegate, scene) {
        this._delegate = delegate;
        this._currentScene = scene;
        this._addStarTime = 0;
        this._timeScale = 1;
        this.init();
        return true;
    },
    init:function () {
        this._prepareNextWave = false;
        this._maxTime = GameSetting.getInstance().getAddGroupInterval();
        this._time = this._maxTime;
        this._curWaveTime = 0;
        this._accTimer = 0;
        this._waveDuration = GameSetting.getInstance().getChangeBgTimeInterval();
        this._waveDuration = 300;//5 mins = 300
        /*        if (SceneSettingDataModel.sharedSceneSettingDataModel().getCanUseNewPath()) {
         this._FishFactoryMgr = FishFactoryManager.shareFishFactoryManager();
         }*/
        return true;
    },
    update:function (dt) {
        if (GameCtrl.isOnlineGame()) {
            if (GameCtrl.sharedGame().getArena()) {
                GameCtrl.sharedGame().getArena().updateEverything();
            }

            var gameScene = GameCtrl.sharedGame().getCurScene();
            this.updateBullets(dt, gameScene.getActors(GroupHeroBullet), []);
            this.updateBullets(dt, gameScene.getActors(GroupEnemyBullet), []);

            // This fires pending bullets by shifting them from the _shootPosList
            this.updateBullets(dt);

            return;
        }

        if (this._sessionRunning) {
            this.updateAllActors(dt);
            this.updateStarFish(dt);
            var groupFishActor = this._currentScene.getActors(GroupFishActor);
            var noFishExistOnScreen = !(groupFishActor.length);
            if (this._prepareNextWave && noFishExistOnScreen) {
                var tempGameScene = this._currentScene;
                tempGameScene.nextWave();
                this.endSession();
            }
            if (/*can use new path*/false) {
                //m_pFishFactoryMgr.refresh(time);
            }
            else {
                if (this._prepareNextWave) {
                    if (!noFishExistOnScreen) {
                        this._accTimer += dt;
                        if (this._accTimer >= 2) {
                            this._accTimer -= 2;
                            this._timeScale += 1;
                        }
                    }
                }
                else {
                    this._time += dt;
                    this._curWaveTime += dt;
                    if (this._curWaveTime >= this._waveDuration) {
                        this._prepareNextWave = true;
                        this._timeScale = 3;
                    }
                    if (this._time > this._maxTime) {
                        this.addFishGroup();
                    }
                }
            }

            this._addStarTime += dt;
            if (this._addStarTime >= kADDSTARTIME) {
                this._currentScene.addStarfish();
                this._addStarTime = 0;
            }
        }
    },
    updateAllActors:function (dt) {
        if (this._sessionRunning) {
            var gameScene = this._currentScene;
            var groupFishOnScreen = gameScene.getActors(GroupFishActor);
            var allBulletsOnScreen = gameScene.getActors(GroupHeroBullet);
            this.updateBullets(dt, allBulletsOnScreen, groupFishOnScreen);

            var allGolds = gameScene.getActors(GroupGoldPrizeActor);
            this.updateAllGolds(allGolds, dt);

            var allNetsOnScreen = gameScene.getActors(GroupFishNetActor);
            this.updateAllFishes(groupFishOnScreen, allNetsOnScreen, dt);

            this.updateBullets(dt);
            for (var i = 0; i < groupFishOnScreen.length; i++) {
                groupFishOnScreen[i].update(dt * this._timeScale);
            }

            this.updateShellActor(dt);
        }
    }
});