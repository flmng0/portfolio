import { parsePost } from '$lib/blogLoader'
import schema from '../schema'

/** @type {import("./$types").PageLoad} */
export const load = async ({ params }) => {
	const slug = params.slug
	const module = await import(`../${slug}.md`)

	return parsePost(module, schema)
}
