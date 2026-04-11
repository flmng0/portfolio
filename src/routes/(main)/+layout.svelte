<script>
	import Header from './Header.svelte'

	let { children, data } = $props()
</script>

<div class="container mx-auto flex flex-col justify-center">
	<Header breadcrumbs={data.breadcrumbs} />

	<div class="mx-2 mt-4 px-6 py-4 sm:mx-6">
		{@render children()}
	</div>
</div>
