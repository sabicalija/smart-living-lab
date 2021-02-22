<template>
  <div ref="container" class="container"></div>
</template>

<script>
import {
  PerspectiveCamera,
  Vector3,
  Scene,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  WebGLRenderer,
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
      camera: null,
      texture: null,
      scene: null,
      renderer: null,
      isUserInteracting: false,
      down: {
        x: 0,
        y: 0,
        lon: 0,
        lat: 0,
      },
      lon: 0,
      lat: 0,
      phi: 0,
      theta: 0,
      width: 0,
      height: 0,
      ratio: 0,
    };
  },
  computed: {
    source() {
      return this.$site.base + this.src.substring(1);
    },
  },
  methods: {
    init() {
      this.camera = new PerspectiveCamera(75, this.ratio, 1, 1100);
      this.camera.target = new Vector3(0, 0, 0);

      this.scene = new Scene();

      const geometry = new SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      // const material = new MeshBasicMaterial({
      //   map: new TextureLoader().load(this.source),
      // });

      const material = new MeshBasicMaterial({
        map: this.texture,
      });

      const mesh = new Mesh(geometry, material);

      this.scene.add(mesh);

      this.renderer = new WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.$refs.container.appendChild(this.renderer.domElement);

      this.$refs.container.addEventListener(
        "mousedown",
        this.onMouseDown,
        false
      );
      this.$refs.container.addEventListener(
        "mousemove",
        this.onMouseMove,
        false
      );
      this.$refs.container.addEventListener("mouseup", this.onMouseUp, false);
      this.$refs.container.addEventListener("wheel", this.onMouseWheel, false);

      // this.$refs.container.addEventListener("dragover", onDragOver, false);
      // this.$refs.container.addEventListener("dragenter", onDragEnter, false);
      // this.$refs.container.addEventListener("dragleave", onDragLeave, false);
      // this.$refs.container.addEventListener("drop", onDrop, false);
    },
    onWindowResize() {},
    onMouseDown(event) {
      event.preventDefault();
      this.isUserInteracting = true;
      this.down.x = event.clientX;
      this.down.y = event.clientY;
      this.down.lon = this.lon;
      this.down.lat = this.lat;
    },
    onMouseMove(event) {
      if (this.isUserInteracting === true) {
        this.lon = (this.down.x - event.clientX) * 0.1 + this.down.lon;
        this.lat = (event.clientY - this.down.y) * 0.1 + this.down.lat;
      }
    },
    onMouseUp(event) {
      this.isUserInteracting = false;
    },
    onMouseWheel(event) {
      this.camera.fov += event.deltaY * 0.05;
      this.camera.updateProjectionMatrix();
    },
    animate() {
      this.$nextTick(this.animate);
      this.updateCamera();
    },
    updateCamera() {
      if (this.isUserInteracting === false) this.lon += 0.1;
      this.lat = Math.max(-85, Math.min(85, this.lat));
      this.phi = TMath.degToRad(90 - this.lat);
      this.theta = TMath.degToRad(this.lon);

      this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
      this.camera.target.y = 500 * Math.cos(this.phi);
      this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

      this.camera.lookAt(this.camera.target);
      this.renderer.render(this.scene, this.camera);
    },
  },
  async mounted() {
    const { width } = this.$refs.container.parentNode.getBoundingClientRect();
    this.width = width;
    this.height = (width * 9) / 16;
    this.ratio = this.width / this.height;

    // this.init();
    // this.animate();

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
  margin 1rem 0
</style>
