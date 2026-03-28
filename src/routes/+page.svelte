<script>
	import { hero } from '$lib/whimsy'
	import { autoSizeCanvas } from '$lib/attachments.svelte.js'
	import GitHub from '$lib/icons/GitHub.svelte'
	import LinkedIn from '$lib/icons/LinkedIn.svelte'
	import Mail from '$lib/icons/Mail.svelte'

	import PageLink from './PageLink.svelte'
	import SocialLink from './SocialLink.svelte'
	import { beforeNavigate } from '$app/navigation'
	import state from '$lib/state.svelte.js'

	beforeNavigate(() => {
		state.heroPlayed = true
	})

	let { data } = $props()

	const pages = [
		{ name: 'projects', href: '/projects', indev: true },
		{ name: 'sketches', href: '/sketches', indev: true },
		{ name: 'blog', href: '/blog', indev: true }
	]

	const socials = [
		{
			name: 'GitHub',
			href: 'https://github.com/flmng0',
			icon: GitHub,
			variant: 'github'
		},
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/in/timothy-davis-dev',
			icon: LinkedIn,
			variant: 'linkedin'
		},
		{
			name: 'Email to me@timd.dev',
			accessibleName: 'Email',
			href: 'mailto:me@timd.dev',
			icon: Mail,
			variant: 'email'
		}
	]
</script>

<div class="grid h-full place-items-center *:col-1 *:row-1">
	<canvas
		style:animation-delay="500ms"
		class="absolute inset-0 h-screen w-screen"
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

<style>
	canvas {
		animation: var(--animate-blur);

		:global([data-played='true']) & {
			animation-duration: 0;
		}
	}
</style>
