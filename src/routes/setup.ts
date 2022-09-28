import * as THREE from 'three';
import { camera } from '$three/camera';
import { renderer } from '$three/renderer';
import { scene } from '$three/scene';
import { moon } from '$three/moon';
import { earth } from '$three/celestialbodys/earth';
import { sun } from '$three/celestialbodys/sun';
import { cameraControls, initControls } from '$three/controls';
import { addLights, toNormalMode, toSimulationMode } from '$three/light';

scene.add(moon);
scene.add(earth);
scene.add(sun);

// const newCube = createPoint(5,new Vector3());
// scene.add(newCube)


export let clock: THREE.Clock;

export function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
}

export function onWindowResize() {
  // camera adaptation
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // renderer adaptation
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function init(container: HTMLElement) {
  container.appendChild(renderer.domElement);
  initControls(camera, renderer.domElement)
  addLights(scene)
  clock = new THREE.Clock();
}

export function toggleExternalBodys(enable: boolean) {
  if (enable) {
    toSimulationMode()
    earth.visible = true;
    sun.visible = true;
  }
  else {
    toNormalMode()
    earth.visible = false;
    sun.visible = false;
  }
}
