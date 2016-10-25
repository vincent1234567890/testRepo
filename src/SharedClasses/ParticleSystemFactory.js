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

        if (pos === undefined){
            return particle;
        }

        particle.setPosition(pos)

        if (isShaped === undefined){
            return particle;
        }

        particle.setDrawMode(cc.PARTICLE_SHAPE_MODE);
        particle.setShapeType(cc.PARTICLE_STAR_SHAPE);

        return particle;

    }
};