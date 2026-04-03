export function subtract(a, b) {
	return [a[0] - b[0], a[1] - b[1]]
}

/** Returns vector pointing from a -> b */
export function fromTo(a, b) {
	return subtract(b, a)
}

export function magSq(p) {
	return p[0] * p[0] + p[1] * p[1]
}
export function mag(p) {
	return Math.sqrt(magSq(p))
}

export function scale(p, scale) {
	return [p[0] * scale, p[1] * scale]
}

export function remag(p, newMag) {
	const m = mag(p)
	if (m == 0) return p
	return scale(p, newMag / m)
}

export function normalized(p) {
	const m = mag(p)
	if (m == 0) return p
	return [p[0] / m, p[1] / m]
}

export function distSq(a, b) {
	return magSq(fromTo(a, b))
}

export function dist(a, b) {
	return Math.sqrt(distSq(a, b))
}

export function map(x, minA, maxA, minB, maxB) {
	const norm = (x - minA) / (maxA - minA)
	return minB + (maxB - minB) * norm
}

export function clamp(x, min, max) {
	if (x < min) {
		return min
	}
	if (x > max) {
		return max
	}
	return x
}
