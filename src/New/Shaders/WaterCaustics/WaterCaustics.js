/**
 * Created by eugeneseah on 8/2/17.
 */

const WaterCaustics = function() {
    var shader = new cc.GLProgram();

    // First gotcha: the matrix to use in the shader is different in
    // HTML5 and Cocos2d-x.
    var projectionMatrix = typeof document !== "undefined" ?
        "(CC_PMatrix * CC_MVMatrix)" :
        "CC_PMatrix";
    shader.initWithString(
        ""
        + "       \n"
        + "attribute vec4 a_position;\n"
        + "attribute vec2 a_texCoord;\n"
        + "attribute vec4 a_color;\n"
        + "					\n"
        + "\n"
        + "varying vec4 v_fragmentColor;\n"
        + "varying vec2 v_texCoord;\n"
        + "								\n"
        + "void main()	\n"
        + "{							\n"
        + "    gl_Position = " + projectionMatrix + " * a_position;\n"
        + "	v_fragmentColor = a_color;\n"
        + "	v_texCoord = a_texCoord;\n"
        + "}\n"
        ,
        ""
        + "varying vec4 v_fragmentColor;	\n"
        + "varying vec2 v_texCoord;	\n"
        + "uniform float u_value;	\n"
        + "\n"
        + "void main()			\n"
        + "{\n"
        + "    vec4 v_orColor = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n"
        + "    float gray = dot(v_orColor.rgb, vec3(u_value, 0.587, 0.114));\n"
        + "    gl_FragColor = vec4(gray, gray, gray, v_orColor.a);\n"
        + "}\n"
    );

    shader.addAttribute("a_position", 0);
    shader.addAttribute("a_color", 1);
    shader.addAttribute("a_texCoord", 2);
    shader.link();
    shader.updateUniforms();

    return shader;
};