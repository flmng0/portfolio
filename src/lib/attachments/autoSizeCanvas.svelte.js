import { browser } from '$app/environment'

/** @type {HTMLCanvasElement[]} */
const toResize = []

/**
 * @param {HTMLCanvasElement} cvs
 */
const resize = (cvs) => {
	cvs.width = cvs.clientWidth
	cvs.height = cvs.clientHeight
}

/** @type {import('svelte/attachments').Attachment<HTMLCanvasElement>} */
const autoSizeCanvas = (cvs) => {
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
