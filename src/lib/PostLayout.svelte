<script lang="ts">
	let { children } = $props()
</script>

<article class="prose prose-headings:font-mono prose-img:shadow-md">
	<main>
		{@render children()}
	</main>
</article>

<style>
	article :global(pre) {
		border-radius: 0;
		box-shadow: var(--shadow-solid);
	}
</style>
