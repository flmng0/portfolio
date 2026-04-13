<script>
	// @ts-nocheck

	import { autoSizeCanvas } from '$lib/attachments.svelte'

	const TILE_COLUMNS = 200
	const TILE_ROWS = 200
	const TILE_SIZE = 20

	let stylusPosition = $state({ x: 0, y: 0 })

	function getTilePoint(offsetX, offsetY) {
		const tileX = Math.floor(offsetX / TILE_SIZE)
		const tileY = Math.floor(offsetY / TILE_SIZE)

		return [tileX, tileY]
	}

	function drawTiles(context) {
		const { width, height } = context.canvas

		const visibleColumns = Math.ceil(width / TILE_SIZE)
		const visibleRows = Math.ceil(height / TILE_SIZE)

		for (let y = 0; y < visibleRows; y++) {
			for (let x = 0; x < visibleColumns; x++) {
				let fillColor = 'white'
				if (stylusPosition.x === x && stylusPosition.y === y) {
					fillColor = 'yellow'
				}

				context.fillStyle = fillColor
				context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
				context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
			}
		}
	}

	function tileDrawer(cvs) {
		const context = cvs.getContext('2d')
		drawTiles(context)

		cvs.addEventListener('pointermove', (e) => {
			const [tileX, tileY] = getTilePoint(e.offsetX, e.offsetY)
			stylusPosition.x = tileX
			stylusPosition.y = tileY

			drawTiles(context)
		})
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
