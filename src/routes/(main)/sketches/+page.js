import { parseIndex } from '$lib/blogLoader'
import schema from './schema'

/** @type {import("./$types").PageLoad} */
export const load = () => {
	const modules = import.meta.glob('./*.md', { eager: true })
	const sketches = parseIndex(modules, schema)

	return { sketches }
}
