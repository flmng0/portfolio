out vec4 outColor; 

#define R 2.0
#define ITERATIONS 200
#define TAU 6.2831855
#define MAG 0.7885

void main() {
	// coordinates from 0,0 (bottom left) to 1,1 (top right).
	vec2 uv = gl_FragCoord.xy / uResolution;
	vec2 z = 3.0 * uv - vec2(1.5);

	float theta = mod(1.0 + uTime / 5.0, TAU);
	vec2 c = MAG * vec2(cos(theta), sin(theta));

	int i = 0;

	while (length(z) < R && i < ITERATIONS) {
		float x = z.x * z.x - z.y * z.y;
		float y = 2.0 * z.x * z.y;

		z = vec2(x, y) + c;

		i = i + 1;
	}

	if (i == ITERATIONS) i = 0;

	float j = float(i) / float(ITERATIONS);

	outColor = vec4(vec3(j), 1.0);
}
