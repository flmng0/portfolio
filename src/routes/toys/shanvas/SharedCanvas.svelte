<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'
	import type { Attachment } from 'svelte/attachments'
	import PaintBrush from './PaintBrush.svelte'

	let { pixels, config, onpaint } = $props()

	const palette = ['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow']

	let brush = $state(1)
	let canvas = $state<HTMLCanvasElement>()

	let w = $derived(config.width)
	let h = $derived(config.height)

	function draw(ctx: CanvasRenderingContext2D, pixels: number[]) {
		const tileW = ctx.canvas.width / w
		const tileH = ctx.canvas.height / h

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const idx = x + w * y
				ctx.fillStyle = palette[pixels[idx]]
				ctx.fillRect(tileW * x, tileH * y, tileW, tileH)
			}
		}
	}

	function paint(ctx: CanvasRenderingContext2D, x: number, y: number) {
		const tileW = ctx.canvas.width / w
		const tileH = ctx.canvas.height / h

		const tileX = Math.floor(x / tileW)
		const tileY = Math.floor(y / tileH)

		onpaint(tileX, tileY, brush)
		ctx.fillStyle = palette[brush]
		ctx.fillRect(tileX * tileW, tileY * tileH, tileW, tileH)
	}

	let pointer = $state({
		down: false,
		inside: false,
		x: 0,
		y: 0
	})

	function moveStylus(elem: HTMLElement, pointerX: number, pointerY: number) {
		const tileWidth = canvas!.width / w
		const tileHeight = canvas!.height / h
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

			paint(ctx, pointer.x, pointer.y)
		})

		$effect(() => {
			draw(ctx, pixels)
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
		bind:this={canvas}
		style:aspect-ratio="{config.width}/{config.height}"
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
