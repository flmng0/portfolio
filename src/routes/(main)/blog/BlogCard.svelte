<script>
	import PostCard from '$lib/PostCard.svelte'

	let { post } = $props()
</script>

<PostCard title={post.data.title} description={post.data.description}>
	{#snippet buttons()}
		<a class="btn btn-visit-sketch btn-lift px-3 py-2" href="/blog/{post.slug}">Read More</a>
	{/snippet}
</PostCard>

<style>
	.btn-visit-sketch {
		--btn-color: oklab(0.12 0 0);
		--btn-bg: oklab(0.99 0.01 -0.02);
		--btn-shadow-color: oklab(0.89 0.01 -0.02);
	}
</style>
