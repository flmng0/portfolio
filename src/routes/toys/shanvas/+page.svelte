<script lang="ts">
	import SharedCanvas from './SharedCanvas.svelte'

	let { data } = $props()

	let pixels = $derived(Array.from({ length: data.config.width * data.config.height }, () => 0))

	$effect(() => {
		data.state.bytes().then((bytes) => {
			pixels = [...bytes]
		})
	})

	function pushPaint(x: number, y: number, brush: number) {
		fetch('/api', {
			body: JSON.stringify({ x, y, brush }),
			method: 'PATCH',
			headers: {
				Authorization: 'Bearer ' + data.apiToken
			}
		})
	}
</script>

<div class="px-4 py-12">
	<header class="text-center">
		<h1 class="font-mono text-xl font-semibold">Shared Canvas</h1>
	</header>

	<main class="container mx-auto p-8 shadow-solid outline">
		<SharedCanvas {pixels} config={data.config} onpaint={pushPaint} />
	</main>
</div>
