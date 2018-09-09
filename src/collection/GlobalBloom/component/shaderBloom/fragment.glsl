uniform sampler2D tDiffuse;
uniform sampler2D tBlur;
uniform float toneExp;

varying vec2 vUv;

void main() {
  vec3 diffuseColor = texture2D(tDiffuse, vUv).rgb;
  vec3 blurColor = texture2D(tBlur, vUv).rgb;

  vec3 result = diffuseColor + blurColor;
  
  result = vec3(1.) - exp(-result * toneExp);

  gl_FragColor = vec4(result, 1.);
}
