export type Point = [number, number]

export function subtract(a: Point, b: Point): Point
export function fromTo(a: Point, b: Point): Point

export function magSq(p: Point): number
export function mag(p: Point): number

export function scale(p: Point, scale: number): Point
export function remag(p: Point, newMag: number): Point
export function normalized(p: Point): Point

export function distSq(a: Point, b: Point): number
export function dist(a: Point, b: Point): number

export function map(x: number, minA: number, maxA: number, minB: number, maxB: number): number

export function clamp(x: number, min: number, max: number): number
