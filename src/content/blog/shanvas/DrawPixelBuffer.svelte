<script>
	let { enableDraw = false, initPixel = () => 0 } = $props()

	const TILE_COLUMNS = 200
	const TILE_ROWS = 200
	const TILE_SIZE = 20

	const colors = ['white', 'black']

	const pixels = $state(
		Array.from({ length: TILE_COLUMNS * TILE_ROWS }, (_, index) => initPixel(index))
	)

	function drawTiles(
		/** @type {CanvasRenderingContext2D} */ context,
		/** @type {number[]} */ pixels
	) {
		const { width, height } = context.canvas

		const visibleColumns = Math.ceil(width / TILE_SIZE)
		const visibleRows = Math.ceil(height / TILE_SIZE)

		for (let y = 0; y < visibleRows; y++) {
			for (let x = 0; x < visibleColumns; x++) {
				const pixelIndex = x + y * TILE_COLUMNS
				const colorIndex = pixels[pixelIndex]

				context.fillStyle = colors[colorIndex]

				context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
			}
		}
	}

	function getTilePoint(/** @type {number} */ x, /** @type {number} */ y) {
		const tileX = Math.floor(x / TILE_SIZE)
		const tileY = Math.floor(y / TILE_SIZE)

		return /** @type {[number, number]} */ ([tileX, tileY])
	}

	function onclick(/** @type {MouseEvent} */ e) {
		const [x, y] = getTilePoint(e.offsetX, e.offsetY)
		const index = x + y * TILE_COLUMNS
		pixels[index] = 1
	}

	/** @type {(cvs: HTMLCanvasElement) => void} */
	function tileDrawer(cvs) {
		const context = cvs.getContext('2d')

		if (context === null) return

		$effect(() => {
			drawTiles(context, pixels)
		})
	}
</script>

<div class="flex w-full justify-center px-4">
	<canvas
		class="aspect-square h-auto w-full max-w-[500px] border"
		onclick={enableDraw ? onclick : null}
		width="500"
		height="500"
		{@attach tileDrawer}
	></canvas>
</div>
