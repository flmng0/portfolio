<script>
	import { page } from '$app/state'
	import { socials } from '$lib/consts'
	import Logo from '$lib/icons/Logo.svelte'

	let { breadcrumbs } = $props()
</script>

<header class="flex flex-wrap font-mono sm:mx-2 sm:my-2 sm:gap-4">
	<nav
		class="noise flex flex-grow gap-4 border border-neutral-400 p-2 text-base text-black shadow-neutral-300 sm:px-4 sm:text-heading sm:shadow-solid"
	>
		<div class="hidden sm:inline-block" aria-hidden="true">
			<Logo stroke-width="3" class="size-8" />
		</div>
		<ol class="flex flex-wrap items-center gap-x-0.5 sm:gap-x-1">
			{#each breadcrumbs as crumb, i}
				<span class="text-lg text-neutral-400" aria-hidden="true">/</span>
				<li aria-current={page.url.pathname == crumb.href ? 'page' : null}>
					{#if i == breadcrumbs.length - 1}
						<span>{crumb.name}</span>
					{:else}
						<a href={crumb.href} class="underline decoration-neutral-400 hover:no-underline">
							{crumb.name}
						</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>

	<ul class="flex justify-end text-sm max-sm:w-full sm:text-base md:text-lg">
		{#each socials as social}
			<li class="h-full">
				<a
					class="btn btn-{social.variant} grid h-full place-items-center p-2 sm:btn-lift"
					target="_blank"
					href={social.href}
					title={social.name}
				>
					<social.icon class="size-6" />
				</a>
			</li>
		{/each}
	</ul>
</header>
