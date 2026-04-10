<script>
	import Head from '$lib/Head.svelte'
	import Controls from './Controls.svelte'
	import DownloadButton from './DownloadButton.svelte'
	import SharedCanvas from './SharedCanvas.svelte'
	import { setToken } from './api.js'
	import { initCanvas } from './canvas.svelte.js'

	let { data } = $props()
	$effect(() => {
		data.token && setToken(data.token)
	})

	// svelte-ignore state_referenced_locally
	initCanvas(data.state, data.config)
</script>

<Head
	title="Shared Canvas | Toys and Fun | timd.dev"
	description="Large, real-time, synchronised canvas by Tim Davis."
/>

<Controls />
<SharedCanvas />

{#if !data.config.offline}
	<DownloadButton />
{/if}

{#if data.config.offline}
	<footer class="absolute bottom-1 flex w-full flex-col justify-center px-4 text-center">
		<p>You are offline!</p>
		<p>Feel free to draw, but unfortunately you won't see other people drawing.</p>
	</footer>
{/if}
