<script lang="ts">
	let { class: classExtra = '', current, children, ...rest } = $props()
</script>

<button
	{...rest}
	class={[
		'btn grid aspect-square size-8 place-items-center',
		current && 'btn-lift -translate-px',
		current || 'border',
		classExtra
	]}
>
	{@render children()}
</button>
