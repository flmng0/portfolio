<script>
	import { sketches } from '$content'
	import Head from '$lib/Head.svelte'
	import SketchCard from './SketchCard.svelte'
</script>

<Head
	title="Sketches | timd.dev"
	description="Fun creative coding sketches developed by Tim Davis."
/>

<main class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each sketches.entries as sketch}
		<SketchCard {sketch} />
	{/each}
</main>
