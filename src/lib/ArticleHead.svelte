<script>
	import Head from './Head.svelte'

	let {
		title,
		description,
		image = undefined,
		published,
		modified = published,
		section = null,
		tags = []
	} = $props()
</script>

<Head {title} {description} {image} />

<svelte:head>
	<meta property="article:author" content="Timothy Davis" />
	<meta property="article:published_time" content={published.toISOString()} />
	<meta property="article:modified_time" content={modified.toISOString()} />

	{#if section}
	<meta property="article:section" content={section} />
	{/if}

	{#each tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}
</svelte:head>
