<script lang="ts">
	let { children } = $props()
</script>

<div class="flex justify-center">
	<a href="/" class="my-1 underline hover:no-underline">Home</a>
</div>

{@render children()}
