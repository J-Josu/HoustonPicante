import * as THREE from 'three';
import { camera } from '$three/camera';
import { renderer } from '$three/renderer';
import { scene } from '$three/scene';
import { moon, moonEdges } from '$three/moon';
import { earth } from '$three/celestialbodys/earth';
import { sun } from '$three/celestialbodys/sun';
import { cameraControls, ControlManager, initControls } from '$three/controls';
import { addLights, toNormalMode, toSimulationMode } from '$three/light';
import { QuakesManager } from '$three/quakes/quakesManager';
import quakesSample from '$lib/sample.json'
import { TimeLine } from '$three/timeline';
import type { QuakeData } from '$three/quakes/types';

scene.add(moon);
scene.add(moonEdges)
scene.add(earth);
scene.add(sun);


export let quakesManager: QuakesManager;
export let clock: THREE.Clock;
export let timeline: TimeLine;
export let controlManager: ControlManager;

export function animate() {
  requestAnimationFrame(animate);

  controlManager.update();
  const delta = clock.getDelta();
  cameraControls.update(delta);
  timeline.update(delta);

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
  quakesManager = new QuakesManager(scene, quakesSample as QuakeData[])
  timeline = new TimeLine(2, Infinity)
  timeline.subscribe(quakesManager.showNextQuake.bind(quakesManager))
  controlManager = new ControlManager(cameraControls)
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

export function toggleAllQuakes() {
  quakesManager.toggleQuakesVisualization()
}
