/**
 * Created by eugeneseah on 25/10/16.
 */

const GameView = function () {
    "use strict";

    let _parentNode;
    let _touchLayer;
    let _isRotated = false;
    let _gameConfig;
    let _playerId;
    let _playerSlot;

    let _fishGameArena;
    let _latestTouchPos = null;
    let _autoFiring = false;
    let _lastShotTime = -Infinity;

    //UIManagers
    let _playerViews = [];
    let _effectsManager;
    let _waveTransitionView;

    let _lobbyNode;
    let _lockOnCallback;

    let _screenShakeNode;

    let _connectionSignal;

    const NUMBER_OF_BACKGROUNDS = 5;

    function initialise(parentNode, gameConfig, fishGameArena, lockOnCallback, fishLockStatus) {
        console.log("GameView:initialise");
        if (gameConfig) { // going into game
            initialiseParent(parentNode);

            _screenShakeNode = new cc.Node();
            addView(_screenShakeNode);
            console.log("GameView:initialise:_screenShakeNode",_screenShakeNode);

            _fishGameArena = fishGameArena;
            _gameConfig = gameConfig;
            _lockOnCallback = lockOnCallback;

            if (_gameConfig.cannonPositions[_playerSlot][1] > cc.view.getDesignResolutionSize().height / 2) {
                _isRotated = true;
            }

            _connectionSignal = new ConnectionSignal();
            addView(_connectionSignal, 1);

            //create the player view.
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                const index = getPlayerSlot(i);
                _playerViews[index] = new PlayerViewManager(_gameConfig, index, i === _playerSlot, changeSeatRequest, lockOnRequest, fishLockStatus);
            }
            _effectsManager = new EffectsManager(_screenShakeNode);
        } else if (!_lobbyNode) { // first time initialisation
            initialiseParent(parentNode);
            _lobbyNode = _parentNode;
        } else { // reuse lobby node
            _parentNode = _lobbyNode;
        }
    }

    function goToSeatSelection(parent) {
        _parentNode = parent;
    }

    function initialiseParent(parent) {
        const plists = ResourceLoader.getPlists("Game");
        for (let list in plists) {
            cc.spriteFrameCache.addSpriteFrames(plists[list]);
        }
        if (parent === undefined && _parentNode && _parentNode.parent) {
            parent = _parentNode.parent;
        }
        _parentNode = new cc.Node();

        parent.addChild(_parentNode);
    }

    function goToGame(choice) {
        if (_waveTransitionView) {
            setBackgroundTo(_fishGameArena.getRoundNumber());
        } else {
            _waveTransitionView = new WaveTransition(res['GameBackground' + (_fishGameArena.getRoundNumber() % NUMBER_OF_BACKGROUNDS).toString()]);
            _screenShakeNode.addChild(_waveTransitionView);
        }
        initialiseTouch(touchAt);
        const multiplier = parseInt(choice.gameName, 10); // because scenes are 1X, 10X, 100X
        ef.gameController.setCurrentMultiple(multiplier);
        if (_gameConfig) {
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                _playerViews[i].setMultiplier(multiplier);
            }
        }

        cc.audioEngine.playMusic(res.ArenaGameBGM, true);
    }

    function setBackgroundTo(roundNumber) {
        _waveTransitionView.transition(res['GameBackground' + (roundNumber % NUMBER_OF_BACKGROUNDS).toString()]);
    }

    function addView(view, depth, isScreenShake) {
        if (isScreenShake && _screenShakeNode){
            _screenShakeNode.addChild(view);
        }else {
            _parentNode.addChild(view, depth);
        }
    }

    function destroyView(view) {
        _parentNode.removeChild(view);
    }

    const initialiseTouch = function (touchAt) {
        if (_touchLayer) {
            _parentNode.removeChild(_touchLayer);
        }
        _touchLayer = new TouchLayerRefactored(touchAt);
        _parentNode.addChild(_touchLayer, -1);
    };

    function getRotatedView(position, rotation) { //position in array, rotation in radians, output in degrees
        let x;
        let y;
        let rot = 0;
        if (_isRotated && _gameConfig.isUsingOldCannonPositions) {
            if (position) {
                x = cc.view.getDesignResolutionSize().width - position[0];
                y = cc.view.getDesignResolutionSize().height - position[1];
            }
            if (rotation !== null) {
                rot = -(rotation * 180 / Math.PI);
            }
        } else {
            if (position) {
                x = position[0];
                y = position[1];
            }
            if (rotation !== null) {
                rot = 180 - rotation * 180 / Math.PI;
            }
        }
        return {position: [x, y], rotation: rot}
    }

    function resetArena() {
        _isRotated = false;
        if (_gameConfig) {
            for (let i = 0; i < _gameConfig.maxPlayers; i++) {
                clearPlayerState(i);
            }
        }
        _lastShotTime = -Infinity;
        _screenShakeNode = undefined;
        _waveTransitionView = undefined;
    }

    function destroyArena() {
        if (!_fishGameArena) {
            return;
        }

        for (let i = 0; i < _gameConfig.maxPlayers; i++) {
            _playerViews[i].destroyView();
            delete _playerViews[i];
        }
        _playerSlot = undefined;
        _fishGameArena = null;
        const plists = ResourceLoader.getPlists("Game");
        for (let list in plists) {
            cc.spriteFrameCache.removeSpriteFrameByName(plists[list]);
        }
        _screenShakeNode = undefined;
        _waveTransitionView = undefined;

        cc.audioEngine.stopMusic();
    }

    function getPlayerSlot(slot) {
        if (_isRotated && _gameConfig.isUsingOldCannonPositions)
            return _gameConfig.maxPlayers - slot - 1;
        return slot;
    }

    function touchAt(pos, touchType) {
        if (ef.gameController.getLockMode() == LockFishStatus.LOCK)
            return;
        if (touchType === TouchType.Moved || touchType === TouchType.Began) {
            _latestTouchPos = pos;
        } else {
            _latestTouchPos = null;
            _autoFiring = false;
        }
        if (touchType === TouchType.Began) {
            _autoFiring = true;
            fireBulletAt(pos);
        }
    }

    function fireBulletAt(pos) {
        if (pos) {
            const now = _fishGameArena.getGameTime();
            const timeSinceLastShot = now - _lastShotTime;
            // When auto-firing, we add a small delay so that we won't receive so many "Your gun is still reloading" messages from the server.
            const lagBuffer = _autoFiring ? 40 : 0;
            if (timeSinceLastShot < _gameConfig.shootInterval + lagBuffer) {
                return;
            }

            _lastShotTime = now;

            let slot = getPlayerSlot(_playerSlot);
            const direction = cc.pNormalize(cc.pSub(pos, new cc.p(_gameConfig.cannonPositions[slot][0], _gameConfig.cannonPositions[slot][1])));
            const rot = Math.atan2(direction.x, direction.y);
            let info = getRotatedView(undefined, rot);

            const bulletId = _playerId + ':' + getPlayerBulletId(), rotation = info.rotation - 90;
            const currentSeat = ef.gameController.getCurrentSeat();
            let transRotation = rotation;
            if (currentSeat === 2) {
                transRotation += 90;
                if(transRotation > 250)
                    transRotation = transRotation - 360;
            } else if (currentSeat === 3) {
                transRotation -= 90;
                if(transRotation < -80)
                    transRotation = transRotation + 360;
            }
            if (transRotation < -8 || transRotation > 188)  //limit the fire rotation degree from 0 to 180
                return;

            ClientServerConnect.getServerInformer().bulletFired(bulletId, cc.degreesToRadians(rotation));
        }
    }

    const getPlayerBulletId = function () {
        return _playerViews[0].getNextBulletId(); //currently bulletId is static no need to convert player slot
    };

    function setMyPlayerData(playerId, slot) {
        _playerId = playerId;
        _playerSlot = slot;
    }

    function shootTo(playerId, angle) {
        let slot = _fishGameArena.getPlayer(playerId).slot;
        let modifiedSlot = getPlayerSlot(slot);
        _playerViews[modifiedSlot].shootTo(angle);
    }

    function updateMultiplayerState(playerData, oldSlot) {
        const slot = getPlayerSlot(playerData.slot);
        let oldPlayerView = null;
        if (oldSlot !== null) {
            oldPlayerView = _playerViews[oldSlot];
            if (oldSlot === _playerSlot) {
                _playerSlot = slot;
            }
        }

        const playerView = _playerViews[slot];
        if (playerView) {
            if(oldPlayerView){
                playerView.isPlayer = oldPlayerView.isPlayer;
                oldPlayerView.isPlayer = false;
            }
            playerView.updatePlayerData(playerData, oldSlot != null ? _playerSlot : undefined);
        }
    }

    function setPlayerLockStatus (slot, lockStatus) {
        const playerView = _playerViews[slot];
        if (playerView) {
            playerView.setPlayerLockStatus(lockStatus);
        }
    }

    function clearPlayerState(slot) {
        if (_playerViews[slot]) {
            _playerViews[slot].clearPlayerData();
        }
    }

    function updateArena() {
        if (_autoFiring) {
            fireBulletAt(_latestTouchPos);
        }

        _fishGameArena.updateEverything();
    }

    function stopAutoFiring() {
        _autoFiring = false;
        _latestTouchPos = null;
    }

    function changeSeatRequest(slot) {
        ClientServerConnect.changeSeatRequest(slot);
    }

    function lockOnRequest(state) {
        _lockOnCallback(state);
    }

    function caughtFishAnimationEnd(data) {
        if (data.playerSlot === _playerSlot || _gameConfig.fishClasses[data.type].tier % 100 > 1) {
            _effectsManager.doCapturePrizeEffect(data.position, _gameConfig.cannonPositions[data.playerSlot], _gameConfig.fishClasses[data.type]);
            if (_gameConfig.fishClasses[data.type].tier % 100 > 1) {
                _playerViews[data.playerSlot].showAwardMedal(data.type, _gameConfig.fishClasses[data.type].value);
            }
        }
    }

    function setFreeRound(type) {
        if (type === 'clearing_for_free_shooting_game') {
            _effectsManager.showFreeRoundEffect();
            cc.audioEngine.playMusic(res.FreeGameBGM, true);
        } else if(type === "normal"){  //free round end
            cc.audioEngine.playMusic(res.ArenaGameBGM, true);
        }
    }

    return {
        initialise: initialise,
        clearPlayerState: clearPlayerState,
        goToGame: goToGame,
        setBackgroundTo: setBackgroundTo,
        addView: addView,
        destroyView: destroyView,
        getRotatedView: getRotatedView,
        resetArena: resetArena,
        destroyArena: destroyArena,
        // getPlayerSlot : getPlayerSlot,
        setMyPlayerData: setMyPlayerData,
        shootTo: shootTo,
        updateMultiplayerState: updateMultiplayerState,
        updateArena: updateArena,
        stopAutoFiring: stopAutoFiring,
        setPlayerLockStatus: setPlayerLockStatus,
        caughtFishAnimationEnd: caughtFishAnimationEnd,
        setFreeRound: setFreeRound,

        goToSeatSelection: goToSeatSelection,
    };
}();