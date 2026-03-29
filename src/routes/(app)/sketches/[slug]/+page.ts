import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug
	const module = await import(`../${slug}.md`)

	return {
		body: module.default,
		...(module.metadata as Record<string, any>)
	}
}
