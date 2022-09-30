import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { MOON_UNIT_RADIUS } from './moon';
import { orientation, type DeviceOrientation } from '$lib/stores/orientationStore';
import type { PerspectiveCamera } from 'three';

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

interface RotationState {
  isRotating: boolean,
  up: boolean,
  right: boolean,
  down: boolean,
  left: boolean
}

class ControlManager {
  control: CameraControls;
  rotation: RotationState;
  rotationDeg: number;
  rotationState: DeviceOrientation;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  // handleMediaOrientation: (event: MediaQueryListEvent) => void
  handleDeviceOrientation: (event: DeviceOrientationEvent) => void;
  toggleGiroscopic: () => boolean;

  readonly ANGLE_DIFF = 10;
  constructor(cameraControls: CameraControls) {
    this.control = cameraControls;
    this.rotation = {
      isRotating: false,
      up: false,
      right: false,
      down: false,
      left: false
    }
    this.rotationDeg = 0.005;
    this.rotationState = {
      enabled: false,
      wasDisabled: false,
      base: {
        alpha: 0,
        beta: 0,
        gamma: 0
      },
      actual: {
        alpha: 0,
        beta: 0,
        gamma: 0
      }
    }

    const $ = this;


    this.handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          $.rotation.up = true
          $.rotation.down = false
          break;
        case 'KeyS':
          $.rotation.up = false
          $.rotation.down = true
          break;
        case 'KeyD':
          $.rotation.right = false
          $.rotation.left = true
          break;
        case 'KeyA':
          $.rotation.right = true
          $.rotation.left = false
          break;
        default:
          return;
      }
      $.rotation.isRotating = $.rotation.up || $.rotation.right || $.rotation.down || $.rotation.left;
    }
    this.handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          $.rotation.up = false
          break;
        case 'KeyS':
          $.rotation.down = false
          break;
        case 'KeyD':
          $.rotation.left = false
          break;
        case 'KeyA':
          $.rotation.right = false
          break;
        default:
          return;
      }
      $.rotation.isRotating = $.rotation.up || $.rotation.right || $.rotation.down || $.rotation.left;
    }

    // this.handleMediaOrientation = (event: MediaQueryListEvent) => {
    //   console.log(event.matches)
    // }
    this.handleDeviceOrientation = (event) => {

      const { alpha, beta, gamma } = event;

      const crrAlpha = alpha!, crrBeta = beta!, crrGamma = gamma!

      if ($.rotationState.wasDisabled) {
        $.rotationState.wasDisabled = false;
        $.rotationState.base = {
          alpha: alpha || 0,
          beta: beta || 0,
          gamma: gamma || 0
        }
        $.rotation.isRotating = false;
        $.rotation.up = false;
        $.rotation.right = false;
        $.rotation.down = false;
        $.rotation.left = false;
        orientation.set($.rotationState)
        return;
      }

      $.rotationState.actual.alpha = alpha || 0;
      $.rotationState.actual.beta = beta || 0;
      $.rotationState.actual.gamma = gamma || 0;

      let needsUpdate = false;
      // "landscape-primary" | "landscape-secondary" | "portrait-primary" | "portrait-secondary"

      if (($.rotationState.base.beta - crrBeta) > $.ANGLE_DIFF) {
        needsUpdate = true;
        $.rotation.up = true
        $.rotation.down = false
      }
      else if (($.rotationState.base.beta - crrBeta) < -$.ANGLE_DIFF) {
        needsUpdate = true;
        $.rotation.up = false
        $.rotation.down = true
      }
      if (($.rotationState.base.gamma - crrGamma) > $.ANGLE_DIFF) {
        needsUpdate = true;
        $.rotation.right = true
        $.rotation.left = false
      }
      else if (($.rotationState.base.gamma - crrGamma) < -$.ANGLE_DIFF) {
        needsUpdate = true;
        $.rotation.right = false
        $.rotation.left = true
      }


      if (!needsUpdate) {
        $.rotation.up = false;
        $.rotation.right = false;
        $.rotation.down = false;
        $.rotation.left = false;
      }
      $.rotation.isRotating = needsUpdate;
      orientation.set($.rotationState);
    }

    this.toggleGiroscopic = () => {
      $.rotationState.enabled = !$.rotationState.enabled;
      if ($.rotationState.enabled) {
        $.rotationState.wasDisabled = true;
        window.addEventListener('deviceorientation', $.handleDeviceOrientation)
      }
      else {
        $.rotation.isRotating = false;
        $.rotation.up = false;
        $.rotation.right = false;
        $.rotation.down = false;
        $.rotation.left = false;
        window.removeEventListener('deviceorientation', $.handleDeviceOrientation)
      }
      return $.rotationState.enabled;
    }

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)

    // const mql = window.matchMedia("(orientation:landscape)");
    // mql.addEventListener("change", (event) => {
    //   if (event.matches) {
    //     alert("Now in landscape orientation");
    //   } else {
    //     alert("Now in portrait orientation");
    //   }
    // });
  }

  update() {
    // const deg = cameraControls.distance / (MOON_UNIT_RADIUS * 2) * 0.01
    if (!this.rotation.isRotating) return;

    let azimuthAngle = 0, polarAngle = 0;
    if (this.rotation.up)
      polarAngle = -this.rotationDeg
    else if (this.rotation.down)
      polarAngle = this.rotationDeg

    if (this.rotation.right)
      azimuthAngle = -this.rotationDeg
    else if (this.rotation.left)
      azimuthAngle = this.rotationDeg

    this.control.rotate(azimuthAngle, polarAngle)
  }
}

export { ControlManager }
