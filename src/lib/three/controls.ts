import * as THREE from 'three';
import type { PerspectiveCamera } from 'three';
import CameraControls from 'camera-controls';
import { MOON_UNIT_RADIUS } from './moon';

CameraControls.install({ THREE: THREE });

export let cameraControls: CameraControls;

export function initControls(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
  cameraControls = new CameraControls(camera, domElement);
  cameraControls.minDistance = MOON_UNIT_RADIUS + 0.1;
  cameraControls.minZoom = 1;
  cameraControls.dollySpeed = 0.25
  cameraControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY
  cameraControls.polarRotateSpeed = 0.1;
  cameraControls.azimuthRotateSpeed = 0.1;

  cameraControls.addEventListener('update', () => {
    // const speedFactor = cameraControls.distance / (MOON_UNIT_RADIUS * 8)
    // cameraControls.polarRotateSpeed = speedFactor;
    // cameraControls.azimuthRotateSpeed = speedFactor;
    if (cameraControls.distance < MOON_UNIT_RADIUS * 1.1) {
      cameraControls.polarRotateSpeed = 0.01;
      cameraControls.azimuthRotateSpeed = 0.01;
    }
    else if (cameraControls.distance < MOON_UNIT_RADIUS * 1.5) {
      cameraControls.polarRotateSpeed = 0.1;
      cameraControls.azimuthRotateSpeed = 0.1;
    }
    else {
      cameraControls.polarRotateSpeed = 0.5;
      cameraControls.azimuthRotateSpeed = 0.5;
    }
  })
}
