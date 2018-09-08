uniform sampler2D diffuse;
uniform vec3 glow_color;

varying float intensity;
varying vec2 vUv;

void main() {
	vec3 glow = glow_color * intensity;
  
  gl_FragColor = vec4(glow, 1.0) + texture2D(diffuse, vUv);
}
