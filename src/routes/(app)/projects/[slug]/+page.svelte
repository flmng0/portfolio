<script lang="ts">
	import PostLayout from '$lib/PostLayout.svelte'

	let { data } = $props()
</script>

<PostLayout>
	<data.body />
</PostLayout>
