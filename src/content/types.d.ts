import type { Component } from 'svelte'
import type { GenericSchema } from 'valibot'

export type CollectionEntry<Schema extends GenericSchema> = {
	slug: string
	body: Component | undefined
	data: InferOutput<Schema>
}

export type Collection<Schema extends GenericSchema> = {
	entries: CollectionEntry<Schema>[]
	getEntry: (slug: string) => CollectionEntry<Schema> | undefined
}

export type CollectionMaker = <Schema extends GenericSchema>(
	entries: Record<string, unknown>,
	schema: Schema
) => Collection<Schema>
