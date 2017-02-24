attribute vec4 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

void main()
{
    //CC_PMatrix is the projection matrix, where as the CC_MVPMatrix is the model, view, projection matrix. Since in 2d we are using ortho camera CC_PMatrix is enough to do calculations.
    //gl_Position = CC_MVPMatrix * a_position;

    gl_Position = CC_PMatrix * a_position;
    v_fragmentColor = a_color;
    v_texCoord = a_texCoord;
}