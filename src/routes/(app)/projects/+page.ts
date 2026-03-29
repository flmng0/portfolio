import type { PageLoad } from './$types'

export const load: PageLoad = () => {
	const mdModules = import.meta.glob('./*.md', { eager: true })

	const projects = []

	for (const [key, module] of Object.entries(mdModules)) {
		const project = {
			slug: key.substring(2, key.length - 3),
			...(module as Record<string, any>).metadata
		}
		projects.push(project)
	}

	return {
		projects
	}
}
