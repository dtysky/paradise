uniform vec3 view_vector;
uniform float c;
uniform float p;

varying vec2 vUv;
varying float intensity;

void main() {
  vec3 v_normal = normalize(normalMatrix * normal);
	vec3 v_view = normalize(normalMatrix * view_vector);

	intensity = pow(c - dot(v_normal, v_view), p);
  vUv = uv;
	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
