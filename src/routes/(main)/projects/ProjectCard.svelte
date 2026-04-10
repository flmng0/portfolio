<script>
	import ExternalLink from '$lib/icons/ExternalLink.svelte'
	import GitHub from '$lib/icons/GitHub.svelte'
	import PostCard from '$lib/PostCard.svelte'

	let { project } = $props()
	const linkClasses = 'btn btn-lift px-3 py-2'
</script>

<PostCard title={project.title} description={project.description}>
	{#snippet buttons()}
		{#if project.source}
			<a class="{linkClasses} btn-github" href={project.source} target="_blank">
				<span>Source Code</span>
				<GitHub class="inline-block size-4" />
			</a>
		{/if}
		{#if project.link}
			<a class="{linkClasses} btn-visit" href={project.link} target="_blank">
				<span>Visit</span>
				<ExternalLink class="inline-block size-4" />
			</a>
		{/if}
		{#if project.postSlug}
			<a class="{linkClasses} btn-read" href="/blog/{project.postSlug}">Read More</a>
		{/if}
	{/snippet}
</PostCard>

<style>
	.btn-visit {
		--btn-color: oklab(0.12 0 0);
		--btn-bg: oklab(0.99 0.01 -0.02);
		--btn-shadow-color: oklab(0.89 0.01 -0.02);
	}

	.btn-read {
		--btn-color: white;
		--btn-bg: oklab(0.42 0.047 -0.078);
		--btn-shadow-color: oklab(0.32 0.047 -0.078);
	}
</style>
