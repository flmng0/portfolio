<script lang="ts">
	import '$lib/css/prism-gruvbox-dark.css'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
		integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omwcC6g=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-gruvbox-dark.min.css"
		integrity="sha512-XZoe1WroNfbcndQJexn+pbMEytiaSYRHDuKjew+Nn0xYSTmB4sfoZnBdqYCrXq2IwAcPZS/sXE5ju/JbppYOsA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<PostLayout>
	<data.body />
</PostLayout>
