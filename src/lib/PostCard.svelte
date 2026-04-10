<script>
	let { data, buttons } = $props()

	const format = new Intl.DateTimeFormat('en-AU', {
		dateStyle: 'medium'
	})
	function dateString(/** @type {Date} */ date) {
		return format.format(date)
	}
</script>

<article class="flex h-full flex-col gap-x-2">
	<h2 class="font-mono text-xl">{data.title}</h2>

	{#if data.published}
		<div class="mb-3 text-right font-mono text-sm text-neutral-600">
			<time>{dateString(data.published)}</time>
			{#if data.modified}
				<time>{dateString(data.modified)}</time>
			{/if}
		</div>
	{/if}

	<p class="flex-grow text-neutral-700">{data.description}</p>

	<footer class="mt-4 flex flex-wrap justify-end gap-2 font-mono text-sm md:mt-8">
		{@render buttons()}
	</footer>
</article>
