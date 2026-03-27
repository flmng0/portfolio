<script lang="ts">
	let { delay, social } = $props()
</script>

<li
	style:animation-delay={delay + 'ms'}
	class="animation-fill-backwards played:no-animate animate-slide-in"
>
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
