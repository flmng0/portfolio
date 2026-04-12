import { onMount } from 'svelte'
import { apiPath, token } from './api'

export type ControlMode = 'brush' | 'pan'

export const canvas = $state({
	pixels: [] as number[],
	palette: [] as string[],
	width: 0,
	height: 0,
	brush: 1,
	offline: false
})

export function initCanvas(
	state: Uint8Array,
	config: { width: number; height: number; offline?: boolean; palette: string[] }
) {
	canvas.pixels = Array.from(state)
	canvas.width = config.width
	canvas.height = config.height
	canvas.palette = config.palette
	canvas.offline = config.offline ?? false

	if (canvas.offline) return

	onMount(() => {
		const eventSource = new EventSource(apiPath('/sse?token=' + token))

		document.addEventListener('visibilitychange', (e) => {
			if (document.visibilityState === 'hidden') {
				return
			}

			console.log('Visibility returned, refreshing pixels!')

			// refresh pixels from API
			//
			// TODO: Consider a /diff endpoint which can use the "lastEventId"
			// of the event source.
			fetch(apiPath('/'), {
				headers: { Authorization: 'Bearer ' + token }
			})
				.then((res) => res.blob())
				.then((blob) => blob.bytes())
				.then((bytes) => {
					canvas.pixels = Array.from(bytes)
				})
		})

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

export async function getPngData() {
	const resp = await fetch(apiPath('/image'), {
		headers: { Authorization: 'Bearer ' + token }
	})

	if (!resp.ok) {
		throw new Error('Failed to get image')
	}

	const blob = await resp.blob()
	return URL.createObjectURL(blob)
}
