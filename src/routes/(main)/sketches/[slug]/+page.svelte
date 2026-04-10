<script>
	import ArticleHead from '$lib/ArticleHead.svelte'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<ArticleHead
	title="{data.title} | Sketches | timd.dev"
	description={data.metaDescription ?? data.description}
	published={data.published}
/>

<PostLayout>
	<data.body />
</PostLayout>
