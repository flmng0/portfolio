<script>
	let { data, buttons } = $props()

	const format = new Intl.DateTimeFormat('en-AU', {
		dateStyle: 'medium'
	})
	function dateString(/** @type {Date} */ date) {
		return format.format(date)
	}
</script>

<article class="row-span-4 grid h-full grid-rows-subgrid flex-col gap-x-2 gap-y-1">
	<h2 class="font-mono text-xl">{data.title}</h2>

	<div
		class="text-right font-mono text-sm text-neutral-600"
		class:hidden={data.published === undefined}
	>
		{#if data.published}
			<time>{dateString(data.published)}</time>
			{#if data.modified}
				<time>{dateString(data.modified)}</time>
			{/if}
		{/if}
	</div>

	<p class="flex-grow text-neutral-700">{data.description}</p>

	<footer class="flex flex-wrap justify-end gap-2 font-mono text-sm md:mt-8">
		{@render buttons()}
	</footer>
</article>
