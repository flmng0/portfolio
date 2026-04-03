import { Attachment } from 'svelte/attachments'

interface Listeners {
	onpan?: (dx: number, dy: number) => void
	onzoom?: (ds: number, source: 'scroll' | 'pinch') => void
}

type PointerState = {
	x: number
	y: number
	lastX: number
	lastY: number
	dx: number
	dy: number
	down: boolean
}

export default function gesturable(listeners: Listeners): Attachment<HTMLElement>
