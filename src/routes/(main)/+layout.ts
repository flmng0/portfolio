import type { LayoutLoad } from './$types'

export const load: LayoutLoad = (data) => {
	let path = ''
	const breadcrumbs = [{ name: 'home', href: '/' }]

	const parts = data.url.pathname.split('/')
	parts.shift()

	for (const part of parts) {
		path += '/' + part
		breadcrumbs.push({ name: part, href: path })
	}

	return {
		breadcrumbs
	}
}
