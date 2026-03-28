<script lang="ts">
	import SketchCard from './SketchCard.svelte'

	let { data } = $props()
</script>

<main class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each data.sketches as sketch}
		<SketchCard {sketch} />
	{/each}
</main>
