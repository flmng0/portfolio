import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')

	return {
		plugins: [tailwindcss(), sveltekit()],
		server: {
			proxy: {
				'/api/shanvas': {
					target: env.SHANVAS_API_HOST,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api\/shanvas/, '')
				}
			}
		}
	}
})
