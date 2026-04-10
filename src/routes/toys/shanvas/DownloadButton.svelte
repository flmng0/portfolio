<script>
	import DownloadImage from '$lib/icons/DownloadImage.svelte'
	import { getPngData } from './canvas.svelte'

	/** @type {Promise<string> | null} */
	let imageDataUrl = $state(null)

	function onclick() {
		imageDataUrl = getPngData()
	}

	/** @type {import('svelte/attachments').Attachment<HTMLDialogElement>} */
	const open = (dialog) => {
		dialog.showModal()
	}
</script>

{#if imageDataUrl}
	<dialog
		class="absolute z-10 grid size-full place-items-center bg-transparent"
		onclose={() => (imageDataUrl = null)}
		{@attach open}
	>
		<div class="bg-white p-8 shadow-solid">
			{#await imageDataUrl then imageDataUrl}
				<a href={imageDataUrl} download="sharedcanvas.png">Download!</a>
			{/await}
		</div>
	</dialog>
{/if}

<button
	class="btn fixed right-4 bottom-4 z-10 btn-lift bg-white p-2"
	title="Download Image"
	{onclick}
>
	<span class="hidden">Download as image</span>
	<DownloadImage class="size-8" />
</button>
