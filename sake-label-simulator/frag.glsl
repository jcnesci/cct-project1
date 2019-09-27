// // From glsl-hash-blur readme

// vec3 tex(vec2 uv);

// #pragma glslify: blur = require('glsl-hash-blur', sample=tex, iterations=20)

// vec3 tex(vec2 uv) {
//   return texture2D(iChannel0, uv).rgb;
// }

// void main() {
//   float aspect = resolution.x / resolution.y;
//   gl_FragColor.rgb = blur(vUv, radius, aspect);
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
uniform vec3 iColorFill;
uniform vec3 iResolution;
uniform sampler2D iChannel0;

vec3 tex(vec2 uv);

#pragma glslify: blur = require('glsl-hash-blur', sample=tex, iterations=20)

vec3 tex(vec2 uv) {
  return texture2D(iChannel0, uv).rgb;
}

void main(void) {
  vec2 uv = vUv;

  // NEORT sketch
  // TODO: change to hsbtorgb func!
  for(float i = 1.0; i < 4.0; i++){
    uv.x += 0.8 / i *cos(i*1.5* uv.y + iGlobalTime) -cos(i*1.5* uv.y + iGlobalTime);
    uv.y +=  0.8 / i * sin(i*2.5* uv.x + iGlobalTime) - sin(i*2.5* uv.y + iGlobalTime);
  }
  float r = 1.0-sin(uv.x+uv.y);
  float g =1.0;
  float b = 1.0-cos(uv.x+uv.y);
  vec3 color = vec3(r, g, b);

  // custom
  color = mix(color, iColorFill, 0.5);

  // hash blur
  float texelSize = 1.0 / iResolution.x;
  float aspect = iResolution.x / iResolution.y;
  float radius = 1.0 * texelSize;
  vec3 blurColor = blur(vUv, radius, aspect);

  gl_FragColor = vec4(mix(color, blurColor, 0.8), 1.0);
}