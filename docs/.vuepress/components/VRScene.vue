<template>
  <div ref="root" class="vr container">
    <div ref="renderer" class="vr renderer"></div>
    <!-- <button>Fullscreen</button> -->
  </div>
</template>

<script>
import { setupEnvironment, generateScene } from "../utils/scene.js";

export default {
  name: "VRScene",
  props: {
    world: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      scenes: [],
      width: 0,
      height: 0,
      renderer: null,
      raycaster: null,
      mouse: null,
      camera: null,
      intersects: [],
      scene: null,
      sceneName: "",
    };
  },
  methods: {
    updateSize() {
      const { width } = this.$refs.root.getBoundingClientRect();
      this.width = width;
      this.height = (width * 9) / 16;
    },
    initScenes() {
      // Create three.js components
      const { camera, renderer, raycaster, mouse } = setupEnvironment({
        fov: 75,
        near: 1,
        far: 1100,
        width: this.width,
        height: this.height,
        pixelRatio: window.devicePixelRatio,
      });
      this.renderer = renderer;
      this.raycaster = raycaster;
      this.mouse = mouse;
      this.camera = camera;

      this.$refs.renderer.appendChild(this.renderer.domElement);
      this.renderer.setAnimationLoop(this.render);

      // Prepend base
      for (let elem of this.world) {
        if (elem.texture.startsWith("/") && !elem.texture.startsWith(this.$site.base))
          elem.texture = this.$site.base + elem.texture.substring(1);
      }

      // Create scenes
      for (let elem of this.world) {
        this.scenes.push(generateScene(elem, this.world));
      }

      // Load initial scene
      this.scene = this.scenes[0].scene;
      this.sceneName = this.scenes[0].name;
    },
    render() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.intersects = this.raycaster.intersectObjects(this.scene.children);

      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.updateSize();
    this.initScenes();
  },
};
</script>

<style lang="stylus" scoped></style>
