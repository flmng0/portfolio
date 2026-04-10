<script>
	let { title, description, buttons } = $props()
</script>

<article class="flex h-full flex-col gap-x-2">
	<h2 class="font-mono text-xl">{title}</h2>
	<p class="flex-grow text-neutral-700">{description}</p>

	<footer class="mt-4 flex flex-wrap justify-end gap-2 font-mono text-sm md:mt-8">
		{@render buttons()}
	</footer>
</article>
