<script>
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>{data.title} | Sketches | timd.dev</title>
	<meta name="description" content={data.metaDescription ?? data.description} />
</svelte:head>

<PostLayout>
	<data.body />
</PostLayout>
