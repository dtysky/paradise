#define WINDOW_SIZE 5.
#define DOUBLE_WINDOW_SIZE 10.

uniform float stepSize;
uniform bool vDirection;
uniform sampler2D tThreshold;

varying vec2 vUv;

void main() {
  vec4 blur = texture2D(tThreshold, vUv);
  
  if (vDirection) {
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      blur += texture2D(tThreshold, vUv + vec2(0., i * stepSize));
      blur += texture2D(tThreshold, vUv - vec2(0., i * stepSize));
    }
  } else {
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      blur += texture2D(tThreshold, vUv + vec2(i * stepSize, 0.));
      blur += texture2D(tThreshold, vUv - vec2(i * stepSize, 0.));
    }
  }
  
  blur.rgb = blur.rgb / DOUBLE_WINDOW_SIZE;

  gl_FragColor = blur;
}
