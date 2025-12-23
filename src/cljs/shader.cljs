(ns shader
  (:require
    [sketch :as s]))

(def vert-src
 "#version 300 es
in vec2 aVertexPos;

void main() {
    gl_Position = vec4(aVertexPos, 0.0, 1.0);
}")

(def frag-prefix "#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
")

(defn compile-shader [gl src t]
  (let [s (.createShader gl t)
        status (doto gl
                 (.shaderSource s src)
                 (.compileShader s)
                 (.getShaderParameter s (.-COMPILE_STATUS gl)))]
    (if (not status)
      (throw (js/Error. "Failed to compile shader"))
      s)))

(defn compile-shader-program [gl vs fs]
  (let [prog (.createProgram gl)
        v (compile-shader gl vs (.-VERTEX_SHADER gl))
        f (compile-shader gl (str frag-prefix fs) (.-FRAGMENT_SHADER gl))
        status (doto gl
                (.attachShader prog v)
                (.attachShader prog f)
                (.linkProgram prog)
                (.getProgramParameter prog (.-LINK_STATUS gl)))]
    (if (not status)
      (throw (js/Error. "Failed to link shader program"))
      prog)))
  
(def quad-points
  [-1.0 1.0
   1.0 1.0
   1.0 -1.0
   -1.0 1.0
   1.0 -1.0
   -1.0 -1.0])
(def quad-vertex-components 2)
(def quad-vertex-count (/ (.-length quad-points) quad-vertex-components))

(defn- draw [{gl :gl vbo :vbo shader :shader}]
  (let [[w h] (s/size)]
    (.viewport gl 0 0 w h))
    
  (.clearColor gl 0.8 0.9 1.0 1.0)
  (.clear gl (.-COLOR_BUFFER_BIT gl))

  (.bindBuffer gl (.-ARRAY_BUFFER gl) vbo)

  (.drawArrays gl (.-TRIANGLES gl) 0 quad-vertex-count))

(defn- get-uniform-locations [gl prog]
  (let [vs (mapv (juxt identity #(.getUniformLocation gl prog %)) [:uColorTest :uResolution :uTime])]
    (into {} vs)))

(defn- update-uniforms [gl shader]
  (let [{:keys [uColorTest uResolution uTime]} (get-uniform-locations gl shader)]
    (.uniform2fv gl uResolution (s/size))
    (.uniform1fv gl uTime [(s/time)])))

(defn- tick [{gl :gl shader :shader :as m}]
  (update-uniforms gl shader)
  m)

(defn- setup-vertex-array [gl shader]
  (let [data (js/Float32Array. quad-points)
        buf (.createBuffer gl)
        vao (.createVertexArray gl)
        aVertexPos (.getAttribLocation gl shader "aVertexPos")]
    (.bindBuffer gl (.-ARRAY_BUFFER gl) buf)
    (.bufferData gl (.-ARRAY_BUFFER gl) data (.-STATIC_DRAW gl))

    (.bindVertexArray gl vao)
    (.enableVertexAttribArray gl aVertexPos)
    (.vertexAttribPointer gl aVertexPos quad-vertex-components (.-FLOAT gl) false 0 0)))
    
(defn runShader [frag-src]
  (fn seed []
    (let [gl (s/context)
          shader (compile-shader-program gl vert-src frag-src)]
     (setup-vertex-array gl shader)
     (.useProgram gl shader)
     {:gl gl :shader shader :uniforms (get-uniform-locations gl shader)}))

  (s/run {:seed seed
          :tick tick
          :draw draw
          :context-type "webgl2"}))

