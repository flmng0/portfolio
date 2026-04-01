import { onMount } from 'svelte'
import { apiPath } from './api'

export const canvas = $state({
	pixels: [] as number[],
	width: 0,
	height: 0
})

export function initCanvas(
	token: string,
	state: Uint8Array,
	config: { width: number; height: number }
) {
	canvas.pixels = Array.from(state)
	canvas.width = config.width
	canvas.height = config.height

	onMount(() => {
		const eventSource = new EventSource(apiPath('/sse?token=' + token))

		eventSource.addEventListener('paint', (e) => {
			const { x, y, brush } = JSON.parse(e.data)
			const idx = x + y * canvas.width
			canvas.pixels[idx] = brush
		})
	})
}

export function paint(x: number, y: number, brush: number) {
	const idx = x + y * canvas.width
	const oldPixel = canvas.pixels[idx]
	canvas.pixels[idx] = brush

	fetch(apiPath('/'), {
		body: JSON.stringify({ x, y, brush }),
		method: 'PATCH',
		headers: { Authorization: 'Bearer ' + token }
	}).then((res) => {
		if (!res.ok) {
			canvas.pixels[idx] = oldPixel
		}
	})
}
