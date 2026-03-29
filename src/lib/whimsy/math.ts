export type Point = [number, number]

export function subtract(a: Point, b: Point): Point {
	return [a[0] - b[0], a[1] - b[1]]
}

/** Returns vector pointing from a -> b */
export function fromTo(a: Point, b: Point): Point {
	return subtract(b, a)
}

export function magSq(p: Point): number {
	return p[0] * p[0] + p[1] * p[1]
}
export function mag(p: Point): number {
	return Math.sqrt(magSq(p))
}

export function scale(p: Point, scale: number): Point {
	return [p[0] * scale, p[1] * scale]
}

export function remag(p: Point, newMag: number): Point {
	const m = mag(p)
	if (m == 0) return p
	return scale(p, newMag / m)
}

export function distSq(a: Point, b: Point): number {
	return magSq(fromTo(a, b))
}

export function dist(a: Point, b: Point): number {
	return Math.sqrt(distSq(a, b))
}

export function normalized(p: Point): Point {
	const m = mag(p)
	if (m == 0) return p
	return [p[0] / m, p[1] / m]
}

export function map(x: number, minA: number, maxA: number, minB: number, maxB: number) {
	const norm = (x - minA) / (maxA - minA)
	return minB + (maxB - minB) * norm
}

export function clamp(x: number, min: number, max: number) {
	if (x < min) {
		return min
	}
	if (x > max) {
		return max
	}
	return x
}
