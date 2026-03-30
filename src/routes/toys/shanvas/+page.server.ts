import type { PageServerLoad } from './$types'
import { SHANVAS_SECRET_KEY } from '$env/static/private'

export const load: PageServerLoad = async ({ fetch }) => {
	const token = await fetch('/api/token', {
		headers: {
			Authorization: 'Secret ' + SHANVAS_SECRET_KEY
		}
	}).then((res) => res.text())

	return {
		apiToken: token
	}
}
