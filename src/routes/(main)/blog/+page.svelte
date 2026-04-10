<script>
	import BlogCard from './BlogCard.svelte'
	import { blogPosts } from '$content'
</script>

<main class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
	{#each blogPosts.entries as post}
		<BlogCard {post} />
	{/each}
</main>
