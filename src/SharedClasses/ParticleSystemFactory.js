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
    },

    //Eugene:
    create : function (plistPath, pos, isShaped){
        if (!this._particleCache.hasOwnProperty(plistPath)){
            this._particleCache[plistPath] = new cc.ParticleSystem(plistPath);
            this._particleCache[plistPath].unscheduleAllCallbacks();
        }

        var particle = this._particleCache[plistPath].clone();

        if (pos !== undefined){
            particle.setPosition(pos);
        }

        if (isShaped !== undefined){
            particle.setDrawMode(cc.ParticleSystem.SHAPE_MODE);
            particle.setShapeType(cc.ParticleSystem.STAR_SHAPE);
        }

        return particle;

    }
};