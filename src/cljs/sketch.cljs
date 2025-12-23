(ns sketch)

(def state (atom nil))

(defn- init-state [{:keys [frame-rate context-type]}]
  (let [canvas (js/document.getElementById "sketchCanvas")
        context (.getContext canvas (or context-type "2d"))]
    {:time 0 :frame-rate frame-rate :frame 0 :context context}))

(def default-size [500 500])

(defn- auto-size
  "Synchronise canvas size with element's DOM size"
  []
  (fn handle-resize []
    (let [cvs (canvas)
          w (.-clientWidth cvs)
          h (.-clientHeight cvs)]
      (resize w h)))
  (js/window.addEventListener "resize" handle-resize)
  (handle-resize))

(defn- update-time [t]
  (let [{start :start t' :time frame-rate :frame-rate} @state]
    (if (nil? frame-rate)
      (let [new-time (- t start)
            dt (- new-time t')]
        {:time new-time :dt (js/Math.min dt (/ 1000 60))})
      (let [dt (/ 1000 frame-rate)
            new-time (+ t' dt)]
        {:time new-time :dt dt}))))

(def event-queue (atom []))
(defn- push-event [event data]
  (swap! event-queue conj [event data]))

(defn- flush-events []
  (let [events @event-queue]
    (reset! event-queue [])
    events))

(defn- isolate-events [elem]
  (let [p (.-parentElement elem)
        siblings (filter (partial not= elem) (.-children p))]
    (doall
      (for [s siblings]
        (.setAttribute s "inert" true)))))

(defn- unisolate-events [elem]
  (let [p (.-parentElement elem)
        disabled (.querySelectorAll p "[inert]")]
    (doall
      (for [e disabled]
        (.removeAttribute e "inert")))))

(defn- listen-input [{:keys [isolate?]}]
  (let [cvs (canvas)]
    (fn pointer-moved [{x :clientX y :clientY}]
      (push-event :pointer-moved [x y]))
    (fn pointer-down [{x :clientX y :clientY}]
      (when isolate? (isolate-events cvs))
      (push-event :pointer-down [x y]))
    (fn pointer-up [{x :clientX y :clientY}]
      (when isolate? (unisolate-events cvs))
      (push-event :pointer-up [x y]))

    (.addEventListener cvs "pointermove" pointer-moved)
    (.addEventListener cvs "pointerdown" pointer-down)
    (.addEventListener cvs "pointerup" pointer-up)))


(defn- event->state [event]
  (let [[etype args] event]
    (case etype
      :pointer-moved (let [[x y] args] {:pointer {:x x :y y}})
      :pointer-down (let [[x y] args] {:pointer {:down true :x x :y y}})
      :pointer-up (let [[x y] args] {:pointer {:down false :x x :y y}}))))

(defn- process-input []
  (let [events (flush-events)]
    (if (empty? events)
      []
      (->> events
           (mapv event->state)
           (apply merge-with merge @state)))))

(defn run
  [{:keys [draw clear? clear-color seed tick size frame-rate isolate? context-type] :as opts}]
  (when tick (assert seed) ":seed state expected when using :tick")

  ; Set initial state
  (when (nil? @state) (reset! state (init-state opts)))

  (listen-input opts)

  ; Resize canvas to desired size
  (if (= size :auto)
    (auto-size)
    (resize (or size default-size)))

  ; Add the seed model value if provided
  (let [model (if (fn? seed) (seed) seed)]
    (swap! state assoc :model model))

  (fn process [t]
    (swap! state merge (process-input) (update-time t))

    (when (and tick (not (first-frame?)))
      (swap! state update :model tick))

    (when clear? (clear clear-color))
    (draw (:model @state))

    (swap! state update :frame inc))

  (fn frame-loop [t]
    (when (nil? (:start @state)) (swap! state assoc :start t))
    (let [{:keys [frame-rate start time]} @state
          frame-time (if frame-rate (/ 1000 frame-rate))
          t' (+ time start)
          process? (or (first-frame?) (nil? frame-rate) (> (- t t') frame-time))]
      (when process? (process t))
      (js/window.requestAnimationFrame frame-loop)))
  (js/window.requestAnimationFrame frame-loop))

(defn context [] (:context @state))
(defn canvas [] (.-canvas (context)))

; Constants and public getters
(def PI js/Math.PI)
(def TAU (* 2 PI))

(defn first-frame? []
  (zero? (:frame @state)))

(defn once [f]
  (when (first-frame?) (f)))

(defn rgb [r g b]
  (let [[r g b] (mapv #(* 255 (mod (or % 0) 1)) [r g b])]
    (str "rgb(" r "," g "," b ")")))

(defn spy [v] (println v) v)

(defn time [] (/ (:time @state) 1000))
(defn delta [] (/ (:dt @state) 1000))

(defn random [lo hi]
  (-> (js/Math.random)
      (* (- hi lo))
      (+ lo)))

(defn set-frame-rate [frame-rate]
  (swap! state assoc :frame-rate frame-rate))

(defn size [] ((juxt #(.-width %) #(.-height %)) (canvas)))

(defn resize
  ([size]
   (if (seq? size)
     (apply resize size)
     (resize size size)))
  ([w h]
   (let [cvs (canvas)]
     (set! (.-width cvs) w)
     (set! (.-height cvs) h))))

(defn center []
  (let [[w h] (size)] [(/ w 2) (/ h 2)]))

(defn pointer-pos []
  (if-let [pointer (:pointer @state)]
    ((juxt :x :y) pointer)
    [0 0]))

(defn pointer-down? []
  (get-in @state [:pointer :down]))

; Helpers for defining drawing methods
(defn- apply-opts [ctx {:keys [fill stroke stroke-width scale rotate translate]}]
  (when fill (set! (.-fillStyle ctx) fill))
  (when stroke (set! (.-strokeStyle ctx) stroke))
  (when stroke-width (set! (.-lineWidth ctx) stroke-width))
  (when scale
    (let [[x y] (if (seq? scale) scale [scale scale])
          (.scale ctx x y)]))
  (when translate
    (let [[x y] translate]
      (.translate ctx x y)))
  (when rotate (.rotate ctx rotate)))

(defn- draw [opts {:keys [init fill stroke]}]
  (let [opts (apply merge opts)]
    (doto (context)
      (.save)
      (apply-opts opts)

      ((fn [ctx]
         (when init (init ctx))
         (when (and fill (:fill opts)) (fill ctx))
         (when (and stroke (:stroke opts)) (stroke ctx))))

      (.restore))))

; Drawing methods
(defn clear [color]
  (let [[w h] (size)]
    (if color
      (rect 0 0 w h {:fill color})
      (.clearRect (context) 0 0 w h))))

; TODO: Currently this has issues, since things with stroke or fill are 
; only drawn when the draw function itself has :stroke or :fill set.
(defn scoped [f & opts]
  (doto (context)
    (.save)
    (apply-opts (apply merge opts))
    (f)
    (.restore)))

(defn rect [x y w h & opts]
  (draw
   opts
   {:fill #(.fillRect % x y w h)
    :stroke #(.strokeRect % x y w h)}))

(defn line [x1 y1 x2 y2 & opts]
  (draw
   opts
   {:init #(doto %
             (.beginPath)
             (.moveTo x1 y1)
             (.lineTo x2 y2))
    :stroke #(.stroke %)}))

(defn circle [x y r & opts]
  (draw
   opts
   {:init #(doto %
             (.beginPath)
             (.arc x y r 0 TAU))
    :fill #(.fill %)
    :stroke #(.stroke %)}))

(defn text [x y text & opts]
  (draw
   opts
   {:fill #(.fillText % text x y)
    :stroke #(.strokeText % text x y)}))

