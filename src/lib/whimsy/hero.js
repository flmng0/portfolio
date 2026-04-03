import Particle from './particle'
import { clamp, dist, distSq, map, subtract } from './math'
import state from '$lib/state.svelte'

// Assumes that the viewbox for the icon is 0 0 100 100

/**
 * @typedef Connection
 *
 * @property {number} aIdx
 * @property {number} bIdx
 * @property {number} originalDistance
 */

const repelRadius = 75
const repelScale = 100
const restoreScale = 7
const dragScale = 3

const repelRadiusSq = repelRadius * repelRadius

const iconScale = 350
const stretchExtent = 250

const connectionColor = '#555'

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Connection} connection
 * @param {Particle[]} particles
 */
function drawConnection(ctx, connection, particles) {
	const a = particles[connection.aIdx]
	const b = particles[connection.bIdx]

	const currentDistance = dist(a.pos, b.pos)
	const difference = Math.abs(connection.originalDistance - currentDistance)

	const clamped = clamp(difference, 0.01, stretchExtent)
	const lineWidth = map(clamped, 0.01, stretchExtent, 3, 0.01)

	ctx.beginPath()
	ctx.moveTo(...a.pos)
	ctx.lineTo(...b.pos)
	ctx.lineWidth = lineWidth
	ctx.stroke()
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./math').Point} pointer
 */
function drawRepeller(ctx, pointer) {
	ctx.beginPath()
	ctx.arc(...pointer, repelRadius, 0, 2 * Math.PI)
	ctx.stroke()
}

/**
 * @param {import('./math').Point[]} points
 * @param {[number, number][]} lines
 */
export default function hero(points, lines) {
	const particles = points.map(([x, y]) => {
		const centeredX = ((x - 50) / 100) * iconScale
		const centeredY = ((y - 50) / 100) * iconScale

		const particle = new Particle(centeredX, centeredY)

		if (!state.heroPlayed) {
			const x = map(Math.random(), 0, 1, -200, 200) * 2
			const y = map(Math.random(), 0, 1, -200, 200) * 2
			particle.pos = [x, y]
		}

		return particle
	})

	/** @type {Connection[]} */
	const connections = []

	for (const [aIdx, bIdx] of lines) {
		const a = particles[aIdx].origin
		const b = particles[bIdx].origin
		const originalDistance = dist(a, b)

		connections.push({ aIdx, bIdx, originalDistance })
	}

	/** @type {import('svelte/attachments').Attachment<HTMLCanvasElement>} */
	return (cvs) => {
		const ctx = cvs.getContext('2d')
		if (ctx === null) {
			throw new Error('Failed to get context for hero!')
		}

		ctx.strokeStyle = connectionColor

		let lastT = performance.now()
		let pointerDown = false
		/** @type {import('./math').Point} */
		let pointer

		window.addEventListener('pointerdown', () => (pointerDown = true))
		window.addEventListener('pointerup', () => (pointerDown = false))
		window.addEventListener('pointermove', (e) => {
			pointer = [e.clientX, e.clientY]
		})

		const draw = () => {
			const t = performance.now()
			const dt = Math.min((t - lastT) / 1000, 0.1)
			lastT = t

			const cx = cvs.width / 2
			const cy = cvs.height / 2

			const translatedPointer = pointer && subtract(pointer, [cx, cy])
			const repellerActive = pointerDown && translatedPointer !== undefined

			for (const p of particles) {
				if (repellerActive) {
					const dd = distSq(translatedPointer, p.pos)
					if (dd < repelRadiusSq) {
						p.repel(translatedPointer, repelScale)
					}
				}
				p.restore(restoreScale)
				p.drag(dragScale)
				p.update(dt)
			}

			ctx.clearRect(0, 0, cvs.width, cvs.height)

			if (pointerDown && pointer !== undefined) {
				drawRepeller(ctx, pointer)
			}

			ctx.save()
			ctx.translate(cvs.width / 2, cvs.height / 2)
			ctx.beginPath()
			connections.forEach((conn) => drawConnection(ctx, conn, particles))
			ctx.stroke()
			ctx.restore()

			requestAnimationFrame(draw)
		}

		draw()
	}
}
