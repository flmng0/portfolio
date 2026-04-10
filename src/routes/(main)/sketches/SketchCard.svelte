<script>
	import PostCard from '$lib/PostCard.svelte'

	let { sketch } = $props()
</script>

<PostCard data={sketch.data}>
	{#snippet buttons()}
		<a class="btn btn-visit-sketch btn-lift px-3 py-2" href="/sketches/{sketch.slug}">
			Visit Sketch
		</a>
	{/snippet}
</PostCard>

<style>
	.btn-visit-sketch {
		--btn-color: oklab(0.12 0 0);
		--btn-bg: oklab(0.99 0.01 -0.02);
		--btn-shadow-color: oklab(0.89 0.01 -0.02);
	}
</style>
