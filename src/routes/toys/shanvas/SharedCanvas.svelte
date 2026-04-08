<script>
	import { autoSizeCanvas, gesturable } from '$lib/attachments.svelte'

	import { canvas, paint } from './canvas.svelte'
	import { clamp } from '$lib/whimsy/math'
	import { onMount } from 'svelte'

	const separatorColor = '#eee'
	let zoom = $state(1.0)
	const tileSize = $derived(25 * zoom)
	const separatorThickness = $derived(2 * zoom)
	const scale = $derived(tileSize + separatorThickness)

	// Relative to the center of the screen
	let centerPan = $state({ x: 0, y: 0 })
	let canvasWidth = $state(0)
	let canvasHeight = $state(0)

	let originPan = $derived({
		x: centerPan.x - canvasWidth / scale / 2,
		y: centerPan.y - canvasHeight / scale / 2
	})

	let stylusX = $state(0)
	let stylusY = $state(0)

	let visibleWidth = $derived(1 + canvasWidth / scale)
	let visibleHeight = $derived(1 + canvasHeight / scale)

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number[]} pixels
	 */
	function draw(ctx, pixels) {
		ctx.fillStyle = separatorColor
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		for (let y = 0; y < visibleHeight; y++) {
			for (let x = 0; x < visibleWidth; x++) {
				const px = Math.floor(originPan.x)
				const py = Math.floor(originPan.y)

				const ix = x + px
				const iy = y + py
				const idx = ix + iy * canvas.width

				const offX = (originPan.x - px) * scale
				const offY = (originPan.y - py) * scale

				const rx = (x - 1) * separatorThickness + x * tileSize - offX
				const ry = (y - 1) * separatorThickness + y * tileSize - offY

				ctx.fillStyle = canvas.palette[pixels[idx]]

				ctx.fillRect(rx, ry, tileSize, tileSize)
			}
		}
	}

	/** @type {import('svelte/attachments').Attachment<HTMLElement>} */
	const stylus = (elem) => {
		$effect(() => {
			const x = (stylusX - originPan.x) * scale - separatorThickness
			const y = (stylusY - originPan.y) * scale - separatorThickness
			elem.style.transform = `translate(${x}px, ${y}px)`
		})
	}

	/**
	 * @param {number} pointerX
	 * @param {number} pointerY
	 */
	const getTilePoint = (pointerX, pointerY) => {
		const tileX = Math.floor(pointerX / scale + originPan.x)
		const tileY = Math.floor(pointerY / scale + originPan.y)

		return [tileX, tileY]
	}

	/**
	 * @param {PointerEvent} e
	 */
	const handlePointer = (e) => {
		const [tileX, tileY] = getTilePoint(e.clientX, e.clientY)
		stylusX = tileX
		stylusY = tileY

		const doPaint =
			canvas.mode === 'brush' &&
			(e.type === 'pointerup' || (e.pointerType === 'mouse' ? e.buttons & 1 : e.pointerId !== -1))

		if (!doPaint) return

		paint(tileX, tileY)
	}

	/** @type {import('svelte/attachments').Attachment<HTMLCanvasElement>} */
	const renderPixels = (cvs) => {
		const ctx = cvs.getContext('2d')
		if (ctx === null) {
			throw new Error('Failed to get 2D context for canvas!')
		}

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
		centerPan.x = canvas.width / 2
		centerPan.y = canvas.height / 2
		stylusX = Math.round(canvas.width / 2)
		stylusY = Math.round(canvas.height / 2)
	})

	/**
	 * @param {number} dx
	 * @param {number} dy
	 */
	function onpan(dx, dy) {
		if (canvas.mode !== 'pan') return

		const newX = centerPan.x + dx / scale
		const newY = centerPan.y + dy / scale

		const cx = canvasWidth / 2 / scale
		centerPan.x = clamp(newX, cx, canvas.width - cx)

		const cy = canvasHeight / 2 / scale
		centerPan.y = clamp(newY, cy, canvas.height - cy)
	}

	/**
	 * @param {number} dz
	 * @param {"pinch" | "scroll"} source
	 */
	function onzoom(dz, source) {
		if (source == 'pinch' && canvas.mode !== 'pan') return
		// TODO: Zoom into center
		zoom = clamp(zoom + dz, 0.5, 1.7)
	}
</script>

<span class="fixed top-4 right-4 z-10">{stylusX}, {stylusY}</span>

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
