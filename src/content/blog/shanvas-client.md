---
title: Build a Shared Canvas Frontend with Svelte
description: How I display my self-hosted real-time shared canvas with Svelte, so I can draw with my friends and family.
draft: true
---

## The Client

Now that we have the backend handling and serving our canvas, we need a way to
display it. Since we are using SvelteKit, we can load all of our initial
parameters from the `+page.js` or `page.server.js` file.

For the sake of this post, I will prefix any of our API endpoints with `/api`.

Our initial state consists of:
- The state of the pixels
- The dimensions of the canvas
- Which colours are in our palette.

We have the `/` endpoint to load the pixels, and I glossed over it, but we also
have a `/config` endpoint. The `/config` endpoint returns the canvas dimensions
and which colours we will use.

So, in our `+page.js`:

```js
// +page.js
/** @type {import('./$types').PageLoad} */
export const load: PageLoad = async ({ fetch }) => {
  const configPromise = fetch('/api/config')
    .then((res) => res.json())

  const statePromise = fetch('/api/')
    .then((res) => res.blob())
    .then((blob) => blob.bytes())

  const [config, state] = await Promise.all([configPromise, statePromise])

  return { config, state }
}
```

To handle our front-end state, we will make a `canvas.svelte.js` file. This
way, we can share our state between Svelte components.

```js
// canvas.svelte.js

export const canvas = $state({
  pixels: [],
  palette: [],
  width: 0,
  height: 0,
  brushId: 1,
})

export function initCanvas(state, config) {
  canvas.pixels = Array.from(state)
  canvas.width = config.width
  canvas.height = config.height
  canvas.palette = config.palette
}
```


