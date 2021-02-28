<template>
  <div ref="root" class="root">
    <div ref="container" class="container"></div>
    <button @click="onClickFullscreen" class="fullscreen-toggle">
      <font-awesome-icon icon="expand" />
    </button>
  </div>
</template>

<script>
import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer,
} from "three";

import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

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
      mode: "default",
      fov: 75,
      camera: null,
      scene: null,
      renderer: null,
      isUserIntefacing: null,
      down: {
        x: 0,
        y: 0,
        lon: 0,
        lat: 0,
      },
      lon: 0,
      lat: 0,
    };
  },
  computed: {
    source() {
      return this.$site.base + this.src.substring(1);
    },
  },
  methods: {
    init() {
      const ratio = this.width / this.height;
      this.camera = new PerspectiveCamera(this.fov, ratio, 1, 1100);
      this.scene = new Scene();

      const geometry = new SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      const texture = new TextureLoader().load(this.source);
      const material = new MeshBasicMaterial({ map: texture });
      const mesh = new Mesh(geometry, material);
      this.scene.add(mesh);

      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.xr.enabled = true;
      this.renderer.xr.setReferenceSpaceType("local");
      this.$refs.container.appendChild(this.renderer.domElement);
      this.$refs.container.appendChild(VRButton.createButton(this.renderer));

      // this.$refs.container.style.touchAction = "none";
      this.$refs.container.addEventListener("pointerdown", this.onPointerDown);
      this.$refs.container.addEventListener("wheel", this.onMouseWheel);
      this.$refs.container.addEventListener("resize", this.onWindowResize);
      // this.$refs.container.addEventListener("dragover", )
      // this.$refs.container.addEventListener("dragenter", )
      // this.$refs.container.addEventListener("dragleave", )
      // this.$refs.container.addEventListener("drop", )
      this.renderer.setAnimationLoop(this.render);
    },
    animate() {
      window.requestAnimationFrame(this.animate);
      this.updateScene();
      // this.renderer.setAnimationLoop(this.render);
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    updateScene() {
      if (this.isUserIntefacing === false) this.lon += 0.1;
      this.lat = Math.max(-85, Math.min(85, this.lat));
      const phi = MathUtils.degToRad(90 - this.lat);
      const theta = MathUtils.degToRad(this.lon);

      const x = 500 * Math.sin(phi) * Math.cos(theta);
      const y = 500 * Math.cos(phi);
      const z = 500 * Math.sin(phi) * Math.sin(theta);

      this.camera.lookAt(x, y, z);
      this.renderer.render(this.scene, this.camera);
    },
    updateSize() {
      const { width } = this.$refs.root.getBoundingClientRect();
      this.width = width;
      this.height = (width * 9) / 16;
    },
    updateRendererSize() {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },
    resetSize() {
      const { width } = this.$refs.root.parentNode.getBoundingClientRect();
      this.width = width;
      this.height = (width * 9) / 16;
    },
    onWindowResize() {
      this.updateSize();
      this.updateRendererSize();
    },
    onPointerDown(event) {
      if (event.isPrimary === false) return;

      this.isUserIntefacing = true;

      this.down.x = event.clientX;
      this.down.y = event.clientY;

      this.down.lon = this.lon;
      this.down.lat = this.lat;

      this.$refs.container.addEventListener("pointermove", this.onPointerMove);
      this.$refs.container.addEventListener("pointerup", this.onPointerUp);
    },
    onPointerMove(event) {
      if (event.isPrimary === false) return;
      this.lon = (this.down.x - event.clientX) * 0.1 + this.down.lon;
      this.lat = (event.clientY - this.down.y) * 0.1 + this.down.lat;
    },
    onPointerUp(event) {
      if (event.isPrimary === false) return;
      this.isUserIntefacing = false;
      this.$refs.container.removeEventListener("pointermove", this.onPointerMove);
      this.$refs.container.removeEventListener("pointerup", this.onPointerUp);
    },
    onMouseWheel(event) {
      event.preventDefault();
      this.fov = Number(this.camera.fov + event.deltaY * 0.05).toFixed(0);
      this.camera.fov = MathUtils.clamp(this.fov, 10, 75);
      this.camera.updateProjectionMatrix();
    },
    async onClickFullscreen(event) {
      if (this.mode === "default") {
        await this.enterFullScreen();
      } else {
        this.resetFullScreen();
      }
    },
    async enterFullScreen() {
      if (this.mode === "fullscreen") return;
      this.mode = "fullscreen";
      this.width = window.screen.width;
      this.height = window.screen.height;
      this.updateRendererSize();
      this.$refs.root.classList.add("fullscreen");
      await this.$refs.root.requestFullscreen();
    },
    async resetFullScreen() {
      if (this.mode === "default") return;
      this.mode = "default";
      this.resetSize();
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.$refs.root.classList.remove("fullscreen");
      if (window.document.fullscreenElement) window.document.exitFullscreen();
    },
    async onFullscreenChange(event) {
      if (!window.document.fullscreenElement) {
        await this.resetFullScreen();
      }
    },
  },
  mounted() {
    this.updateSize();
    this.init();
    this.animate();
    window.document.addEventListener("fullscreenchange", this.onFullscreenChange);
  },
  beforeDestroy() {
    window.document.removeEventListener("fullscreenchange", this.onFullscreenChange);
  },
};
</script>

<style lang="stylus" scoped>
.root
  position relative
  .container
    cursor move
    #VRButton
      position relative !important
  .fullscreen-toggle
    cursor pointer
    padding 0
    border unset
    background unset
    color white
    position absolute
    right 1rem
    top 1rem
    &:focus
      outline none

  &.fullscreen
    .fullscreen-toggle
      font-size 2rem
      right 2rem
      top 2rem
</style>
