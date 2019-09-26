// vec3 tex(vec2 uv);

// #pragma glslify: blur = require('glsl-hash-blur', sample=tex, iterations=20)

// vec3 tex(vec2 uv) {
//   return texture2D(iChannel0, uv).rgb;
// }

//////////////////////////////////////////////////
// From fireball tutorial

// uniform float iGlobalTime;
// varying vec2 vUv;
// uniform sampler2D iChannel0;

// void main() {
//   gl_FragColor = vec4(texture2D(iChannel0, vUv).rgb,  1.0);
// }

//////////////////////////////////////////////////
// Found on NEORT

precision highp float;

varying vec2 vUv;
uniform float iGlobalTime;
uniform vec2 mouse;

void main(void) {
  vec2 uv = vUv;
  for(float i = 1.0; i < 4.0; i++){
    uv.x += 0.8 / i *cos(i*1.5* uv.y + iGlobalTime) -cos(i*1.5* uv.y + iGlobalTime);
    uv.y +=  0.8 / i * sin(i*2.5* uv.x + iGlobalTime) - sin(i*2.5* uv.y + iGlobalTime);
  }
  float r = 1.0-sin(uv.x+uv.y);
  float g =1.0;
  float b = 1.0-cos(uv.x+uv.y);
  gl_FragColor = vec4(r, g ,b, 1.0);
}