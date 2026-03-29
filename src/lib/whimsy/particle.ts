import { remag, scale, fromTo, type Point } from './math'

export default class Particle {
	origin: Point
	pos: Point
	vel: Point
	private acc: Point

	constructor(x: number, y: number) {
		this.origin = [x, y]
		this.pos = [x, y]
		this.vel = [0, 0]
		this.acc = [0, 0]
	}

	applyForce(force: Point) {
		this.acc[0] += force[0]
		this.acc[1] += force[1]
	}

	applyImpulse(impulse: Point) {
		this.vel[0] += impulse[0]
		this.vel[1] += impulse[1]
	}

	repel(point: Point, power: number) {
		const force = scale(fromTo(point, this.pos), power)
		this.applyForce(force)
	}

	attract(point: Point, scale: number) {
		const force = remag(fromTo(this.pos, point), scale)
		this.applyForce(force)
	}

	restore(power: number) {
		const force = scale(fromTo(this.pos, this.origin), power)
		this.applyForce(force)
	}

	drag(power: number) {
		const force = scale(this.vel, -power)
		this.applyForce(force)
	}

	update(dt: number) {
		this.vel[0] += this.acc[0] * dt
		this.vel[1] += this.acc[1] * dt

		this.pos[0] += this.vel[0] * dt
		this.pos[1] += this.vel[1] * dt

		this.acc = [0, 0]
	}
}
