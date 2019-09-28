varying vec2 vUv;
varying vec3 vColor;
uniform float iGlobalTime;
uniform float iDeformAmt;
uniform float iTimeMod;

#pragma glslify: pnoise = require(glsl-noise/periodic/3d)

// Ken Perlin's turbulence function.
// https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
float turbulence( vec3 p ) {
  float w = 100.0;
  float t = -.5;
  for (float f = 1.0 ; f <= 10.0 ; f++ ){
    float power = pow( 2.0, f );
    t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
  }
  return t;
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                           6.0)-3.0)-1.0,
                   0.0,
                   1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
  vUv = uv;
  float updateTime = (iGlobalTime / 7.0) * iTimeMod;

  float noise = 10.0 *  -.10 * turbulence( .05 * normal + updateTime );

  float b = iDeformAmt * pnoise( 0.05 * position + vec3( 2.0 * updateTime ), vec3( 10.0 * iDeformAmt) );

  float displacement = noise + b;

  vColor = hsb2rgb(vec3(
    (51./360.) + (noise * 0.1),
    0.6 + (noise * 0.5),
    0.8 + (noise * 0.5)
  ));

  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
