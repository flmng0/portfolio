import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

export let token = ''

export function setToken(t: string) {
	token = t
}

export function apiPath(path: string) {
	if (env.PUBLIC_SHANVAS_API_HOST) {
		return new URL(path, env.PUBLIC_SHANVAS_API_HOST)
	}

	if (dev) {
		return '/api/shanvas' + path
	}

	throw error(500, 'No shanvas host defined, and not in dev!')
}
