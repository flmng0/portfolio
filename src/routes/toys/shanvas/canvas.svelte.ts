import { onMount } from 'svelte'
import { apiPath, token } from './api'

export type ControlMode = 'brush' | 'pan'
export const palette = ['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow']

export const canvas = $state({
	pixels: [] as number[],
	width: 0,
	height: 0,
	brush: 1,
	mode: 'pan' as ControlMode,
	offline: false
})

export function initCanvas(
	state: Uint8Array,
	config: { width: number; height: number; offline?: boolean }
) {
	canvas.pixels = Array.from(state)
	canvas.width = config.width
	canvas.height = config.height
	canvas.offline = config.offline ?? false

	if (canvas.offline) return

	onMount(() => {
		const eventSource = new EventSource(apiPath('/sse?token=' + token))

		eventSource.addEventListener('paint', (e) => {
			const { x, y, brush } = JSON.parse(e.data)
			const idx = x + y * canvas.width
			canvas.pixels[idx] = brush
		})
	})
}

export function paint(x: number, y: number) {
	const brush = canvas.brush
	const idx = x + y * canvas.width
	const oldPixel = canvas.pixels[idx]
	if (oldPixel === brush) {
		return
	}

	canvas.pixels[idx] = brush

	if (canvas.offline) return

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
