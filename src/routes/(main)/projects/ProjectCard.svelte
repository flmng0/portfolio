<script>
	import ExternalLink from '$lib/icons/ExternalLink.svelte'
	import GitHub from '$lib/icons/GitHub.svelte'

	let { project } = $props()
	const linkClasses = 'btn btn-lift px-3 py-2'
</script>

<article class="flex h-full flex-col">
	<h2 class="mb-2 font-mono text-xl">{project.title}</h2>

	<p class="h-full text-neutral-700">{project.description}</p>

	<footer class="mt-8 flex flex-wrap justify-end gap-2">
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
		{#if project.post}
			<a class="{linkClasses} btn-read" href="/projects/{project.slug}">Read More</a>
		{/if}
	</footer>
</article>

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
