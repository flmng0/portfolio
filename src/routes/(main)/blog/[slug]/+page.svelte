<script>
	import ArticleHead from '$lib/ArticleHead.svelte'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<ArticleHead
	title="{data.title} | Blog | timd.dev"
	description={data.metaDescription ?? data.description}
	published={data.published}
	image={data.banner}
/>

{#snippet linkedPost(
	/** @type {{ href: string, title: string }} */ details,
	/** @type {"prev" | "next"} */ direction
)}
	<a
		class="not-prose group w-full border p-4 hover:bg-neutral-100"
		class:text-end={direction === 'next'}
		href={details.href}
	>
		<span class="font-semibold not-group-hover:underline">
			Read {direction === 'prev' ? 'Previous' : 'Next'}
		</span>
		<p class="font-mono">{details.title}</p>
	</a>
{/snippet}

{#snippet prev()}
	{@render linkedPost(data.prevDetails, 'prev')}
{/snippet}
{#snippet next()}
	{@render linkedPost(data.nextDetails, 'next')}
{/snippet}

<PostLayout previous={data.prevDetails && prev} next={data.nextDetails && next}>
	<data.body />
</PostLayout>
