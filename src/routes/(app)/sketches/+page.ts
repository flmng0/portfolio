import type { PageLoad } from './$types'

export const load: PageLoad = () => {
	const modules = import.meta.glob('./*.md', { eager: true })

	const sketches = Object.entries(modules).map(([key, module]) => {
		return {
			slug: key.substring(2, key.length - 3),
			...(module as Record<string, any>).metadata
		}
	})

	return {
		sketches
	}
}
