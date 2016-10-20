var particleSystemFactory = {
    _particleCache:{},

    createParticle:function (plistPath) {
        if (!this._particleCache.hasOwnProperty(plistPath)){
            this._particleCache[plistPath] = new cc.ParticleSystem(plistPath);
            this._particleCache[plistPath].unscheduleAllCallbacks();
        }

        return this._particleCache[plistPath].clone();
    },

    clearCache:function () {
        this._particleCache = {};
    }
};