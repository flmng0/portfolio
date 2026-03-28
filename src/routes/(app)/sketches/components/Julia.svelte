<script lang="ts">
	import { glslSketch } from '$lib/attachments.svelte'
	import shaderSource from './julia.glsl?raw'
	import SketchCanvas from './SketchCanvas.svelte'
</script>

<SketchCanvas {@attach glslSketch(shaderSource)}></SketchCanvas>
