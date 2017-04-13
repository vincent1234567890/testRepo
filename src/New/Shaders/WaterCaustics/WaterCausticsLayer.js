/**
 * Created by eugeneseah on 8/2/17.
 */
const WaterCausticsLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var sprite = this.sprite = new cc.Sprite("res/HelloWorld.png");
        // var shader = new cc.GLProgram();
        this.shader = new cc.GLProgram(res.waterCausticsVSH, res.waterCausticsFSH);

        // if(shader.initWithString(vsh, fsh)){
        this.shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        this.shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        this.shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        this.shader.link();
        this.shader.updateUniforms();
        this.shader._usesTime = true;

        sprite.setShaderProgram(this.shader);
        // this._valueUniform = this.shader.getUniformLocationForName('u_value');
        this.shader.use();

        // }
        sprite.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height/ 2
        });
        this.addChild(sprite);

        this.scheduleUpdate();

        return true;
    },

    update: function() {
        // this.shader.setUniformsForBuiltins();
        //
        // this.shader.setUniformLocationWith1f(this._valueUniform, Math.random());
        this.shader.updateUniforms();
    }
});
