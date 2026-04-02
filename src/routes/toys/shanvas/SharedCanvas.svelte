<script lang="ts">
	import { autoSizeCanvas, gesturable } from '$lib/attachments.svelte'
	import type { Attachment } from 'svelte/attachments'

	import { canvas, palette, paint } from './canvas.svelte'
	import { clamp } from '$lib/whimsy/math'
	import { onMount } from 'svelte'

	const separatorColor = '#eee'
	let zoom = $state(1.0)
	const tileSize = $derived(25 * zoom)
	const separatorThickness = $derived(2 * zoom)
	const scale = $derived(tileSize + separatorThickness)

	let pan = $state({ x: 0, y: 0 })
	let stylusX = $state(0)
	let stylusY = $state(0)

	let canvasWidth = $state<number>(0)
	let canvasHeight = $state<number>(0)

	let visibleWidth = $derived(1 + canvasWidth / scale)
	let visibleHeight = $derived(1 + canvasHeight / scale)

	function draw(ctx: CanvasRenderingContext2D, pixels: number[]) {
		ctx.fillStyle = separatorColor
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		for (let y = 0; y < visibleHeight; y++) {
			for (let x = 0; x < visibleWidth; x++) {
				const px = Math.floor(pan.x)
				const py = Math.floor(pan.y)

				const ix = x + px
				const iy = y + py
				const idx = ix + iy * canvas.width

				const offX = (pan.x - px) * scale
				const offY = (pan.y - py) * scale

				const rx = (x - 1) * separatorThickness + x * tileSize - offX
				const ry = (y - 1) * separatorThickness + y * tileSize - offY

				ctx.fillStyle = palette[pixels[idx]]

				ctx.fillRect(rx, ry, tileSize, tileSize)
			}
		}
	}

	const stylus: Attachment<HTMLElement> = (elem) => {
		$effect(() => {
			const x = (stylusX - pan.x) * scale - separatorThickness
			const y = (stylusY - pan.y) * scale - separatorThickness
			elem.style.transform = `translate(${x}px, ${y}px)`
		})
	}

	const getTilePoint = (pointerX: number, pointerY: number) => {
		const tileX = Math.floor(pointerX / scale + pan.x)
		const tileY = Math.floor(pointerY / scale + pan.y)

		return [tileX, tileY]
	}

	const handlePointer = (e: PointerEvent) => {
		const [tileX, tileY] = getTilePoint(e.clientX, e.clientY)
		stylusX = tileX
		stylusY = tileY

		const doPaint =
			canvas.mode === 'brush' &&
			(e.type === 'pointerup' || (e.pointerType === 'mouse' ? e.buttons & 1 : e.pointerId !== -1))

		if (!doPaint) return

		paint(tileX, tileY)
	}

	const renderPixels: Attachment<HTMLCanvasElement> = (cvs) => {
		const ctx = cvs.getContext('2d')!

		const redraw = () => draw(ctx, canvas.pixels)

		redraw()

		$effect(() => {
			window.addEventListener('resize', redraw)
			window.addEventListener('focus', redraw)

			return () => {
				window.removeEventListener('resize', redraw)
				window.removeEventListener('focus', redraw)
			}
		})
	}

	onMount(() => {
		pan.x = (canvas.width - canvasWidth / scale) / 2
		pan.y = (canvas.height - canvasHeight / scale) / 2
	})

	function onpan(dx: number, dy: number) {
		if (canvas.mode !== 'pan') return
		pan.x = clamp(pan.x + dx / scale, 0, canvas.width - canvasWidth / scale)
		pan.y = clamp(pan.y + dy / scale, 0, canvas.height - canvasHeight / scale)
	}

	function onzoom(dz: number, source: 'scroll' | 'pinch') {
		if (source == 'pinch' && canvas.mode !== 'pan') return
		zoom = clamp(zoom + dz, 0.5, 1.7)
	}
</script>

<canvas
	bind:clientWidth={canvasWidth}
	bind:clientHeight={canvasHeight}
	onpointermove={handlePointer}
	onpointerup={handlePointer}
	class="fixed inset-0 size-full touch-none"
	{@attach autoSizeCanvas}
	{@attach renderPixels}
	{@attach gesturable({ onpan, onzoom })}
></canvas>

<div
	class="pointer-events-none fixed top-0 left-0 z-1 outline"
	style:width="{tileSize}px"
	style:height="{tileSize}px"
	{@attach stylus}
></div>
