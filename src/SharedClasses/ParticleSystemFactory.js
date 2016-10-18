var ParticleSystemFactory = cc.Class.extend({
    _particleCache:null,

    ctor:function () {
        this._particleCache = {};
    },

    createParticle:function (plistPath) {
        if (!this._particleCache.hasOwnProperty(plistPath)){
            this._particleCache[plistPath] = new cc.ParticleSystem(plistPath);
            this._particleCache[plistPath].unscheduleAllSelectors();
        }


        return this._particleCache[plistPath].clone();
    },

    clearCache:function () {
        this._particleCache = {};
    }
});

ParticleSystemFactory._staticFactory = null;
ParticleSystemFactory.getInstance = function () {
    if (!ParticleSystemFactory._staticFactory) {
        ParticleSystemFactory._staticFactory = new ParticleSystemFactory();
    }
    return ParticleSystemFactory._staticFactory;
};
