<script>
	import GitHub from '$lib/icons/GitHub.svelte'
	import LinkedIn from '$lib/icons/LinkedIn.svelte'
	import Mail from '$lib/icons/Mail.svelte'
	import PageLink from './PageLink.svelte'
	import SocialLink from './SocialLink.svelte'

	const pages = [
		{ name: 'projects', href: '/projects' },
		{ name: 'sketches', href: '/sketches' },
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

<svelte:head>
	<script>
		if (sessionStorage.getItem('animation-played')) {
			document.documentElement.setAttribute('data-played', 'true')
		}
		sessionStorage.setItem('animation-played', 'yes')
	</script>
</svelte:head>

<div class="grid h-full place-items-center *:col-1 *:row-1">
	<canvas
		id="sketchCanvas"
		style:animation-delay="500ms"
		class="absolute inset-0 h-screen w-screen not-played:animate-blur"
		aria-hidden="true"
	></canvas>

	<main
		style:animation-delay="500ms"
		class="z-10 flex flex-col justify-center space-y-10 text-center not-played:animate-fade-in"
	>
		<h1 class="p-2 font-mono text-title">timd.dev</h1>
		<nav class="w-full space-y-6 font-mono">
			<ul class="mx-auto flex flex-row justify-center gap-4">
				{#each pages as page, i}
					<PageLink {page} delay={600 + 300 * i} />
				{/each}
			</ul>
			<ul class="mx-auto flex flex-wrap justify-center gap-4">
				{#each socials as social, i}
					<SocialLink {social} delay={900 + 300 * i} />
				{/each}
			</ul>
			<!-- <ul class="mx-auto flex flex-row flex-wrap justify-center gap-4 font-mono"> -->
			<!--   {%- for page in pages -%} -->
			<!--   {%- set delay = startDelay + itemDelay * loop.index -%} -->
			<!--   {%- endfor -%} -->
			<!-- </ul> -->
			<!-- <ul class="flex justify-center gap-4"> -->
			<!--   {%- for social in socials -%} -->
			<!--   {%- set delay = groupOffset + startDelay + itemDelay * loop.index -%} -->
			<!--   <li -->
			<!--     class="animation-delay-{{ delay }} animate-slide-in animation-fill-backwards played:no-animate" -->
			<!--   > -->
			<!--     <a -->
			<!--       class="btn btn-{{ social.variant }} block p-2" -->
			<!--       target="_blank" -->
			<!--       href="{{ social.href }}" -->
			<!--       title="{{ social.name }}" -->
			<!--     > -->
			<!--       {% set label = social.accessibleName | default(social.name) + " icon" %} -->
			<!--       {% icon social.icon, "aria-label"=label %} -->
			<!--     </a> -->
			<!--   </li> -->
			<!--   {%- endfor -%} -->
			<!-- </ul> -->
		</nav>
	</main>
</div>
