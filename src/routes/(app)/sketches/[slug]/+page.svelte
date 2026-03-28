<script lang="ts">
	import 'katex/dist/katex.min.css'
	import '$lib/css/prism-gruvbox-dark.css'
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<PostLayout>
	<data.body />
</PostLayout>
