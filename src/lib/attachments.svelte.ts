import { browser } from '$app/environment'
import type { Attachment } from 'svelte/attachments'

const toResize: HTMLCanvasElement[] = []

const resize = (cvs: HTMLCanvasElement) => {
	cvs.width = cvs.clientWidth
	cvs.height = cvs.clientHeight
}

export const autoSizeCanvas: Attachment<HTMLCanvasElement> = (cvs) => {
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

export function glslSketch(fragSource: string): Attachment<HTMLCanvasElement> {
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
		const gl = cvs.getContext('webgl2')!

		const compileShader = (source: string, type: GLenum) => {
			const s = gl.createShader(type)!
			gl.shaderSource(s, source)
			gl.compileShader(s)

			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				throw new Error('Failed to compile shader!')
			}

			return s
		}

		const compileProgram = (vert: WebGLShader, frag: WebGLShader) => {
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
		const setupVertexArray = (program: WebGLProgram) => {
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

		const getUniformLocations = (program: WebGLProgram, ...names: string[]) => {
			const entries = names.map((name) => {
				const location = gl.getUniformLocation(program, name)!
				return [name, location]
			})

			return Object.fromEntries(entries) as Record<string, WebGLUniformLocation>
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
		window.requestAnimationFrame(draw)
	}
}
