// uniform float iGlobalTime;
// varying vec2 vUv;
// uniform sampler2D iChannel0;

// void main() {
//   gl_FragColor = vec4(texture2D(iChannel0, vUv).rgb,  1.0);
// }

//

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
// uniform sampler2D backbuffer;

void main(void) {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  for(float i = 1.0; i < 4.0; i++){
    uv.x += 0.8 / i *cos(i*1.5*  uv.y + time) -cos(i*1.5* uv.y + time);
    uv.y +=  0.8 / i * sin(i*2.5* uv.x + time) - sin(i*2.5* uv.y + time);
  }

  float r = 1.0-sin(uv.x+uv.y);
  float g =1.0;
  float b = 1.0-cos(uv.x+uv.y);

  gl_FragColor = vec4(r, g ,b, 1.0);
}