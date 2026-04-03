import * as v from 'valibot'

export default v.object({
	title: v.string(),
	description: v.string(),
	metaDescription: v.optional(v.string())
})
