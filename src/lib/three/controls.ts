import { get } from 'svelte/store';
import type { Camera } from 'three';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { controlsParameters } from '$lib/stores/controlsStore';

// NOTE: remember to update controls in manual camera adjustements

let controls: TrackballControls;

export function setupControls(camera: Camera, domElement: HTMLElement) {
  controls = new TrackballControls(camera, domElement);

  const settings = get(controlsParameters);
  controls.noPan = !settings.enablePan;
  // controls.addEventListener('change', () => console.log("Controls Change"))
  // controls.addEventListener('start', () => console.log("Controls Start Event"))
  // controls.addEventListener('end', () => console.log("Controls End Event"))
  // controls.enabled = false
  // controls.rotateSpeed = 1.0
  // controls.zoomSpeed = 1.2
  // controls.panSpeed = 0.8
  // controls.keys = ['KeyA', 'KeyS', 'KeyD']
  // controls.noPan = true //default false
  // controls.noRotate = true //default false
  // controls.noZoom = true //default false
  // controls.staticMoving = true //default false
  // controls.dynamicDampingFactor = 0.1
  controls.maxDistance = 20
  // controls.minDistance = 2
}

export function updateControls() {
  controls.update();
}
export function resizeControls() {
  controls.handleResize();
}
