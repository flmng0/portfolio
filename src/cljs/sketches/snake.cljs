(ns sketches.doom
  (:require [sketch :as s]
            [util :refer [random]]))

(def width 25)
(def height 25)

(def start-move-delay 1.0)
(def move-delay 0.25)

(defn random-pos []
  [(random width) (random height)])

(def start-pos
  [(js/Math.floor (/ width 4))
   (js/Math.floor (/ height 2))])
(def start-apple-pos
  [(js/Math.floor (* 3 (/ width 4)))
   (js/Math.floor (/ height 2))])

(defn seed []
  {:snake (vec (for [dx (range 4)]
                 (update start-pos 0 (partial + (- dx)))))
   :apple start-apple-pos
   :dir [1 0]
   :dir-queue []
   :next-tick (+ (s/time) start-move-delay)})

(defn same-tile? [[ax ay] [bx by]]
  (and (= ax bx) (= ay by)))

(defn wrap-pos [[x y]]
  (cond
    (< x 0) [(dec width) y]
    (< y 0) [x (dec height)]
    (>= x width) [0 y]
    (>= y height) [x 0]
    true [x y]))

(defn move-snake [{:keys [dir snake apple] :as m}]
  (let [new (wrap-pos (mapv + (first snake) dir))
        snake (if (same-tile? new apple) 
                (do (println "om") snake) 
                (butlast snake))] 
    (assoc m :snake (cons new snake))))

(defn maybe-move-apple [{:keys [snake apple] :as m}]
  (if (same-tile? (first snake) apple)
    (loop [pos (random-pos)
           limit 200]
      (if (and (some (partial same-tile? pos) snake) (> limit 0))
        (recur (random-pos) (dec limit))
        (assoc m :apple pos)))
    m))

(defn maybe-lose [{:keys [snake] :as m}]
  (let [[head & tail] snake]
    (if (some (partial same-tile? head) tail)
      (assoc m :lose? true)
      m)))

(defn- pressed? [& keys]
  (some s/key-just-pressed? keys))

(defn push-dir [m]
  (let [q (:dir-queue m)
        [dx dy] (or (last q) (:dir m))]
    (cond
      (>= (.-length q) 2) m
      (and (= dy 0) (pressed? "ArrowUp" "w" "k")) (update m :dir-queue conj [0 -1])
      (and (= dy 0) (pressed? "ArrowDown" "s" "j")) (update m :dir-queue conj [0 1])
      (and (= dx 0) (pressed? "ArrowLeft" "a" "h")) (update m :dir-queue conj [-1 0])
      (and (= dx 0) (pressed? "ArrowRight" "d" "l")) (update m :dir-queue conj [1 0])
      true m)))

(defn pop-dir [m] 
  (let [q (:dir-queue m)
        [next-dir & remaining] q]
    (if (some? next-dir)
      (assoc m :dir next-dir :dir-queue (or remaining []))
      m)))
    
(defn maybe-update [m]
  (if (> (s/time) (:next-tick m))
    (-> m
        (pop-dir)
        (move-snake)
        (maybe-move-apple)
        (maybe-lose)
        (assoc :next-tick (+ (s/time) move-delay)))
    m))

(defn tick [m]
  (if (:lose? m)
    (if (s/key-just-pressed? "r") (seed) m)
    (-> m
        (push-dir)
        (maybe-update)))) 

(defn tile [pos fill]
  (let [tile-size (/ (s/width) width)
        [x y] (mapv (partial * tile-size) pos)]
    (s/rect x y tile-size tile-size {:fill fill})))

(defn draw-apple [pos]
  (tile pos "red"))

(defn draw-snake [snake]
  (loop [[head & tail] snake
         is-head? true]
    (let [fill (if is-head? "green" "lightgreen")]
      (tile head fill))
    (when (not (nil? tail)) (recur tail false))))

(defn draw-game-over []
  (s/text 40 200 "Game over!" {:fill "white"})
  (s/text 40 260 "Press `R` to restart" {:fill "white"}))
  
(defn draw [m] 
  (if (:lose? m)
    (draw-game-over)
    (do
      (draw-apple (:apple m))
      (draw-snake (:snake m)))))
      

(s/run
  {:clear? true
   :clear-color "#282a36"
   :print-seed? true
   :seed seed
   :tick tick
   :draw draw})
