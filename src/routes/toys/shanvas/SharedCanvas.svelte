<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'
	import type { Attachment } from 'svelte/attachments'
	import PaintBrush from './PaintBrush.svelte'

	import { canvas, paint } from './canvas.svelte'

	const palette = ['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow']

	let brush = $state(1)
	let canvasElement = $state<HTMLCanvasElement>()
	let tileWidth = $derived((canvasElement?.width || 0) / canvas.width)
	let tileHeight = $derived((canvasElement?.height || 0) / canvas.height)

	function draw(ctx: CanvasRenderingContext2D, pixels: number[]) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				const idx = x + y * canvas.width

				ctx.fillStyle = palette[pixels[idx]]
				ctx.fillRect(tileWidth * x, tileHeight * y, tileWidth, tileHeight)
			}
		}
	}

	let pointer = $state({
		down: false,
		inside: false,
		x: 0,
		y: 0
	})

	function moveStylus(elem: HTMLElement, pointerX: number, pointerY: number) {
		elem.style.width = tileWidth + 'px'
		elem.style.height = tileHeight + 'px'

		const x = Math.floor(pointerX / tileWidth)
		const y = Math.floor(pointerY / tileHeight)

		elem.style.display = pointer.inside ? 'block' : 'none'

		elem.style.transform = `translate(${x * tileWidth}px, ${y * tileHeight}px)`
	}

	const stylus: Attachment<HTMLElement> = (elem) => {
		$effect(() => {
			moveStylus(elem, pointer.x, pointer.y)
		})
	}

	const renderPixels: Attachment<HTMLCanvasElement> = (cvs) => {
		const ctx = cvs.getContext('2d')!

		$effect(() => {
			if (!pointer.down || !pointer.inside) {
				return
			}

			const tileX = Math.floor(pointer.x / tileWidth)
			const tileY = Math.floor(pointer.y / tileHeight)
			paint(tileX, tileY, brush)
		})

		$effect(() => {
			draw(ctx, canvas.pixels)
		})
	}
</script>

<svelte:window
	onpointerdown={() => (pointer.down = true)}
	onpointerup={() => (pointer.down = false)}
/>

<div class="flex items-center justify-center gap-x-2">
	<PaintBrush paintColor={palette[brush]} class="size-10" />

	{#each palette as b, i}
		<button
			class={[
				'btn aspect-square size-6 hover:-translate-0.5 md:size-10',
				brush == i && 'shadow-solid'
			]}
			onclick={() => (brush = i)}
		>
			<span class="hidden">Select {b} color</span>
			<div class="size-full" style:background-color={b}></div>
		</button>
	{/each}
</div>

<div class="relative">
	<canvas
		bind:this={canvasElement}
		style:aspect-ratio="{canvas.width}/{canvas.height}"
		class="touch-action-none mt-4 h-auto max-h-screen w-full outline outline-neutral-300"
		onpointerleave={() => (pointer.inside = false)}
		onpointermove={(e) => {
			pointer.inside = true
			pointer.x = e.offsetX
			pointer.y = e.offsetY
		}}
		{@attach autoSizeCanvas}
		{@attach renderPixels}
	></canvas>

	<div class="pointer-events-none absolute top-0 left-0 outline" {@attach stylus}></div>
</div>
