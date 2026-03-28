import { defineMDSveXConfig } from "mdsvex";
import remarkMath from 'remark-math'
import rehypeKatexSvelte from 'rehype-katex-svelte'

export default defineMDSveXConfig({
	extensions: ['.md'],
	remarkPlugins: [remarkMath],
	rehypePlugins: [rehypeKatexSvelte]
})
