import { dist } from '$lib/whimsy/math'

export default function gesturable(listeners) {
	const pointers = new Map()

	/**
	 * @param {PointerEvent} e
	 */
	const updatePointer = (e) => {
		const previous = pointers.get(e.pointerId)

		let down
		if (e.type === 'pointerdown') {
			down = true
		} else if (e.type === 'pointerup') {
			down = false
		} else {
			down = previous?.down ?? false
		}

		let state
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

	/**
	 * @param {import('./gesturable.svelte').PointerState} a
	 * @param {import('./gesturable.svelte').PointerState} b
	 */
	const handlePinch = (a, b) => {
		const previousDistance = dist([a.lastX, a.lastY], [b.lastX, b.lastY])
		const newDistance = dist([a.x, a.y], [b.x, b.y])

		const diffDistance = newDistance - previousDistance

		listeners.onzoom?.(diffDistance / 200, 'pinch')
	}

	/** @type {import('svelte/attachments').Attachment<HTMLElement>} */
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
				const otherKey = pointers.keys().find((k) => k !== e.pointerId)
				const other = pointers.get(otherKey)

				handlePinch(state, other)
			}
		})

		elem.addEventListener('wheel', (e) => {
			listeners.onzoom?.(-e.deltaY / 100, 'scroll')
		})
	}
}
