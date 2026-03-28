<script lang="ts">
	import state from '$lib/state.svelte'

	let { delay, social } = $props()
</script>

<li style:animation-delay={delay + 'ms'} class:slide-in={state.heroPlayed}>
	<a
		class="btn btn-{social.variant} block p-2"
		target="_blank"
		href={social.href}
		title={social.name}
	>
		<social.icon class="size-6" />

		<!-- {% set label = social.accessibleName | default(social.name) + " icon" %} -->
		<!-- {% icon social.icon, "aria-label"=label %} -->
	</a>
</li>
