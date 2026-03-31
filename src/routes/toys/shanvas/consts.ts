export const apiRoot = import.meta.env.VITE_SHANVAS_ROOT || '/api/shanvas'
if (apiRoot !== '/api/shanvas') {
	console.log('Using Api Root', apiRoot)
}
