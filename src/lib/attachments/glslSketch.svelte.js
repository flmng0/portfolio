/**
 * @param {string} fragSource
 * @returns {import("svelte/attachments").Attachment<HTMLCanvasElement>}
 */
export default function glslSketch(fragSource) {
	const fragPrefix = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
`

	const vertSource = `#version 300 es
in vec2 aVertexPos;

void main() {
    gl_Position = vec4(aVertexPos, 0.0, 1.0);
}`

	return (cvs) => {
		const gl = cvs.getContext('webgl2')
		if (gl === null) {
			throw new Error('Failed to get webgl2 context!')
		}

		/**
		 * @param {string} source
		 * @param {GLenum} type
		 */
		const compileShader = (source, type) => {
			const s = gl.createShader(type)
			if (s === null) {
				throw new Error('Failed to create shader!')
			}
			gl.shaderSource(s, source)
			gl.compileShader(s)

			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				throw new Error('Failed to compile shader!')
			}

			return s
		}

		/**
		 * @param {WebGLShader} vert
		 * @param {WebGLShader} frag
		 */
		const compileProgram = (vert, frag) => {
			const p = gl.createProgram()
			gl.attachShader(p, vert)
			gl.attachShader(p, frag)
			gl.linkProgram(p)

			if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
				throw new Error('Failed to link shader program!')
			}

			return p
		}

		const quadPoints = [-1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

		/**
		 * @param {WebGLProgram} program
		 */
		const setupVertexArray = (program) => {
			const data = new Float32Array(quadPoints)
			const buffer = gl.createBuffer()
			const vertexArray = gl.createVertexArray()
			const aVertexPos = gl.getAttribLocation(program, 'aVertexPos')

			gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

			gl.bindVertexArray(vertexArray)
			gl.enableVertexAttribArray(aVertexPos)
			gl.vertexAttribPointer(aVertexPos, 2, gl.FLOAT, false, 0, 0)
		}

		/**
		 * @param {WebGLProgram} program
		 * @param {string[]} names
		 * @returns {Record<string, WebGLUniformLocation>}
		 */
		const getUniformLocations = (program, ...names) => {
			const entries = names.map((name) => {
				const location = gl.getUniformLocation(program, name)
				return [name, location]
			})

			return Object.fromEntries(entries)
		}

		const vertShader = compileShader(vertSource, gl.VERTEX_SHADER)
		const fragShader = compileShader(fragPrefix + fragSource, gl.FRAGMENT_SHADER)
		const program = compileProgram(vertShader, fragShader)

		setupVertexArray(program)
		gl.useProgram(program)

		let startT = performance.now()
		const draw = () => {
			const t = (performance.now() - startT) / 1000

			const uniformLocations = getUniformLocations(program, 'uResolution', 'uTime')
			gl.uniform2f(uniformLocations['uResolution'], cvs.width, cvs.height)
			gl.uniform1f(uniformLocations['uTime'], t)

			gl.viewport(0, 0, cvs.width, cvs.height)
			gl.clearColor(0.8, 0.9, 1.0, 1.0)
			gl.clear(gl.COLOR_BUFFER_BIT)

			gl.drawArrays(gl.TRIANGLES, 0, 6)

			window.requestAnimationFrame(draw)
		}
		draw()
	}
}
