import { defineMDSveXConfig, escapeSvelte } from 'mdsvex'
import remarkMath from 'remark-math'
import remarkToC from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeKatexSvelte from 'rehype-katex-svelte'
import { codeToHtml } from 'shiki'

export default defineMDSveXConfig({
	extensions: ['.md'],
	remarkPlugins: [remarkMath, [remarkToC, { maxDepth: 4, skip: 'h1' }]],
	rehypePlugins: [rehypeSlug, rehypeKatexSvelte],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = await codeToHtml(code, { lang, theme: 'gruvbox-dark-hard' })
			const escaped = escapeSvelte(html)
			return `{@html \`${escaped}\`}`
		}
	}
})
