<script lang="ts">
	import SharedCanvas from './SharedCanvas.svelte'
	import { initCanvas } from './canvas.svelte.js'

	let { data } = $props()

	// svelte-ignore state_referenced_locally
	initCanvas(data.state, data.config)
</script>

<div class="px-4 py-12">
	<header class="text-center">
		<h1 class="font-mono text-xl font-semibold">Shared Canvas</h1>
	</header>

	<main class="container mx-auto p-8 shadow-solid outline">
		<SharedCanvas />
	</main>
</div>
