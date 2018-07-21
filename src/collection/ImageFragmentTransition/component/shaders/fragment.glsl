precision mediump float;
precision mediump int;

uniform sampler2D image1;
uniform sampler2D image2;
uniform float progress;
uniform int bout;

varying vec2 vUv;

void main() {
  vec4 t_image;
  vec4 t_image1;
  vec4 t_image2;

  if (bout == 0) {
    t_image1 = texture2D(image1, vUv);
    t_image2 = texture2D(image2, vUv);
  } else {
    t_image2 = texture2D(image1, vUv);
    t_image1 = texture2D(image2, vUv);
  }

  t_image = progress * t_image1 + (1. - progress) * t_image2;

  gl_FragColor = t_image;
}
