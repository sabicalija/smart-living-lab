import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";

function setupEnvironment({ fov, near, far, width, height, pixelRatio }) {
  const ratio = width / height;
  const camera = new PerspectiveCamera(fov, ratio, near, far);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");

  const raycaster = new Raycaster();
  const mouse = new Vector2();

  return { camera, renderer, raycaster, mouse };
}

function generateScene({ name, texture, locations }, world) {
  const sceneTexture = new TextureLoader().load(texture);
  sceneTexture.mapping = EquirectangularReflectionMapping;
  const scene = new Scene();
  scene.background = sceneTexture;

  const targets = {
    locations: [],
    information: [],
  };

  for (let location of locations) {
    const elem = world.find(({ name }) => location.name === name);
    const geometry = new SphereGeometry(1, 60, 40);
    const locationTexture = new TextureLoader().load(elem.texture);
    const material = new MeshBasicMaterial({ map: locationTexture, transparent: true, opacity: 0.5 });
    const mesh = new Mesh(geometry, material);

    mesh.position.x = location.position.x;
    mesh.position.y = location.position.y;
    mesh.position.z = location.position.z;

    mesh.rotation.x = location.rotation.x;
    mesh.rotation.y = location.rotation.y;
    mesh.rotation.z = location.rotation.z;

    targets.locations.push({ name: location.name, uuid: mesh.uuid });
    scene.add(mesh);
  }

  return { name, scene, targets };
}

export { setupEnvironment, generateScene };
