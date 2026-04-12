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

		let dx, dy
		if (previous !== undefined) {
			dx = previous.x - e.clientX
			dy = previous.y - e.clientY
		} else {
			dx = e.clientX
			dy = e.clientY
		}

		let state = {
			x: e.clientX,
			y: e.clientY,
			lastX: previous?.x ?? e.clientX,
			lastY: previous?.y ?? e.clientY,
			startX: previous?.startX ?? e.clientX,
			startY: previous?.startY ?? e.clientY,
			dx,
			dy,
			down
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

		listeners.onzoom?.(diffDistance / 200)
	}

	/** @type {import('svelte/attachments').Attachment<HTMLElement>} */
	return (elem) => {
		let didPan = false
		let didPinch = false

		elem.addEventListener('pointerdown', (e) => {
			updatePointer(e)
		})
		elem.addEventListener('pointerup', (e) => {
			pointers.delete(e.pointerId)

			if (pointers.size == 0) {
				if (didPan || didPinch) {
					didPan = false
					didPinch = false
					return
				}

				listeners.ontap?.(e.clientX, e.clientY)
			}
		})

		elem.addEventListener('pointermove', (e) => {
			const state = updatePointer(e)

			if (pointers.size === 1 && state.down) {
				listeners.onpan?.(state.dx, state.dy)
				didPan = didPan || dist([state.startX, state.startY], [state.x, state.y]) > 10
			} else if (pointers.size === 2) {
				const otherKey = pointers.keys().find((k) => k !== e.pointerId)
				const other = pointers.get(otherKey)

				handlePinch(state, other)
				didPinch = true
			}
		})

		elem.addEventListener('wheel', (e) => {
			listeners.onzoom?.(-e.deltaY / 100)
		})
	}
}
