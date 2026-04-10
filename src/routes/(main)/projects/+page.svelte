<script>
	import ProjectCard from './ProjectCard.svelte'
	import { projects } from '$content'
	import Head from '$lib/Head.svelte'
</script>

<Head title="Projects | timd.dev" description="List of projects developed by Tim Davis" />

<main class="grid grid-cols-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each projects.entries as project}
		<ProjectCard project={project.data} />
	{/each}
</main>
