import type { Load, LoadEvent } from '@sveltejs/kit'
import type * as v from 'valibot'

type BlogPost<T extends v.GenericSchema> = v.InferOutput<T>

export function parseIndex<T extends v.GenericSchema>(
	modules: Record<string, unknown>,
	schema: T
): BlogPost<T>[]

export function parsePost<T extends v.GenericSchema>(
	module: any,
	schema: T
): BlogPost<T> & { body: any }

// export function makePostLoader
