(ns util)

(defn clamp [x lo hi]
  (min (max x lo) hi))

(defn mapn [x lo hi lo' hi']
  (+ lo' (* (- hi' lo') (/ (- x lo) (- hi lo)))))

(defn map-values [f coll]
  (into {} (mapv (juxt first (comp f second)) coll)))

; Definitely not optimised. Very naive, but it works :)
(defn distinct-by [comparer coll]
  "Get distinct entries with a custom equality function (comparer)"
  (reduce
   (fn [acc x]
     (if (nil? x)
       result
       (if (some (fn [y] (comparer x y)) acc)
         acc
         (conj acc x))))
   []
   coll))

; https://gist.github.com/danielpcox/c70a8aa2c36766200a95#gistcomment-2759497
(defn deep-merge [a & maps]
  (if (map? a)
    (apply merge-with deep-merge a maps)
    (apply merge-with deep-merge maps)))

(defn random
  ([to] (random 0 to))
  ([from to]
   (-> (js/Math.random)
       (* (- to from))
       (+ from)
       (js/Math.floor))))
   
(defn find-2d [haystack needle]
  (loop [y 0
         [line & tail] haystack]
    (if 
      (nil? line) nil
      (let [x (.indexOf line needle)]
        (if 
          (= -1 x) (recur (inc y) tail)
          [x y])))))
