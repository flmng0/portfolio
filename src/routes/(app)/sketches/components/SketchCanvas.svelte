<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'

	let { background = 'white', ...rest } = $props()
</script>

<canvas
	{@attach autoSizeCanvas}
	{...rest}
	style:background
	class="aspect-square w-full shadow-solid outline outline-black/25"
></canvas>
