import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'
import { error } from '@sveltejs/kit'

export function apiPath(path: string) {
	if (env.PUBLIC_SHANVAS_API_HOST) {
		console.log('Using configured API host', env.PUBLIC_SHANVAS_API_HOST)
		return new URL(path, env.PUBLIC_SHANVAS_API_HOST)
	}

	if (dev) {
		console.log('Using proxy! (/api/shanvas)')
		return '/api/shanvas' + path
	}

	throw error(500, 'No shanvas host defined, and not in dev!')
}
