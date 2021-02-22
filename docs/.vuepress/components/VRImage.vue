<template>
  <div ref="root">
    <span>
      {{ title }} (x: {{ position.x.toFixed(0) }}, y:
      {{ position.y.toFixed(0) }}, z: {{ position.z.toFixed(0) }}, fov:
      {{ fov }})
    </span>
    <img :src="source" alt="Picture" />
    <div ref="container" class="container"></div>
  </div>
</template>

<script>
import {
  Scene,
  PerspectiveCamera,
  Vector3,
  VRControls,
  WebGLRenderer,
  // ImageUtils,
  TextureLoader,
  UVMapping,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Math as TMath,
} from "three";

export default {
  name: "VRImage",
  props: {
    title: {
      type: String,
      default: false,
    },
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      scene: null,
      camera: null,
      mesh: null,
      isUserInteracting: false,
      // controls: null,
      // effect: null,
      renderer: null,
      texture: null,
      fov: 70, // Field of View
      ratio: 0,
      lon: 0,
      lat: 0,
      // Pointer
      onPointerDownPointerX: 0,
      onPointerDownPointerY: 0,
      onPointerDownLon: 0,
      onPointerDownLat: 0,
      // Mouse
      onMouseDownMouseX: 0,
      onMouseDownMouseY: 0,
      onMouseDownLon: 0,
      onMouseDownLat: 0,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  },
  computed: {
    source() {
      return this.$site.base + this.src.substring(1);
    },
  },
  methods: {
    onWindowResized(event) {
      this.renderer.setSize(this.width, this.height);
      this.camera.updateProjectionMatrix();
    },
    onDocumentMouseDown(event) {
      event.preventDefault();

      this.onPointerDownPointerX = event.clientX;
      this.onPointerDownPointerY = event.clientY;

      this.onPointerDownLon = this.lon;
      this.onPointerDownLat = this.lat;

      this.isUserInteracting = true;
      this.$refs.container.addEventListener(
        "mousemove",
        this.onDocumentMouseMove,
        false
      );
      this.$refs.container.addEventListener(
        "mouseup",
        this.onDocumentMouseUp,
        false
      );
    },
    onMouseMove(event) {
      this.lon =
        (event.clientX - this.onPointerDownPointerX) * 0.175 +
        this.onPointerDownLon;
      this.lat =
        (event.clientY - this.onPointerDownPointerY) * -0.175 +
        this.onPointerDownLat;
    },
    onMouseUp(event) {
      this.isUserInteracting = false;
      this.$refs.container.removeEventListener(
        "mousemove",
        this.onDocumentMouseMove,
        false
      );
      this.$refs.container.removeEventListener(
        "mouseup",
        this.onDocumentMouseUp,
        false
      );
    },
    onMouseWheel(event) {
      event.preventDefault();
      this.camera.fov += event.deltaY * 0.05;
      this.camera.fov = this.camera.fov < 45 ? 45 : this.camera.fov;
      this.camera.fov = this.camera.fov > 90 ? 90 : this.camera.fov;
      this.camera.updateProjectionMatrix();
    },
    init() {
      this.camera = new PerspectiveCamera(this.fov, this.ratio, 1, 1000);

      this.scene = new Scene();
      this.mesh = new Mesh(
        new SphereGeometry(500, 60, 40),
        new MeshBasicMaterial({ map: this.texture })
      );
      this.mesh.scale.x = -1;
      this.scene.add(this.mesh);

      this.renderer = new WebGLRenderer({
        antialias: true,
        // logarithmicDepthBuffer: true,
      });
      this.renderer.setSize(this.width, this.height);
      this.$refs.container.appendChild(this.renderer.domElement);

      this.$refs.container.addEventListener(
        "mousedown",
        this.onMouseDown,
        false
      );
      this.$refs.container.addEventListener(
        "mousewheel",
        this.onMouseWheel,
        false
      );
      this.$refs.container.addEventListener(
        "DOMMouseScroll",
        this.onMouseWheel,
        false
      );
      window.addEventListener("resize", this.onWindowResized, false);
      this.onWindowResized(null);
    },
    animate() {
      window.requestAnimationFrame(this.animate);
      // this.$nextTick(this.animate);
      this.render();
    },
    render() {
      if (!this.isUserInteracting) this.lon += 0.05;
      this.lat = Math.max(-85, Math.min(85, this.lat));

      const phi = TMath.degToRad(this.lat + 90);
      const theta = TMath.degToRad(this.lon);

      this.camera.position.x = 1000 * Math.sin(phi) * Math.cos(theta);
      this.camera.position.y = 1000 * Math.cos(phi);
      this.camera.position.z = 1000 * Math.sin(phi) * Math.sin(theta);

      // this.camera.position.x = 0;
      // this.camera.position.y = 0;
      // this.camera.position.z = 0;

      this.position.x = this.camera.position.x;
      this.position.y = this.camera.position.y;
      this.position.z = this.camera.position.z;

      this.camera.lookAt(this.scene.position);
      // this.camera.target = new Vector3(100, 100, 100);
      // this.camera.lookAt(this.camera.target);
      this.renderer.render(this.scene, this.camera);
    },
  },
  async mounted() {
    const { width } = this.$refs.root.parentNode.getBoundingClientRect();
    this.width = width;
    this.height = (width * 9) / 16;
    this.ratio = width / height;
    try {
      this.texture = await new TextureLoader().load(this.source);
      this.init();
      this.animate();
    } catch (e) {
      console.log("DEBUG", "Cannot load image/texture", e);
    }
  },
};
</script>

<style lang="stylus" scoped>
.container
  cursor move // fallback
  cursor grab
  cursor -moz-grab
  cursor -webkit-grab
  &:active
    cursor grabbing
    cursor -moz-grabbing
    cursor -webkit grabbing
</style>
