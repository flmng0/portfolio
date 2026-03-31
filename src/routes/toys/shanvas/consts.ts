import { env } from '$env/dynamic/public'

export function apiPath(path: string) {
	if (env.PUBLIC_SHANVAS_API_HOST) {
		console.log('Using configured API host', env.PUBLIC_SHANVAS_API_HOST)
		return new URL(path, env.PUBLIC_SHANVAS_API_HOST)
	}

	console.log('Using proxy! (/api/shanvas)')
	return '/api/shanvas' + path
}
