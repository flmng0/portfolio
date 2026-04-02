import { dist } from '$lib/whimsy/math'
import { type Attachment } from 'svelte/attachments'

interface Listeners {
	onpan?: (dx: number, dy: number) => void
	onzoom?: (ds: number, source: 'scroll' | 'pinch') => void
}

type PointerState = {
	x: number
	y: number
	lastX: number
	lastY: number
	dx: number
	dy: number
	down: boolean
}

export default function gesturable(listeners: Listeners): Attachment<HTMLElement> {
	const pointers = new Map<number, PointerState>()

	const updatePointer = (e: PointerEvent) => {
		const previous = pointers.get(e.pointerId)

		let down: boolean
		if (e.type === 'pointerdown') {
			down = true
		} else if (e.type === 'pointerup') {
			down = false
		} else {
			down = previous?.down ?? false
		}

		let state: PointerState
		if (previous !== undefined) {
			state = {
				x: e.clientX,
				y: e.clientY,
				lastX: previous.x,
				lastY: previous.y,
				dx: previous.x - e.clientX,
				dy: previous.y - e.clientY,
				down
			}
		} else {
			state = {
				x: e.clientX,
				y: e.clientY,
				lastX: e.clientX,
				lastY: e.clientY,
				dx: 0,
				dy: 0,
				down
			}
		}

		pointers.set(e.pointerId, state)
		return state
	}

	const handlePinch = (a: PointerState, b: PointerState) => {
		const previousDistance = dist([a.lastX, a.lastY], [b.lastX, b.lastY])
		const newDistance = dist([a.x, a.y], [b.x, b.y])

		const diffDistance = newDistance - previousDistance

		listeners.onzoom?.(diffDistance / 200, 'pinch')
	}

	return (elem) => {
		elem.addEventListener('pointerdown', updatePointer)
		elem.addEventListener('pointerup', (e) => {
			pointers.delete(e.pointerId)
		})

		elem.addEventListener('pointermove', (e) => {
			const state = updatePointer(e)

			if (pointers.size === 1 && state.down) {
				listeners.onpan?.(state.dx, state.dy)
			} else if (pointers.size === 2) {
				const otherKey = pointers.keys().find((k) => k !== e.pointerId)!
				const other = pointers.get(otherKey)!

				handlePinch(state, other)
			}
		})

		elem.addEventListener('wheel', (e) => {
			listeners.onzoom?.(-e.deltaY / 100, 'scroll')
		})
	}
}
