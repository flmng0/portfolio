import { onMount } from 'svelte'

export const canvas = $state({
	pixels: [] as number[],
	width: 0,
	height: 0
})

export function initCanvas(state: Uint8Array, config: { width: number; height: number }) {
	canvas.pixels = Array.from(state)
	canvas.width = config.width
	canvas.height = config.height

	onMount(() => {
		const eventSource = new EventSource('/api/shanvas/sse')

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

	fetch('/api/shanvas', {
		body: JSON.stringify({ x, y, brush }),
		method: 'PATCH'
	}).then((res) => {
		if (!res.ok) {
			canvas.pixels[idx] = oldPixel
		}
	})
}
