import { browser } from '$app/environment'
import type { Attachment } from 'svelte/attachments'

const toResize: HTMLCanvasElement[] = []

const resize = (cvs: HTMLCanvasElement) => {
	cvs.width = cvs.clientWidth
	cvs.height = cvs.clientHeight
}

const autoSizeCanvas: Attachment<HTMLCanvasElement> = (cvs) => {
	if (browser) {
		resize(cvs)
	}
	toResize.push(cvs)
}

if (browser) {
	window.addEventListener('resize', () => {
		toResize.forEach(resize)
	})
}

export default autoSizeCanvas
