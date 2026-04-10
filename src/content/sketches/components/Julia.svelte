<script>
	import { glslSketch } from '$lib/attachments.svelte'
	import shaderSource from './julia.glsl?raw'
	import SketchCanvas from './SketchCanvas.svelte'
	import SketchHero from './SketchHero.svelte'
	import ViewSource from './ViewSource.svelte'
</script>

<SketchHero>
	<SketchCanvas {@attach glslSketch(shaderSource)} background="rgb(0.8 0.9 1.0)"></SketchCanvas>
	<ViewSource code={shaderSource} language="glsl" />
</SketchHero>
