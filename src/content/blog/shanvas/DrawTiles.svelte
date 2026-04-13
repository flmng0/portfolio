<script>
	// @ts-nocheck

	import { autoSizeCanvas } from '$lib/attachments.svelte'

	const TILE_COLUMNS = 200
	const TILE_ROWS = 200
	const TILE_SIZE = 20

	function drawTiles(context) {
		const { width, height } = context.canvas

		const visibleColumns = Math.ceil(width / TILE_SIZE)
		const visibleRows = Math.ceil(height / TILE_SIZE)

		for (let y = 0; y < visibleRows; y++) {
			for (let x = 0; x < visibleColumns; x++) {
				const hue = x * 5 + y * visibleColumns

				context.fillStyle = `hsl(${hue}, 100%, 50%)`
				context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
				context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
			}
		}
	}

	function tileDrawer(cvs) {
		const context = cvs.getContext('2d')
		drawTiles(context)
	}
</script>

<div class="flex w-full justify-center px-4">
	<canvas
		class="aspect-square h-auto w-full max-w-[500px] border"
		width="500"
		height="500"
		{@attach tileDrawer}
	></canvas>
</div>
