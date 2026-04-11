<script>
	import BlogCard from './BlogCard.svelte'
	import { blogPosts } from '$content'

	let sorted = blogPosts.entries
		.filter((post) => !post.data.draft)
		.toSorted((a, b) => {
			return b.data.published - a.data.published
		})
</script>

<main class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each sorted as post}
		<BlogCard {post} />
	{/each}
</main>
