<script>
	import { beforeNavigate } from '$app/navigation'

	import PageLink from './PageLink.svelte'
	import SocialLink from './SocialLink.svelte'

	import state from '$lib/state.svelte.js'
	import { hero } from '$lib/whimsy'
	import { autoSizeCanvas } from '$lib/attachments.svelte.js'
	import { socials } from '$lib/consts.js'

	beforeNavigate(() => {
		state.heroPlayed = true
	})

	let { data } = $props()

	const pages = [
		{ name: 'projects', href: '/projects' },
		{ name: 'sketches', href: '/sketches' },
		{ name: 'blog', href: '/blog', indev: true }
	]
</script>

<svelte:head>
	<title>timd.dev</title>
	<meta name="description" content="Portfolio of Australian web designer: Tim Davis." />
</svelte:head>

<div class="grid h-full place-items-center *:col-1 *:row-1">
	<canvas
		class:played={state.heroPlayed}
		class="touch-action-none absolute inset-0 h-screen w-screen"
		{@attach hero(data.points, data.lines)}
		{@attach autoSizeCanvas}
	></canvas>

	<main
		style:animation-delay="500ms"
		class:animate-fade-in={!state.heroPlayed}
		class="z-10 flex flex-col justify-center space-y-10 text-center"
	>
		<h1 class="p-2 font-mono text-title">timd.dev</h1>
		<nav class="w-full space-y-6 font-mono">
			<ul class="mx-auto flex flex-wrap justify-center gap-4">
				{#each pages as page, i}
					<PageLink {page} delay={600 + 300 * i} />
				{/each}
			</ul>
			<ul class="mx-auto flex flex-wrap justify-center gap-4">
				{#each socials as social, i}
					<SocialLink {social} delay={900 + 300 * i} />
				{/each}
			</ul>
		</nav>
	</main>
</div>

<a href="/toys/shanvas" class="fixed right-0 bottom-0 opacity-0">Goto Shanvas</a>

<style>
	canvas {
		animation: var(--animate-blur);
		animation-delay: 500ms;
		&.played {
			animation-delay: 0ms;
			animation-duration: 0ms;
		}
	}
</style>
