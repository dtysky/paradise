precision mediump float;
precision mediump int;

attribute vec3 position;
attribute vec3 centre;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float progress;
uniform float top;
uniform float left;
uniform float width;
uniform float height;

varying vec2 vUv;

vec3 rotate_around_z_in_degrees(vec3 vertex, float degree) {
	float alpha = degree * 3.14 / 180.0;
	float sina = sin(alpha);
	float cosa = cos(alpha);
	mat2 m = mat2(cosa, -sina, sina, cosa);
	return vec3(m * vertex.xy, vertex.z).xyz;
}

void main() {
	vUv = uv;
	vec3 new_position = position;
	vec3 center = vec3(left + width * 0.5, top + height * 0.5, 0);
	vec3 dist = center - centre;
	float len = length(dist);
	float factor;

	if (progress < 0.5) {
		factor = progress;
	} else {
		factor = (1. - progress);
	}

	float factor1 = len * factor * 10.;
	new_position.x -= sin(dist.x * factor1);
	new_position.y -= sin(dist.y * factor1);
	new_position.z += factor1;
	new_position = rotate_around_z_in_degrees(new_position, progress * 360.);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
}
