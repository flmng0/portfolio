import { blogPosts } from '$content'
import { error } from '@sveltejs/kit'

/** @type {import("./$types").PageLoad} */
export const load = async ({ params }) => {
	const blogPost = blogPosts.getEntry(params.slug)

	if (blogPost === undefined || blogPost.body === undefined) {
		throw error(404, 'Blog post with slug ' + params.slug + ' not found!')
	}

	const details = (/** @type {string} */ slug) => {
		if (slug === undefined) {
			return undefined
		}

		const entry = blogPosts.getEntry(slug)

		if (entry === undefined) {
			throw new Error('expected link to exist')
		}

		if (entry.data.draft) {
			return undefined
		}

		return {
			href: `/blog/${entry.slug}`,
			...entry.data
		}
	}

	const prevDetails = details(blogPost.data.prev)
	const nextDetails = details(blogPost.data.next)

	return {
		prevDetails,
		nextDetails,
		body: blogPost.body,
		...blogPost.data
	}
}
