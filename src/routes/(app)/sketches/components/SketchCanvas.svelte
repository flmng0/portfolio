<script lang="ts">
	import { autoSizeCanvas } from '$lib/attachments.svelte'

	let props = $props()
</script>

<canvas
	{@attach autoSizeCanvas}
	{...props}
	class="aspect-square w-full shadow-solid outline outline-black/25"
></canvas>
