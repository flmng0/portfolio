const logoPathDef =
	'M22.7304 80.2887L10.3268 71.2509M22.7304 80.2887L15.0975 61.1703M22.7304 80.2887L23.0645 56.0171M10.3268 71.2509L15.0975 61.1703M10.3268 71.2509L5 42.7211M15.0975 61.1703L5 42.7211M15.0975 61.1703L23.0645 56.0171M15.0975 61.1703L22.9127 42.2678M5 42.7211L22.9127 42.2678M5 42.7211L28.2258 29.8783M23.0645 56.0171L22.9127 42.2678M23.0645 56.0171L47.6566 42.2678M22.9127 42.2678L28.2258 29.8783M22.9127 42.2678L47.6566 42.2678M28.2258 29.8783L47.6566 42.2678M28.2258 29.8783L28.635 22.0086M47.6566 42.2678L28.635 22.0086M47.6566 42.2678L57.8317 20.9402M47.6566 42.2678L72.108 42.3077M28.635 22.0086L57.8317 20.9402M28.635 22.0086L65.9896 0M57.8317 20.9402L65.9896 0M57.8317 20.9402L68.9951 20.0855M57.8317 20.9402L72.108 42.3077M65.9896 0L68.9951 20.0855M65.9896 0L91 18.8034M68.9951 20.0855L72.108 42.3077M68.9951 20.0855L91 18.8034M72.108 42.3077L91 18.8034M72.108 42.3077L79.9439 63.2479M72.108 42.3077L70.0685 100L79.9439 63.2479M91 18.8034L79.9439 63.2479M91 18.8034L90.8927 93.5898L79.9439 63.2479'

/** @type {import('./$types').PageLoad} */
export const load = () => {
	const regexp = /([A-Z])([\d\.]+) ([\d\.]+)/g
	const matches = logoPathDef.matchAll(regexp)

	/** @type {string[]} */
	const pointKeys = []
	/** @type {[number, number][]} */
	const points = []
	/** @type {[number, number][]} */
	const lines = []

	let lastIndex

	for (const [_all, command, xstr, ystr] of matches) {
		const x = Number(xstr)
		const y = Number(ystr)

		const key = xstr + ',' + ystr
		let index

		if (pointKeys.includes(key)) {
			index = pointKeys.indexOf(key)
		} else {
			index = pointKeys.length
			pointKeys.push(key)
			points.push([x, y])
		}

		if (command === 'L') {
			lines.push([index, lastIndex ?? 0])
		}
		lastIndex = index
	}

	return {
		points,
		lines
	}
}
