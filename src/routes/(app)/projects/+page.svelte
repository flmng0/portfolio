<script>
	import ProjectCard from './ProjectCard.svelte'

	let { data } = $props()
	console.log(data.projects)
</script>

<main class="grid grid-cols-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each data.projects as project}
		<ProjectCard {project} />
	{/each}
</main>
