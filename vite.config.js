import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		origin: mode === 'production' ? 'https://timd.dev' : undefined,
		proxy: {
			'/api/shanvas': {
				target: 'http://localhost:5678',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/shanvas/, '')
			}
		}
	}
}))
