<script>
	import { site } from './consts'
	import { page } from '$app/state'
	let { title, description, image = '/fallback-banner.png' } = $props()

	let imagePath = $derived(new URL(image, site).toString())
	let url = $derived(new URL(page.url.pathname, site).toString())
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta name="og:type" content="website" />
	<meta name="og:title" content={title} />
	<meta name="og:url" content={url} />
	<meta name="og:description" content={description} />
	<meta name="og:image" content={imagePath} />
</svelte:head>
