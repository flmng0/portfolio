<script>
	import Move from '$lib/icons/Move.svelte'
	import ControlButton from './ControlButton.svelte'
	import PaintBrush from './PaintBrush.svelte'
	import { canvas, palette } from './canvas.svelte'

	/**
	 * @param {import('./canvas.svelte').ControlMode} mode
	 */
	const modeButtonProps = (mode) => ({
		onclick: () => (canvas.mode = mode),
		current: canvas.mode === mode,
		class: 'bg-neutral-100'
	})
</script>

<div
	class={[
		'fixed z-5 flex items-center gap-6 bg-neutral-300 p-4 shadow-sm',
		'landscape:top-2 landscape:left-1/2 landscape:-translate-x-1/2',
		'portrait:top-1/2 portrait:left-2 portrait:-translate-y-1/2 portrait:flex-col'
	]}
>
	<!-- <ControlButton {...modeButtonProps('brush')}> -->
	<!-- 	<PaintBrush paintColor={palette[canvas.brush]} class="size-6" /> -->
	<!-- </ControlButton> -->
	<ControlButton {...modeButtonProps('pan')}>
		<Move class="size-6" />
	</ControlButton>

	<div class="flex gap-2 portrait:flex-col">
		{#each palette as color, brush}
			<ControlButton
				onclick={() => {
					canvas.mode = 'brush'
					canvas.brush = brush
				}}
				current={canvas.mode == 'brush' && canvas.brush === brush}
			>
				<div style:background-color={color} class="size-full"></div>
				<span class="hidden">{color}</span>
			</ControlButton>
		{/each}
	</div>

	{#if canvas.mode == 'brush'}
		<PaintBrush paintColor={palette[canvas.brush]} class="size-6" />
	{:else if canvas.mode == 'pan'}
		<Move class="size-6" />
	{/if}
</div>
