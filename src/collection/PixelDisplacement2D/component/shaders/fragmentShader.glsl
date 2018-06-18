uniform sampler2D image;
uniform sampler2D map;
uniform float scaleX;
uniform float scaleY;
uniform float u_time;
varying vec2 vUv;

void main() {
  vec4 t_map = texture2D(map, fract(vUv + u_time));

  float offset = t_map.g;
  
  vec2 uv = vec2(vUv.x + offset * scaleX, vUv.y + offset * scaleY);

	vec4 t_image = texture2D(image, uv);

  gl_FragColor = t_image;
}
