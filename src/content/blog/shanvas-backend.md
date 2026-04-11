---
title: Build a Shared Canvas Backend with Go
description: How I built a self-hosted real-time API in Go, to draw with my friends and family from afar.
published: 2026-04-11
---

# Building a Shared Canvas: Part One - The Backend

---

## Motivation

I've recently moved to another city to pursue my sports, as well as expand my
career. Unfortunately, I neglected searching for employment beforehand. Besides
the many downsides of being unemployed, I do have a lot more free time on my
hands -- when I'm not applying for every job I can, of course.

With my spare time, I decided to complete a project I've wanted to do for a
while now: an always-open [r/place] clone.

<details><summary>Secret Reason</summary>
Also, I kinda miss my family. Having more stuff that we can interact
together with, real time, make me happy.
</details>

This post will cover the implementation of the backend. The next part will
explain the client, so it's not a fire-hydrant of information.

[r/place]: https://www.reddit.com/r/place/

<!-- For remark-toc -->
## Contents

## Stack Rationale

I decided that I would develop this project with SvelteKit for the frontend,
and Go for the backend. SvelteKit powers all of this site already, so that was
easy. The decision to use Go was a bit different.

Personally, I love learning new things. I've been using Elixir with Phoenix for
a while now. Whilst I think I'm very productive with Phoenix, real-time
applications are a solved problem.

Elixir runs on the BEAM VM, along with Erlang and Gleam (which I also want to
try). The BEAM VM was made for telephony, and thus has a large focus on
concurrency.

Simply put, it would have been too easy to do it with Phoenix, and I wanted to
retread my history with Go.


## Canvas State

The frontend needs to know the size of the canvas (`width` x `height`), and the
colors for each pixel on the canvas.

A standard RGB colour takes one byte per color channel. Most systems represent
a color with a 32-bit (4 byte) integer in the format ARGB.

I wanted a big canvas, with 1000 by 1000 pixels. If I represented colours in
the standard way, that would be:

$$ 
4 \times 1{,}000 \times 1{,}000 = 4{,}000{,}000 \text{b} \approx 4 \text{mb}
$$

Realistically, this isn't much data with the modern internet; there is a very
easy way to reduce this data though: paletted colours.

Instead of allowing the user to use any colour, we give them a limited set of
colours. I chose 16 colours, since that fits within 4 bits.

*NOTE: I haven't taken advantage of this yet, but plan to in future versions.*

Now that each pixel can be represented by a single byte, our calculation becomes:

$$
1 \times 1{,}000 \times 1{,}000 = 1{,}000{,}000 \text{b} \approx 1 \text{mb}
$$

A simple change, which makes the frontend interface easier, and reduces the
size of our data by 4 times!

For our palette, since Go automatically initializes data to 0, we make sure our
palette has our "background" colour first. In my case, I used white.

Finally, the canvas is represented as the below structure:

```go
type Canvas struct {
  Width   int
  Height  int
  Buffer  []byte
}
```

`Buffer` is a flat representation of our pixels, initialized with `make([]byte, width*height)`.


## HTTP Endpoints

For the API itself, there are three main endpoints:
1. Load the current pixels.
2. Modify a pixel.
3. Receive pixels painted by other users.

There is also a `/config` route, which just sends the canvas palette and dimensions. We will skip that one since it is rather simple.


### 1. Load the current pixels.

Since we're only working with 1mb of data, our endpoint can be simply:

```go
http.HandleFunc("GET /", func (w http.ResponseWriter, r *http.Request) {
  // octet-stream is a raw-data blob
  w.Header().Add("Content-Type", "application/octet-stream")

  // io.Copy(dst, src) expects src to implement io.Reader
  reader := bytes.NewReader(canvas.Buffer)
  io.Copy(w, reader)
})
```


### 2. Modify a pixel.

I chose to use a `PATCH` endpoint served at `/`. I'll talk more about this
decision afterwards.

The server needs to know where we want to paint, and what palette index to use.
This is represented by a `PaintEvent`, which I will describe later.

```go
// For the sake of this snippet, assume this is initialized
var listeners map[string]chan PaintEvent

http.HandleFunc("PATCH /", func (w http.ResponseWriter, r *http.Request) {
  var event PaintEvent

  if err := json.Unmarshal(body, &event); err != nil {
    message := fmt.Sprintf("Bad format: %v", err)
    http.Error(w, message, http.StatusBadRequest)
    return
  }

  // Client-specific user ID.
  uid := getUID(r)
  
  // Commits the event to the canvas' pixel buffer.
  canvas.Paint(event)
  
  // Broadcast the event to every "listener" except ourselves.
  for listenerId, listener := range listeners {
    if uid == listenerId {
      continue
    }

    listener <- event
  }
})
```


### 3. Receive pixels painted by other users.

We will use [Server-Sent Events] to receive events from the server. Again, I
will explain in a moment.

Server-Sent Events allow the client to maintain a persistent connection to the
server, and events are sent one-way (server to client). They have the
`Content-Type`: `text/event-stream`. Each event has the following format:

```
event: event_name
data: Some data here
```

Separate events are delimited by two newlines (`"\n\n"`). Then, in JavaScript you can receive the events using an `EventSource`:

```js
const source = new EventSource("https://example.com/sse")

source.addEventListener("event_name", (event) => {
  const message = event.data
  alert(message)
})
```

Since the event data can be any text, we can also send JSON data, and then use
`JSON.parse` from JavaScript.

```go
http.HandleFunc("GET /sse", func (w http.ResponseWriter, r *http.Request) {
  // The ResponseWriter buffers data by default, so we need to "flush" our
  // writer when we send an event.
  flusher, ok := w.(http.Flusher)
  if !ok {
    http.Error(w, "Failed to create flusher", http.StatusInternalServerError)
    return
  }

  uid := getUID(r)

  header := w.Header()
  header.Add("Content-Type", "text/event-stream")
  // Optional, but recommended.
  header.Add("Cache-Control", "no-cache")

  // Add this user to the listeners.
  listener := make(chan PaintEvent)
  listeners[uid] = listener

  for event := range listener {
    data, err := json.Marshal(event)
    if err != nil {
      // Don't need to kill the connection because of one weird event.
      continue
    }
    
    // where sseMessage is a helper method to construct the 
    message := sseMessage("paint", data)
    fmt.Fprint(w, message)
    // flush the data to send it immediately
    flusher.Flush()
  }
})
```

*__NOTE:__ In the real code, there is also [logic to cleanup the listener]
when the connection is closed.*

[Server-Sent Events]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
[logic to cleanup the listener]: https://github.com/flmng0/shanvas-api/blob/c7c91f6fb8dc255de092877dea231a1712a1851a/shanvas/api.go#L271


## Recap

So far, the client can load the pixels, paint individual pixels, and listen to
events from other users.

The `PaintEvent` structure I mentioned looks like this:

```go
type PaintEvent struct {
  X     int `json:"x"`
  Y     int `json:"y"`
  Brush int `json:"brush"`
}
```

Now for the rationale I was putting off: **why not just use WebSockets?**

## Why PATCH and SSE?

Compared to Server-Sent Events, WebSockets are more complex to setup. I wanted
to do this project in Go, without relying on any third-party packages, as I
believe the Go standard library is plenty for most cases. 

Specifically, WebSockets require a [handshake][websocket-handshake], which is
somewhat verbose to implement. The Go standard library also does not have a
built-in implementation (as of writing).

Also, Go's third-party WebSocket implementations have a bit of tense history. A
few years ago, when I last used Go, everyone unanimously used [Gorilla
WebSockets][gorilla-websockets]. Since then, the Gorilla project has been
abandoned and [revived][gorilla-revived].

I wanted this to be a quick project, so decided I'd stick with SSEs, since they
are so easy to implement.

Users are only going to be sending a maximum of 10 events per second too, so
the impact of a round trip is barely noticable. Regardless, we can account for
latency using optimistic updates on the client.

[gorilla-websockets]: https://github.com/gorilla/websocket
[websocket-handshake]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#the_websocket_handshake
[gorilla-revived]: https://gorilla.github.io/blog/2023-07-17-project-status-update/


## Concluding Thoughts

Honestly, writing this post about the backend has been a bit exhausting. It's
my own fault for doing it all in one sitting, of course. 

I've decided to split this post into two parts though. The next part will cover
how the front-end is implemented in Svelte(Kit).

For now, thank you for reading this far. I feel like I'm rambling a lot, but I
wanted to share, since I had a lot of fun with this project.

If you haven't checked it out yet, visit my [Shared Canvas](/toys/shanvas) and
leave (draw) me a message!
