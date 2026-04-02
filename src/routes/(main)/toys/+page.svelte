<script lang="ts">
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

<svelte:head>
	<title>Toys and Fun | timd.dev</title>
	<meta name="description" content="Fun web toys created by Tim Davis." />
</svelte:head>

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
