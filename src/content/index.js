import * as v from 'valibot'

/** @type {import('./types').CollectionMaker} */
function makeCollection(entries, schema) {
	// @ts-ignore
	const parsed = []

	const jsonSchema = schema
	const mdsvexSchema = v.object({
		default: v.function(),
		metadata: schema
	})

	const pushMdsvex = (/** @type {string} */ slug, /** @type {unknown} */ mod) => {
		const module = v.parse(mdsvexSchema, mod)
		parsed.push({
			slug,
			body: /** @type {import('svelte').Component?} */ (module.default),
			data: module.metadata
		})
	}

	const pushJson = (/** @type {string} */ slug, /** @type {unknown} */ mod) => {
		const data = v.parse(jsonSchema, mod)
		parsed.push({
			slug,
			data,
			body: undefined
		})
	}

	for (const [key, mod] of Object.entries(entries)) {
		const extension = key.substring(key.lastIndexOf('.'))
		const slug = key.substring(key.lastIndexOf('/') + 1, key.length - extension.length)

		try {
			switch (extension) {
				case '.md':
					pushMdsvex(slug, mod)
					break

				case '.json':
					pushJson(slug, mod)
					break
			}
		} catch (e) {
			console.warn(`Failed to parse content file: ${key}\n\t${e}\n`)
		}
	}

	return {
		// @ts-ignore
		entries: parsed,
		getEntry: (/** @type {string} */ slug) => {
			// @ts-ignore
			return parsed.find((entry) => entry.slug === slug)
		}
	}
}

const IsoDateString = v.pipe(v.string(), v.toDate())

const PublishData = v.union([
	v.object({
		draft: v.literal(true)
	}),
	v.object({
		published: IsoDateString,
		modified: v.optional(IsoDateString)
	})
])

const ArticleDetails = v.object({
	title: v.string(),
	description: v.string(),
	metaDescription: v.optional(v.string()),
	tags: v.optional(v.array(v.string()))
})
const Article = v.intersect([PublishData, ArticleDetails])

const BlogPost = Article

export const blogPosts = makeCollection(import.meta.glob('./blog/*.md', { eager: true }), BlogPost)

const Sketch = Article
export const sketches = makeCollection(import.meta.glob('./sketches/*.md', { eager: true }), Sketch)

const Project = v.object({
	title: v.string(),
	description: v.string(),
	source: v.optional(v.string()),
	postSlug: v.optional(v.string()),
	link: v.optional(v.string())
})

export const projects = makeCollection(
	import.meta.glob('./projects/*.json', { eager: true }),
	Project
)
