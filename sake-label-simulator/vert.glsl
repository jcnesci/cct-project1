varying vec2 vUv;
uniform float iGlobalTime;
uniform float iDeformAmt;

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

void main() {
  vUv = uv;
  float updateTime = iGlobalTime / 3.0;

  float noise = 10.0 *  -.10 * turbulence( .05 * normal + updateTime );
  // float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * updateTime ), vec3( 100.0 ) );
  float b = iDeformAmt * pnoise( 0.05 * position + vec3( 2.0 * updateTime ), vec3( 10.0 * iDeformAmt) );
  float displacement = noise + b;
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

  //

  // vUv = uv;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
