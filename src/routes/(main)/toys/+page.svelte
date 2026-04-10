<script>
	import Head from '$lib/Head.svelte'
	import ToyCard from './ToyCard.svelte'

	const toys = [
		{
			href: '/toys/shanvas',
			name: 'Shared Canvas!',
			description:
				'Large, real-time, synchronised canvas! Feel free to draw whatever you want, with easy controls',
			props: { 'data-sveltekit-preload-data': 'tap' }
		}
	]
</script>

<Head
	title="Toys and Fun | timd.dev"
	description="Fun web toys and experiments created by Tim Davis."
/>

<section class="grid">
	{#each toys as toy}
		<ToyCard {toy} />
	{/each}
</section>

<style>
	section {
		grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
	}
</style>
