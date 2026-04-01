<script lang="ts">
	import Move from '$lib/icons/Move.svelte'
	import ControlButton from './ControlButton.svelte'
	import PaintBrush from './PaintBrush.svelte'
	import { canvas, palette, type ControlMode } from './canvas.svelte'

	const modeButtonProps = (mode: ControlMode) => ({
		onclick: () => (canvas.mode = mode),
		current: canvas.mode === mode,
		class: 'bg-neutral-100'
	})
</script>

<div class="fixed top-2 left-1/2 z-5 flex -translate-x-1/2 gap-8 bg-neutral-300 p-4 shadow-sm">
	<ControlButton {...modeButtonProps('brush')}>
		<PaintBrush paintColor={palette[canvas.brush]} class="size-6" />
	</ControlButton>
	<ControlButton {...modeButtonProps('pan')}>
		<Move class="size-6" />
	</ControlButton>

	<div class="flex gap-2">
		{#each palette as color, brush}
			<ControlButton onclick={() => (canvas.brush = brush)} current={canvas.brush === brush}>
				<div style:background-color={color} class="size-full"></div>
				<span class="hidden">{color}</span>
			</ControlButton>
		{/each}
	</div>
</div>
