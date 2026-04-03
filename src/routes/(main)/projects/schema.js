import * as v from 'valibot'

export default v.object({
	title: v.string(),
	description: v.string(),
	metaDescription: v.optional(v.string()),
	source: v.optional(v.string()),
	post: v.fallback(v.boolean(), false),
	slug: v.optional(v.string()),
	link: v.optional(v.string())
})
