<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'
	import type { Attachment } from 'svelte/attachments'

	const palette = ['white', 'black', 'red', 'green', 'blue', 'cyan', 'magenta', 'yellow']

	let brush = $state(0)
	const SCALE = 8
	const W = SCALE * 16
	const H = SCALE * 9

	let pixels = $state(Array.from({ length: W * H }, () => 0))

	function draw(ctx: CanvasRenderingContext2D, pixels: number[]) {
		const tileW = ctx.canvas.width / W
		const tileH = ctx.canvas.height / H

		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const idx = x + W * y
				ctx.fillStyle = palette[pixels[idx]]
				ctx.fillRect(tileW * x, tileH * y, tileW, tileH)
			}
		}
	}

	function paint(ctx: CanvasRenderingContext2D, x: number, y: number) {
		const tileW = ctx.canvas.width / W
		const tileH = ctx.canvas.height / H

		const tileX = Math.floor(x / tileW)
		const tileY = Math.floor(y / tileH)
		const idx = tileX + W * tileY

		pixels[idx] = brush
	}

	let pointer = $state({
		down: false,
		x: 0,
		y: 0
	})

	const renderPixels: Attachment<HTMLCanvasElement> = (cvs) => {
		const ctx = cvs.getContext('2d')!

		$effect(() => {
			if (!pointer.down) {
				return
			}

			paint(ctx, pointer.x, pointer.y)
		})

		$effect(() => {
			draw(ctx, pixels)
		})
	}
</script>

<div class="flex justify-center gap-x-2">
	{#each palette as b, i}
		<button class="btn btn-lift" onclick={() => (brush = i)}>
			<span class="hidden">Select {b} color</span>
			<div class="size-10" style:background-color={b}></div>
		</button>
	{/each}
</div>

<canvas
	class="mt-4 aspect-16/9 h-auto max-h-screen w-full outline outline-neutral-300"
	onpointermove={(e) => {
		pointer.x = e.offsetX
		pointer.y = e.offsetY
	}}
	onpointerdown={() => (pointer.down = true)}
	onpointerup={() => (pointer.down = false)}
	{@attach autoSizeCanvas}
	{@attach renderPixels}
></canvas>
