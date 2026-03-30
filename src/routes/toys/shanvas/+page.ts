import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ data, fetch }) => {
	const options: RequestInit = {
		headers: {
			Authorization: 'Bearer ' + data.apiToken
		},
		credentials: 'include'
	}

	const handleStatus = async (res: Response) => {
		if (res.ok) {
			return res
		}
		const msg = await res.text()
		throw error(res.status, msg)
	}

	const configPromise = fetch('/api/config', options)
		.then(handleStatus)
		.then((res) => res.json())

	const statePromise = fetch('/api', options)
		.then(handleStatus)
		.then((res) => res.blob())

	const [config, state] = await Promise.all([configPromise, statePromise])

	return {
		config,
		state,
		apiToken: data.apiToken
	}
}
