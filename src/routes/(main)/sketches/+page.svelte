<script>
	import { sketches } from '$content'
	import SketchCard from './SketchCard.svelte'
</script>

<svelte:head>
	<title>Sketches | timd.dev</title>
	<meta name="description" content="Fun creative coding toys (sketches) developed by Tim Davis." />
</svelte:head>

<main class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each sketches.entries as sketch}
		<SketchCard {sketch} />
	{/each}
</main>
