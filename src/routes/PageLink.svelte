<script>
	import Hardhat from '$lib/icons/Hardhat.svelte'
	import state from '$lib/state.svelte'
	import { hardhat } from '$lib/whimsy'

	let { delay, page } = $props()
</script>

<li style:animation-delay={delay + 'ms'} class:animate-slide-in={!state.heroPlayed}>
	{#if page.indev === true}
		<div class="group relative">
			<button
				class="absolute top-0 left-0 -translate-x-2 -translate-y-1/2 cursor-pointer"
				aria-labelledby="{page.name}ConstructionMessage"
				{@attach hardhat}
			>
				<Hardhat class="-rotate-30" />
			</button>
			<span class="block border border-dashed bg-neutral-50 px-3 py-2 text-black/80">
				{page.name}
			</span>
			<div
				class="pointer-events-none absolute top-full left-1/2 z-10 w-auto max-w-2xl -translate-x-1/2 translate-y-0 border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm italic opacity-0 transition-[translate,opacity] group-focus-within:translate-y-2 group-focus-within:opacity-100 group-hover:z-20 group-hover:translate-y-2 group-hover:opacity-100"
			>
				<span id="{page.name}ConstructionMessage">
					{page.name} page is under construction.
				</span>
			</div>
		</div>
	{:else}
		<a href={page.href} title={page.name} class="noise btn btn-link block w-full px-3 py-2">
			{page.name}
		</a>
	{/if}
</li>
