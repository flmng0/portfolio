import { sketches } from '$content'
import { error } from '@sveltejs/kit'

/** @type {import("./$types").PageLoad} */
export const load = async ({ params }) => {
	const sketch = sketches.getEntry(params.slug)

	if (sketch === undefined || sketch.body === undefined) {
		throw error(404, 'Sketch with slug ' + params.slug + ' not found!')
	}

	return {
		body: sketch.body,
		...sketch.data
	}
}
