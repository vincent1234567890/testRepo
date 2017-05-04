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
    let _touchedPos;
    let _lastShotTime = -Infinity;

    //UIManagers
    let _playerViews = [];
    let _effectsManager;
    let _waveTransitionView;

    let _lobbyNode;
    let _lockOnCallback;

    let _screenShakeNode;

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
        if(_waveTransitionView) {
            setBackgroundTo(choice ? choice.gameId : 0);
        }else {
            _waveTransitionView = new WaveTransition(res['GameBackground' + ((choice ? choice.gameId : 0) % (NUMBER_OF_BACKGROUNDS-1)).toString()]);
            _screenShakeNode.addChild(_waveTransitionView);
        }
        initialiseTouch(touchAt);
        _playerViews[_playerSlot].setMultiplier(choice.gameName.slice(0,-1)); // because scenes are 1X, 10X, 100X
    }

    function setBackgroundTo(choice) {
        _waveTransitionView.transition(res['GameBackground' + (choice % (NUMBER_OF_BACKGROUNDS-1)).toString()]);
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
            if (rotation != null) {
                rot = -(rotation * 180 / Math.PI);
            }
        } else {
            if (position) {
                x = position[0];
                y = position[1];
            }
            if (rotation != null) {
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
    }

    function getPlayerSlot(slot) {
        if (_isRotated && _gameConfig.isUsingOldCannonPositions)
            return _gameConfig.maxPlayers - slot - 1;
        return slot;
    }

    function touchAt(pos, touchType) {
        if (touchType === TouchType.Began || touchType === TouchType.Moved) {
            _touchedPos = pos;
            const now = _fishGameArena.getGameTime();
            const timeSinceLastShot = now - _lastShotTime;
            if (timeSinceLastShot < _gameConfig.shootInterval) {
                return;
            }

            _lastShotTime = now;

            let slot = getPlayerSlot(_playerSlot);

            const direction = cc.pNormalize(cc.pSub(pos, new cc.p(_gameConfig.cannonPositions[slot][0], _gameConfig.cannonPositions[slot][1])));
            const rot = Math.atan2(direction.x, direction.y);
            let info = getRotatedView(undefined, rot);

            const bulletId = _playerId + ':' + getPlayerBulletId();

            ClientServerConnect.getServerInformer().bulletFired(bulletId, (info.rotation - 90) / 180 * Math.PI);
        } else {
            _touchedPos = null;
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
        if (oldSlot != null) {
            if (oldSlot === _playerSlot) {
                _playerSlot = slot;
            }
        }
        _playerViews[slot].updatePlayerData(playerData, oldSlot != null ? _playerSlot : undefined);
    }

    function clearPlayerState(slot) {
        if (_playerViews[slot]) {
            _playerViews[slot].clearPlayerData();
        }
    }

    function updateArena() {
        if (_touchedPos != null) {
            touchAt(_touchedPos, TouchType.Moved);
        }

        _fishGameArena.updateEverything();
    }

    function changeSeatRequest(slot) {
        ClientServerConnect.changeSeatRequest(slot);
    }

    function lockOnRequest(state) {
        _lockOnCallback(state);
    }

    function caughtFishAnimationEnd(data) {
        if (data.playerSlot === _playerSlot && _gameConfig.fishClasses[data.type].tier > 1) {
            _effectsManager.doCapturePrizeEffect(data.position, _gameConfig.cannonPositions[data.playerSlot], _gameConfig.fishClasses[data.type]);
            if(_gameConfig.fishClasses[data.type].tier > 1) {
                _playerViews[_playerSlot].showAwardMedal(_gameConfig.fishClasses[data.type].value);
            }
        }
    }

    function setFreeRound(type) {
        if (type === 'clearing_for_free_shooting_game') {
            _effectsManager.showFreeRoundEffect();
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
        caughtFishAnimationEnd: caughtFishAnimationEnd,
        setFreeRound: setFreeRound,

        goToSeatSelection: goToSeatSelection,
    }


}();