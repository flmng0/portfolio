<script>
	let { sketch } = $props()
</script>

<article class="flex h-full flex-col gap-y-2">
	<h2 class="font-mono text-xl">{sketch.title}</h2>
	<p class="flex-grow text-neutral-700">{sketch.description}</p>

	<footer class="mt-4 flex flex-wrap justify-end gap-2 font-mono text-sm md:mt-8">
		<a class="btn btn-visit-sketch btn-lift px-3 py-2" href="/sketches/{sketch.slug}">
			Visit Sketch
		</a>
	</footer>
</article>

<style>
	.btn-visit-sketch {
		--btn-color: oklab(0.12 0 0);
		--btn-bg: oklab(0.99 0.01 -0.02);
		--btn-shadow-color: oklab(0.89 0.01 -0.02);
	}
</style>
