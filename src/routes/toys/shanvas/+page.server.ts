import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'
import { error } from '@sveltejs/kit'
import { apiPath } from './consts'

export const prerender = false

const handleStatus = async (res: Response) => {
	if (res.ok) {
		return res
	}
	const msg = 'When fetching: ' + res.url + ' :: ' + (await res.text())
	throw error(res.status, msg)
}

const tokenCookieName = '_shanvas_token'

async function getToken(fetch: typeof globalThis.fetch) {
	const response = await fetch(apiPath('/authorize'), {
		credentials: 'include',
		method: 'POST',
		headers: {
			Authorization: 'Secret ' + env.SHANVAS_SECRET_KEY
		}
	}).then(handleStatus)

	const cookies = response.headers.getSetCookie()

	for (const cookie of cookies) {
		if (cookie.startsWith(tokenCookieName + '=')) {
			return cookie.substring(tokenCookieName.length + 1)
		}
	}
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = await getToken(fetch)
	if (token === undefined) {
		throw error(500, 'Failed to authorize')
	}

	cookies.set(tokenCookieName, token, { path: '/toys/shanvas' })
	const opts = { headers: { Authorization: 'Bearer ' + token } }

	const configPromise = fetch(apiPath('/config'), opts)
		.then(handleStatus)
		.then((res) => res.json())

	const statePromise = fetch(apiPath('/'), opts)
		.then(handleStatus)
		.then((res) => res.blob())
		.then((res) => res.bytes())

	const [config, state] = await Promise.all([configPromise, statePromise])

	return { config, state }
}
