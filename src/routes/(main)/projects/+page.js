import { parseIndex } from '$lib/blogLoader'
import schema from './schema'

export const load = () => {
	const modules = import.meta.glob('./*.md', { eager: true })
	const projects = parseIndex(modules, schema)

	return { projects }
}
