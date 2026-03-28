<script lang="ts">
	import '$lib/css/prism-gruvbox-dark.css'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.44/dist/katex.min.css" integrity="sha384-irXK0JiCGinqGL+slwVklbhJetrjczNwaP2lANewD8lKAs9n61SbQ3As28iSqXUE" crossorigin="anonymous">
</svelte:head>

<PostLayout>
	<data.body />
</PostLayout>
