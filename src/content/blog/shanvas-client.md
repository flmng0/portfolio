---
title: Display a Real-Time Shared Canvas with Svelte
description: Learn how I implemented a tile-based pixel image board using JavaScript, Svelte and the HTML5 Canvas - including gesture based panning, zooming, and more.
published: 2026-04-13
prev: shanvas-backend
---

<script>
  import * as shanvas from "./shanvas";
</script>


# Building a Shared Canvas: Part Two - The Client
---

## Foreword

In the [previous part](/blog/shanvas-backend), we built a backend to serve a
paletted canvas of pixels. The backend also has an endpoint which sends events
from other users, to be received by an [`EventSource`][event-source].

For this part, first we will explore drawing the canvas to the screen, and
later we will go over connecting the canvas to our real-time canvas.

This tutorial assumes you are moderately familiar with Svelte(Kit) and the HTML
Canvas API, and that you have a working SvelteKit project. Please see the
[Svelte Tutorial][svelte-tut] or the [Canvas API Docs][html-canvas] if you are
not familiar with both.

<!-- By the end of this, we should have something looking like: -->
<!---->
<!-- <comp.FinalProduct /> -->

[event-source]: https://developer.mozilla.org/en-US/docs/Web/API/EventSource
[svelte-tut]: https://svelte.dev/tutorial
[html-canvas]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

## Contents

## Acquiring The Context And Drawing Tiles

With Svelte 5, we can use the `@attach` directive ([docs][attachments]) for any
client-side logic that needs access to an Element. For example:

```svelte
<script>
  function printText(elem) {
    console.log(elem.textContent);
  }
</script>

<h1 {@attach printText}>Hello, Svelte 5!</h1>
<p {@attach printText}>Attachments are awesome.</p>
```

Loading the above snippet would print "Hello, Svelte 5!" and then "Attachments
are awesome." to the console.

This is important, since SvelteKit will execute code in our `<script>` block
for server-side rendering, as well as on the browser. Using attachments, we can
ensure access to the element object.

Let's draw some tiles on a canvas now:

```svelte
<script>
  const TILE_COLUMNS = 200
  const TILE_ROWS = 200
  const TILE_SIZE = 20

  function drawTiles(context) {
    const { width, height } = context.canvas

    const visibleColumns = Math.ceil(width / TILE_SIZE)
    const visibleRows = Math.ceil(height / TILE_SIZE)

    for (let y = 0; y < visibleRows; y++) {
      for (let x = 0; x < visibleColumns; x++) {
        const hue = x * 5 + y * visibleColumns

        context.fillStyle = `hsl(${hue}, 100%, 50%)`
        context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
      }
    }
  }

  function tileDrawer(cvs) {
    const context = cvs.getContext('2d')
    drawTiles(context)
  }
</script>

<canvas width="500" height="500" {@attach tileDrawer}></canvas>
```

<shanvas.DrawTiles />

The main part I want you to pay attention to here is that we only draw visible
tiles:

```js
const visibleColumns = Math.ceil(width / TILE_SIZE)
const visibleRows = Math.ceil(height / TILE_SIZE)
```

This way, we aren't drawing rectangles that are currently off screen. The
calculation for what's visible will change over time as we add more
interaction.

## The First Interactions

Now let's actually draw our pixel buffer, and add the ability to paint. For
now, we'll only let the user draw one color (black). We will add the ability to
draw using other colours after.

First, let's calculate and visualise which tile the user is currently hovering
over. Also, we will assume that the user is using a mouse for now.

```svelte
<script>
</script>
```

<shanvas.BasicStylus />


[attachments]: https://svelte.dev/docs/svelte/@attach
