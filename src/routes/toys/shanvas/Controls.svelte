<script>
	import ControlButton from './ControlButton.svelte'
	import PaintBrush from './PaintBrush.svelte'
	import { canvas } from './canvas.svelte'
</script>

<div
	class={[
		'fixed z-5 flex items-center justify-between gap-4 bg-neutral-300 p-1 py-2 shadow-sm md:gap-6 md:p-4',
		'landscape:top-2 landscape:left-1/2 landscape:-translate-x-1/2',
		'portrait:top-1/2 portrait:left-2 portrait:-translate-y-1/2 portrait:flex-col'
	]}
>
	<div class="flex gap-1 overflow-auto md:gap-2 portrait:flex-col">
		{#each canvas.palette as color, brush}
			<ControlButton onclick={() => (canvas.brush = brush)} current={canvas.brush === brush}>
				<div style:background-color={color} class="size-full"></div>
				<span class="hidden">{color}</span>
			</ControlButton>
		{/each}
	</div>

	<PaintBrush paintColor={canvas.palette[canvas.brush]} class="size-6" />
</div>
