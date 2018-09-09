uniform float threshold;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float gray = color.r * .299 + color.g * .587 + color.b * .114;
  float th_color = gray > threshold ? 1. : 0.;

  if (gray > threshold) {
    gl_FragColor = color;
  } else {
    gl_FragColor = vec4(0., 0., 0., 1.0);
  }
}
