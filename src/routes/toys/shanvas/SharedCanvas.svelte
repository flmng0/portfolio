<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'
	import type { Attachment } from 'svelte/attachments'

	import { canvas, palette, paint } from './canvas.svelte'
	import { clamp } from '$lib/whimsy/math'

	const separatorThickness = 1
	const separatorColor = '#eee'
	const tileSize = 25
	const scale = tileSize + separatorThickness

	let pan = $state({ x: 0, y: 0 })
	let pointer = $state({ x: 0, y: 0 })

	let pannedX = $derived(pan.x + pointer.x)
	let pannedY = $derived(pan.y + pointer.y)

	let canvasWidth = $state<number>(0)
	let canvasHeight = $state<number>(0)

	let visibleWidth = $derived(1 + canvasWidth / scale)
	let visibleHeight = $derived(1 + canvasHeight / scale)

	function draw(ctx: CanvasRenderingContext2D, pixels: number[]) {
		ctx.fillStyle = separatorColor
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		for (let y = 0; y < visibleHeight; y++) {
			for (let x = 0; x < visibleWidth; x++) {
				const ix = x + Math.floor(pan.x / scale)
				const iy = y + Math.floor(pan.y / scale)
				const idx = ix + iy * canvas.width

				const offX = pan.x % scale
				const offY = pan.y % scale

				const rx = (x - 1) * separatorThickness + x * tileSize - offX
				const ry = (y - 1) * separatorThickness + y * tileSize - offY

				ctx.fillStyle = palette[pixels[idx]]

				ctx.fillRect(rx, ry, tileSize, tileSize)
			}
		}
	}

	function moveStylus(elem: HTMLElement, pointerX: number, pointerY: number) {
		const offX = pan.x % scale
		const offY = pan.y % scale

		const x = Math.floor((pointerX + offX) / scale) * scale - separatorThickness - offX
		const y = Math.floor((pointerY + offY) / scale) * scale - separatorThickness - offY

		elem.style.transform = `translate(${x}px, ${y}px)`
	}

	const stylus: Attachment<HTMLElement> = (elem) => {
		$effect(() => {
			moveStylus(elem, pointer.x, pointer.y)
		})
	}

	const renderPixels: Attachment<HTMLCanvasElement> = (cvs) => {
		const ctx = cvs.getContext('2d')!

		pan.x = (canvas.width * scale - canvasWidth) / 2
		pan.y = (canvas.height * scale - canvasHeight) / 2

		cvs.addEventListener('pointerdown', (e) => {
			pointer.x = e.clientX
			pointer.y = e.clientY
		})

		cvs.addEventListener('pointerup', (e) => {
			if (canvas.mode !== 'brush') return

			pointer.x = e.clientX
			pointer.y = e.clientY

			const tileX = Math.floor(pannedX / scale)
			const tileY = Math.floor(pannedY / scale)
			paint(tileX, tileY, canvas.brush)
		})

		cvs.addEventListener('pointermove', (e) => {
			const lastX = pointer.x
			const lastY = pointer.y

			pointer.x = e.clientX
			pointer.y = e.clientY

			const down = e.pointerType == 'mouse' ? e.buttons & 1 : e.pointerId !== -1
			if (!down) return

			switch (canvas.mode) {
				case 'brush':
					const tileX = Math.floor(pannedX / scale)
					const tileY = Math.floor(pannedY / scale)
					paint(tileX, tileY, canvas.brush)
					break

				case 'pan':
					const dx = lastX - pointer.x
					const dy = lastY - pointer.y

					pan.x = clamp(pan.x + dx, 0, scale * canvas.width - canvasWidth)
					pan.y = clamp(pan.y + dy, 0, scale * canvas.height - canvasHeight)

					break
			}
		})

		const redraw = () => draw(ctx, canvas.pixels)

		$effect(() => redraw())

		$effect(() => {
			window.addEventListener('resize', redraw)
			window.addEventListener('focus', redraw)

			return () => {
				window.removeEventListener('resize', redraw)
				window.removeEventListener('focus', redraw)
			}
		})
	}
</script>

<canvas
	bind:clientWidth={canvasWidth}
	bind:clientHeight={canvasHeight}
	class="fixed inset-0 size-full touch-none"
	{@attach autoSizeCanvas}
	{@attach renderPixels}
></canvas>

<div
	class="pointer-events-none fixed top-0 left-0 z-1 outline"
	style:width="{tileSize}px"
	style:height="{tileSize}px"
	{@attach stylus}
></div>
