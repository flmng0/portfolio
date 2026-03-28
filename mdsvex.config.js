import { defineMDSveXConfig, escapeSvelte } from 'mdsvex'
import remarkMath from 'remark-math'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import { codeToHtml } from 'shiki'

export default defineMDSveXConfig({
	extensions: ['.md'],
	remarkPlugins: [remarkMath],
	rehypePlugins: [rehypeKatexSvelte],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = await codeToHtml(code, { lang, theme: 'gruvbox-dark-hard' })
			const escaped = escapeSvelte(html)
			return `{@html \`${escaped}\`}`
		}
	}
})
