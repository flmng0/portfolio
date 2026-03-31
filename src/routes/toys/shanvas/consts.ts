import { env } from '$env/dynamic/public'

export const apiRoot = () => env.PUBLIC_SHANVAS_ROOT || '/api/shanvas'
export const apiPath = (path: string) => new URL(path, apiRoot())
