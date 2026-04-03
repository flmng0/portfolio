<script>
	let { children } = $props()
</script>

<div class="mx-auto mb-8 flex max-w-xl flex-col gap-4">
	{@render children()}
</div>
