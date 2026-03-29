<script lang="ts">
	import { codeToHtml } from 'shiki'
	let { code, language } = $props()

	let htmlPromise = $derived(codeToHtml(code, { lang: language, theme: 'gruvbox-dark-hard' }))
	let dialog = $state<HTMLDialogElement>()
</script>

<button onclick={() => dialog!.showModal()} class="btn btn-lift cursor-pointer p-2">
	View Source
</button>

<dialog
	bind:this={dialog}
	class="isolate size-full max-h-screen max-w-screen bg-transparent px-2 py-4 backdrop:bg-black/25"
>
	<form method="dialog">
		<div class="fixed top-0 right-0 p-4">
			<button class="btn bg-white p-2 font-mono">Close</button>
		</div>
		<button class="absolute inset-0 -z-10 cursor-pointer" aria-label="close"></button>
	</form>
	<div class="z-10 mx-auto h-full max-w-prose overflow-hidden">
		{#await htmlPromise then html}
			{@html html}
		{/await}
	</div>
</dialog>

<style>
	dialog :global(pre) {
		max-height: 100%;
		overflow: scroll;
	}
</style>
