<script>
	import Head from '$lib/Head.svelte'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<Head
	title="{data.title} | Blog | timd.dev"
	description={data.metaDescription ?? data.description}
/>

<PostLayout>
	<data.body />
</PostLayout>
