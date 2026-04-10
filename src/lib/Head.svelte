<script>
	import { site } from './consts'
	import { page } from '$app/state'
	let { title, description, image = '/default-banner.png', type = 'website' } = $props()

	let imagePath = $derived(new URL(image, site).toString())
	let url = $derived(new URL(page.url.pathname, site).toString())
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:url" content={url} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imagePath} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- No Twitter because X removed the documentation -->
	<!-- Non developer supportive platforms don't get support from me *huff* -->
</svelte:head>
