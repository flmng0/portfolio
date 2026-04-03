import Particle from './particle'
import { mag, map } from './math'

/** @type {import("svelte/attachments").Attachment<HTMLElement>} */
const hardhat = (elem) => {
	/** @type {Particle} */
	let particle
	/** @type {number} */
	let lastT
	/** @type {number} */
	let rot
	/** @type {number} */
	let rotVel
	let simulating = false

	const simulate = () => {
		const t = performance.now()
		const dt = (t - lastT) / 1000
		lastT = t

		particle.applyForce([0, 200])
		particle.update(dt)

		rot += rotVel * dt
		const rotAcc = mag(particle.vel) * 10
		rotVel += rotAcc * dt

		elem.style.transform = `translate(${particle.pos[0]}px, ${particle.pos[1]}px) rotate(${rot}deg)`

		if (particle.pos[1] > 100) {
			elem.style.transform = ''
			simulating = false
		} else {
			requestAnimationFrame(simulate)
		}
	}

	elem.addEventListener('click', () => {
		if (simulating) {
			return
		}

		lastT = performance.now()

		rot = 0
		rotVel = map(Math.random(), 0, 1, -200, 200)

		particle = new Particle(0, 0)

		const ix = map(Math.random(), 0, 1, -15, -40)
		particle.applyImpulse([ix, -100])

		simulating = true
		simulate()
	})
}

export default hardhat
