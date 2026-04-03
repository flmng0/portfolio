import * as v from 'valibot'

export function parseIndex(modules, schema) {
	const posts = []
	const modSchema = v.object({
		metadata: schema
	})

	for (const [key, m] of Object.entries(modules)) {
		const module = v.parse(modSchema, m)

		posts.push({
			slug: key.substring(key.lastIndexOf('/') + 1, key.length - 3),
			...module.metadata
		})
	}

	return posts
}

export function parsePost(module, schema) {
	const body = module.default
	const metadata = module.metadata

	return {
		body,
		...v.parse(schema, metadata)
	}
	// return v.pipe(
	// 	v.parse(schema, metadata),
	// 	v.transform(() => {
	// 		return { body, ...output }
	// 	})
	// )
}
