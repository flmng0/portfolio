import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/api/shanvas': {
				target: 'localhost:5678',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/shanvas/, '')
			}
		}
	}
})
