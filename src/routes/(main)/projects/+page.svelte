<script>
	import ProjectCard from './ProjectCard.svelte'
	import { projects } from '$content'
</script>

<svelte:head>
	<title>Projects | timd.dev</title>
	<meta name="description" content="List of projects developed by Tim Davis" />
</svelte:head>

<main class="grid grid-cols-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each projects.entries as project}
		<ProjectCard project={project.data} />
	{/each}
</main>
