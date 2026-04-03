<script>
	let { toy } = $props()
</script>

<article>
	<a href={toy.href} {...toy.props}>
		<main class="btn-lift bg-neutral-50 p-4 outline">
			<h2 class="text-center font-mono text-xl font-semibold tracking-wider">
				{toy.name}
			</h2>
			<p>{toy.description}</p>
		</main>
	</a>
</article>
