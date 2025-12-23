(ns home.hero
  (:require
   [sketch :as s]
   [home.icon :as icon]
   [util :refer [map-values clamp mapn]]))

(def repel-radius 75)
(def repel-scale 100)
(def restore-scale 7)
(def drag-scale 3)
(def icon-scale 4)
(def stretch-extent 250)

(def connection-color "#555")

(defn point->id [p] (str p))
(defn points-equal? [a b]
  (zero? (compare a b)))

(defn transform-point [p]
  (let [{:keys [x y w h]} icon/viewbox
        center (mapv #(/ % 2) [w h])
        centered (mapv - p [x y] center)
        scaled (mapv (partial * icon-scale) centered)]
    scaled))

(defn collect-points [lines]
  (reduce conj {} (map (juxt point->id transform-point) (.flat lines))))

(defn dist-sq [a b]
  (let [[dx dy] (mapv - a b)]
    (+ (* dx dx) (* dy dy))))

(defn dist [a b]
  (js/Math.sqrt (dist-sq a b)))

(defn collect-connections [points lines]
  (mapv
   (fn [[a b]]
     (let [aid (point->id a)
           bid (point->id b)
           d (* icon-scale (dist a b))]
       [aid bid d]))
   lines))

(defn make-particle [p jiggle?]
  (let [start (mapv parseFloat p)
        start-scale (if jiggle? 2 1)
        jiggle-scale (if jiggle? 200 0)
        scale (partial * start-scale)
        jiggle #(+ (s/random (- jiggle-scale) jiggle-scale) %)
        pos (mapv (comp jiggle scale) start)]
    {:pos pos
     :start start
     :vel [0 0]
     :acc [0 0]}))

(defn seed [played?]
  (fn []
    (let [jiggle? (not played?)
          points (collect-points icon/lines)
          connections (collect-connections points icon/lines)
          particles (map-values #(make-particle % jiggle?) points)]
      {:connections connections
         :particles particles})))

(defn add-force [particle f scale]
  (update particle :acc (partial mapv (comp (partial * scale) +) f)))

(defn repel [{p :pos :as particle} r min-dist]
  "Add force to particle that repels repeller r"
  (let [dd (dist-sq p r)
        repel? (and (s/pointer-down?) (< dd (* min-dist min-dist)))
        repel-force (mapv - p r)]
    (if repel?
      (add-force particle repel-force repel-scale)
      particle)))

(defn restore [{p :pos s :start :as particle}]
  (let [restore-force (mapv - s p)]
    (add-force particle restore-force restore-scale)))

(defn drag [{v :vel :as particle}]
  (let [drag-force (mapv - v)]
    (add-force particle drag-force drag-scale)))

(defn apply-physics [p dt]
  (let [scale #(mapv (partial * dt) %)
        acc (:acc p)
        vel (mapv + (:vel p) (scale acc))
        pos (mapv + (:pos p) (scale vel))]
    (assoc p :vel vel :pos pos)))

(defn update-particle [{:keys [dt pointer]} p]
  (-> p
      (assoc :acc [0 0])
      (repel pointer repel-radius)
      (restore)
      (drag)
      (apply-physics dt)))

(defn tick [{:keys [particles] :as model}]
  (let [dt (s/delta)
        pointer (mapv - (s/pointer-pos) (s/center))
        arg {:dt dt :pointer pointer}
        particles (map-values (partial update-particle arg) particles)]
    (assoc model :particles particles)))

(defn draw-repeller []
  (let [[x y] (s/pointer-pos)]
    (s/circle x y repel-radius {:stroke "grey"})))

(defn draw-connection [pa pb dd]
  (let [[x1 y1] (:pos pa)
        [x2 y2] (:pos pb)
        width (-> dd
                  (clamp 0.01 stretch-extent)
                  (mapn 0.01 stretch-extent 3 0.01))]
    (s/line x1 y1 x2 y2 {:stroke connection-color :stroke-width width :translate (s/center)})))

(defn draw [{:keys [particles connections]}]
  (when (s/pointer-down?)
    (draw-repeller))
  (doall
   (for [[a b d] connections]
     (let [pa (get particles a)
           pb (get particles b)
           d' (dist (:pos pa) (:pos pb))
           dd (Math.abs (- d' d))]
       (draw-connection pa pb dd)))))

(defn run-hero [played?]
  (s/run
   {:clear? true
    :size :auto
    :frame-rate 60
    :isolate? true
    :seed (seed played?)
    :tick tick
    :draw draw}))
