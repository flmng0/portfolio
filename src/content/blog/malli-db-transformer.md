---
title: Mapping Column Names with Malli Schemas
description: Clojure development blog on how, and why, I made my own Malli transformer, which allows the user to map database column names to Clojure's map keys.
published: 2026-04-12
banner: /banners/blog/malli-db-transformer.png
---

# Mapping Column Names with Malli Schemas

*Not interested in the rambling? [Jump straight to my solution.](#solution)*

Hello! Recently, I've been working on my own service manager for VPS deployed
applications. I decided to pursue this project in Clojure for learning
purposes.

Lisp languages have always interested me, and I have some experience with the
Java ecosystem, so I thought Clojure would be a good Lisp to start with.

## Contents

## Project Description

Barista is the name of my (eventual) service manager web app, which I've been
writing in Clojure.

The project uses [HoneySQL] for generating SQL queries, and [Malli] for schema
validation. If you aren't in the know, Malli schemas are very versatile, and I
had been using them for form validation.

Here is an example schema:

```clojure
(def Person
  [:map
   [:given-name :string]
   [:family-name :string]
   [:email {:optional true} :string]])
```

This schema can then be used for validation, including generating validation
messages.

[HoneySQL]: https://github.com/seancorfield/honeysql
[Malli]: https://github.com/metosin/malli

## The Problem I Encountered

In Clojure, variables are generally written in `kebab-case`, however if you don't know
already, `kebab-case` is considered bad practice for SQL column naming.

I needed some way to convert from `kebab-case` to the more common `snake_case`
before generating SQL queries.

There is another issue which I didn't think of at first, but no spoilers :)

## Attempt One: Utility Function

My first attempt to solve this issue was to create a utility function for
constructing `INSERT INTO table` statements with HoneySQL.

HoneySQL can help generate insert statements with the following structure:

```clojure
(let [table "some_table_name"
      rows [{:given_name "Gabby" :family_name "Davis"}
            {:given_name "Tim" :family_name "Davis" :email "me@timd.dev"}]]
  (sql/format {:insert-into table
               :values rows}))
```

The above will produce the following SQL query:

```sql
INSERT INTO some_table_name
  (given_name, family_name, email)
VALUES
  ('Gabby', 'Davis', NULL),
  ('Tim', 'Davis', 'me@timd.dev');
```

<details><summary>Note on Safety</summary>
HoneySQL will actually produce a query which uses parameters to avoid SQL
injection. Don't worry if you saw this and immediately screamed at your 
monitor/phone. 
</details>

Also, HoneySQL provides a way to manually specify the order of columns you're
providing. This will produce the same SQL as before:

```clojure
(let [table "some_table_name"
      columns [:given_name :family_name :email]
      rows [["Gabby" "Davis" nil]
            ["Tim" "Davis" "me@timd.dev"]]]
  (sql/format {:insert-into table
               :columns columns
               :rows rows})
```

Given this information, I'll show you the function I initially[^1] came up with
to solve my problem. An explanation will follow.

[^1]: This is not the original, I lost that to the sands of time (forgot to
    commit it). The original was hard-coded to convert `kebab-case` to
    `camel_case`, with no good way to modify this behaviour.

```clojure
(defn insert-into-query [table columns rows]
  (let [column-names (map (fn [col]
                            (if (vector? col) (second col) col))
                          columns)
        convert-row (apply juxt (map (fn [col]
                                       (if (vector? col) (first col) col))
                                     columns))
        rows (map convert-row rows)]
    (sql/format
     {:insert-into table
      :columns column-names
      :values rows})))
```

If we wanted to produce the same SQL query we have in previous examples, we
could do the following:

```clojure
(insert-into-query 
  ; table name
  "some_table_name"
  ; column mapping
  [[:given-name :given_name] [:family-name :family_name] :email]
  ; our data
  [{:given-name "Gabby" :family-name "Davis"}
   {:given-name "Tim" :family-name "Davis" :email "me@timd.dev"}])
```

> ... Okay what?

Alright - if it looks like I've just overcomplicated everything, you'd be
right. However, if you pay attention, this function converts our `:kebab-case`
keys into `snake_case` column names as we wanted!

The function works by checking, for each `col` in `columns`. If `col` is a
`:keyword` return it on. If it is a vector, it assumes that the first element
is the source data `:key`, and the second element is the destination
`column_name`.

<details><summary>Keys as Functions in Clojure</summary>

Clojure has a very nice feature, which can be jarring at first, where
`:keyword`s can be used to access maps.

For example, to retrieve the email from a map like `{:given-name "Tim",
:family-name "Davis", :email "me@timd.dev"}`:

```clojure
(def tim {:given-name "Tim", :family-name "Davis", :email "me@timd.dev"})
(:email tim)
; => "me@timd.dev"

; The below also do the same:

(def k :email)
(k tim)
(tim k)
(tim :email)
```

When we're doing some sort of key-mapping... thing, we just need to store the
keys we want to access, and can use them directly.

</details>

Now I have an easy way to convert Clojure maps into an insert query, with
any column name I want.

> But what about converting the other way?

Oh... yeah...

Since this was so early into the development of Barista, I didn't even think
about going the other way yet. For an actual answer, I would have to write
another complete helper function.

## Attempt Two: Malli Schema Transformer

To spoil the ending a little bit, here is my solution:

<div id="solution">

```clojure
(def db-transformer
  "Transformer which converts map keys to/from a column name, based on
  a :db/column property.
  
  For example, given the schema:
  
    [:map [:first-name {:db/column :first_name} :string] [:surname :string]]

  ... using this transformer will convert :first-name to :first_name when
  encoding, and convert :first_name to :first-name when decoding.
  "
  (let [collect-key-map ; Collect a map from map-key -> column-name
        (fn [schema]
          (->> (m/children schema)
               (reduce (fn [acc [k opts-or-type]]
                         (if-let [col (:db/column opts-or-type)]
                           (assoc acc k col)
                           acc))
                       {})))
        collect-reverse-key-map ; Collect the key-map then reverse it
        (fn [schema]
          (reduce-kv #(assoc %1 %3 %2) {} (collect-key-map schema)))
        compile ; Checks if a schema has any :db/column fields
        (fn [collector]
          (fn [schema _]
            (when-let [key-map (not-empty (collector schema))]
              (fn [x]
                (reduce-kv (fn [acc k v] (assoc acc (or (k key-map) k) v)) {} x)))))]

    (mt/transformer
     {:encoders {:map {:compile (compile collect-key-map)}}
      :decoders {:map {:compile (compile collect-reverse-key-map)}}})))
```

</div>

> Wait this doesn't look any simpler. How is this better?

I'm so glad you asked, mysterious voice in my head. I'll explain how this is
better, and then I will detail the implementation.

### How It's Better

I was already using Malli schemas to structure my data. Consider the example
schema from the start of this post:

```clojure
(def Person
  [:map
   [:given-name :string]
   [:family-name :string]
   [:email {:optional true} :string]])
```

With this schema, and Malli's utilities, I can define a "decoder" and
"encoder", which can encode using certain "transformations".

For example, if I wanted to convert from `string` values to actual datatypes, I could use:

```clojure
(m/decode :int "420" mt/string-transformer) 
; => 420
```

If we modify our schema a bit:

```clojure
(def Person
  [:map
   [:given-name {:db/column :given_name} :string]
   [:family-name {:db/column :family_name} :string]
   [:email {:optional true} :string]])
```

We can use our `db-transformer` whilst encoding our rows to produce column names compatible with our database:

```clojure
(m/encode Person {:given-name "Gabby" :family-name "Davis"} db-transformer) 
; => {:given_name "Gabby" :family_name "Davis"}
```

But wait, there's more! What about the other way? Easy:

```clojure
(m/decode Person {:give_name "Gabby" :family_name "Davis"} db-transformer)
; => {:given-name "Gabby" :family-name "Davis"}
```

### How It Works

Hopefully you can see how using a Malli transformer is better in the long run.
Now I'm going to (try to) explain how it works.

We're going to start from the bottom line and then try to describe from
first-principles. 

```clojure
; ...
(mt/transformer
  {:encoders {:map {:compile (compile collect-key-map)}}
   :decoders {:map {:compile (compile collect-reverse-key-map)}}})
```

When we define a transformer, we tell Malli what type of data we are able to
transform, and for which "directions"[^2]. In our case, we are defining a
transformer for `:map`s, and handling both encoding, and decoding.

[^2]: I say "directions", but honestly it's not well documented. Internally
    it's referred to as phases... I think.

Another important concept for Malli is that everything can be "compiled". For a
given schema, we can compile a decoder like so:

```clojure
(def decode-int (m/decoder :int mt/string-transformer))

(decode-int "420")
; => 420
```

For transformers, the `:compile` key is a method which checks a given schema,
and precomputes what it can. For our case, once we get a schema, we can collect
all of the fields which have a `:db/column` annotation.

That brings us to our `collect-key-map` binding. Let's see what
`collect-key-map` does on its own:

```clojure
; Redefining here so you don't need to scroll up :)
(defn collect-key-map [schema]
  (->> (m/children schema)
       (reduce (fn [acc [k opts-or-type]]
                 (if-let [col (:db/column opts-or-type)]
                   (assoc acc k col)
                   acc))
               {})))

(collect-key-map Person)
; => {:given-name :given_name, :family-name :family_name}

(collect-key-map [:map [:foo :int] [:bar :int]])
; => {}
```

So, with `collect-key-map`, we can get a map of keys to column names.
`collect-reverse-key-map` is the same thing, but from column names to keys.

<details><summary>More Detailed Explanation</summary>

The `collect-key-map` method uses a the `->>` macro (read: thread-last macro).
It's easiest to show an example for how the thread-last macro works:

```clojure
; This
(->> (range 10))
     (filter odd?)
     (reduce + 0))

; Becomes
(reduce + 0 (filter odd? (range 10)))
```

See https://clojure.org/guides/threading_macros for more detail.

`reduce` is the other main part of `collect-key-map`. `reduce` will take a
collection, an initial state, and a reducer function. It will then recursively
applie the reducer function to the initial state, with each value of the
collection.

Let's walk through an example:

```clojure
(defn add [acc x] (+ acc x))

(reduce add 0 [1 2 3])
```

The first thing reduce does, is set `acc` to `0`. Then it will call our reducer
function (`add`) with `acc` and the first value of our collection (`1`).

```clojure
(add 0 1)
```

Then, it sets `acc` to the result of this (`acc = 0 + 1 = 1`), and runs the
reducer function again with the next value in the collection (`2`).

```clojure
(add 1 2)
```

Once again, it sets `acc` to the result of this (`3`), and runs the reducer
function on the next - and final - value of our collection (`3`).

```clojure
(add 3 3)
```

Reducing can be very useful, since you can start with any value, like an empty
list, or empty map. 

In Clojure, we can use `assoc` to add a value to a map. For example:

```clojure
(assoc {:a 1 :b 2} :c 3)
; => {:a 1 :b 2 :c 3}
```

So lets try making a map:

```clojure
(reduce (fn [acc x]
          (assoc acc x (to-lowercase x)))
        ["John" "Billy" "Jade"])

; => {"John" "john",
;     "Billy" "billy",
;     "Jade" "jade"}
```

Back to our `collect-key-map` function, taking out the body, and filling in our
parameters for `Person`, we get:

```clojure
(->> (m/children Person)
     (reduce (fn [acc [k opts-or-type]]
               (if-let [col (:db/column opts-or-type)]
                 (assoc acc k col)
                 acc))
             {}))

; becomes

; with seaparted "reducer" function
(defn reducer [acc [k opts-or-type]]
  (if-let [col (:db/column opts-or-type)]
    (assoc acc k col)
    acc))

(->> [[:given-name {:db/column :given_name} :string]
      [:family-name {:db/column :family_name} :string]
      [:email {:optional true} :string]]
     (reduce reducer {}))
```

The first iteration of our reduction looks like:

```clojure
(reducer [{} [:given-name {:db/column :given_name}]])
; => {:given-name :given_name}
```

For brevity's sake I won't walk through the whole thing, and there's some
things I skipped like [destructuring]. However, I hope with these concepts
explained, and the first reduction demonstrated, you can see how the rest comes
together.

[destructuring]: https://clojure.org/guides/destructuring

`collect-reverse-key-map` is defined as the following:

```clojure
(fn [schema]
  (reduce-kv #(assoc %1 %3 %2) {} (collect-key-map schema)))
```

Which means, we first get the normal key-map, and then we reverse all the keys.

The below:

```clojure
#(assoc %1 %3 %2)
```

Is a shorthand syntax for the following:

```clojure
(fn [a b c] (assoc a c b))
```

Finally, `reduce-kv` is the same as `reduce`, except it passes the `acc`, the
`key` and the `value` of a map all as separate arguments.

</details>


Finally, our `compile` binding takes either `collect-key-map` or
`collect-reverse-key-map` as an argument. It will then, itself, return a
function which will run the "collector" function on our schema.

After it collects the key-map, it checks if the result is empty. If the result
is empty, then it returns `nil`, which tells Malli nothing needs to be done.

If the result is not empty, it returns a method which reduces some map `x`
using our collected keys.

Since most of the hard work is done at compile time[^3], the decoder and
encoder only does the bare minimum at runtime.

[^3]: Kind of compile time. This code will run when the program launches, but
    I'm unsure if there's a way to actually compile it.


## Concluding Thoughts

Overall, since everything is just data in Clojure, it's easy to do whatever I
need to make my life easier.

There is most likely somebody else's project out there that achieves the same
thing -- this was easy enough that I didn't even consider looking.

With Lisp's REPL environment, whenever I need to check or test my logic, I just
run it with a simple keybind. These tests can be written in `(comment)` blocks
too, which means I can leave them in the source code, and not have to worry
about it running in the actual application.

Developers from Clojure, as well as other Lisp communities, always talk about
how nice the REPL environment is. I never understood, since:

> I've got a REPL in Elixir already, and it's okay... I guess?

The above is what I used to think, but the feedback loop of in-editor
evaluation is even better than, say, Hot-Module Reloading.

I definitely think Clojure isn't for everyone, but I enjoy developing in it
quite a bit, and see it in my future projects.
