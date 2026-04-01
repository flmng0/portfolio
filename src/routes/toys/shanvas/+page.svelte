<script lang="ts">
	import Controls from './Controls.svelte'
	import SharedCanvas from './SharedCanvas.svelte'
	import { setToken } from './api.js'
	import { initCanvas } from './canvas.svelte.js'

	let { data } = $props()
	$effect(() => setToken(data.token))

	// svelte-ignore state_referenced_locally
	initCanvas(data.state, data.config)
</script>

<Controls />
<SharedCanvas />
