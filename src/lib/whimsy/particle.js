import { remag, scale, fromTo } from './math'

export default class Particle {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		/** @type {import('./math').Point} */
		this.origin = [x, y]
		/** @type {import('./math').Point} */
		this.pos = [x, y]
		/** @type {import('./math').Point} */
		this.vel = [0, 0]
		/** @type {import('./math').Point} @private */
		this.acc = [0, 0]
	}

	/**
	 * @param {import('./math').Point} force
	 */
	applyForce(force) {
		this.acc[0] += force[0]
		this.acc[1] += force[1]
	}

	/**
	 * @param {import('./math').Point} impulse
	 */
	applyImpulse(impulse) {
		this.vel[0] += impulse[0]
		this.vel[1] += impulse[1]
	}

	/**
	 * @param {import('./math').Point} point
	 * @param {number} power
	 */
	repel(point, power) {
		const force = scale(fromTo(point, this.pos), power)
		this.applyForce(force)
	}

	/**
	 * @param {import('./math').Point} point
	 * @param {number} scale
	 */
	attract(point, scale) {
		const force = remag(fromTo(this.pos, point), scale)
		this.applyForce(force)
	}

	/**
	 * @param {number} power
	 */
	restore(power) {
		const force = scale(fromTo(this.pos, this.origin), power)
		this.applyForce(force)
	}

	/**
	 * @param {number} power
	 */
	drag(power) {
		const force = scale(this.vel, -power)
		this.applyForce(force)
	}

	/**
	 * @param {number} dt
	 */
	update(dt) {
		this.vel[0] += this.acc[0] * dt
		this.vel[1] += this.acc[1] * dt

		this.pos[0] += this.vel[0] * dt
		this.pos[1] += this.vel[1] * dt

		this.acc = [0, 0]
	}
}
