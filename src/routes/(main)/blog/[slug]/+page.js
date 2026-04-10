import { blogPosts } from '$content'
import { error } from '@sveltejs/kit'

/** @type {import("./$types").PageLoad} */
export const load = async ({ params }) => {
	const blogPost = blogPosts.getEntry(params.slug)

	if (blogPost === undefined || blogPost.body === undefined) {
		throw error(404, 'Blog post with slug ' + params.slug + ' not found!')
	}

	return {
		body: blogPost.body,
		...blogPost.data
	}
}
