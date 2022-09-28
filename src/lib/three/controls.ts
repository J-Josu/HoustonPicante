import { get } from 'svelte/store';
import type { Camera } from 'three';
// import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { controlsParameters } from '$lib/stores/controlsStore';
import { EnhancedTrackball } from './CustomTrackball';

// NOTE: remember to update controls in manual camera adjustements

enum KeyState {
  down = 'KeyDown',
  up = 'KeyUp'
}

type onKeyAction = (key: string, e: KeyboardEvent) => void;

class KeyLogger {
  states = KeyState;
  keyDownSubscribers: onKeyAction[];
  keyUpSubscribers: onKeyAction[];
  constructor() {
    this.keyDownSubscribers = []
    this.keyUpSubscribers = []
    this.startListening();

    const scope = this;

    function keydown(event: KeyboardEvent) {
      const keyCode = event.code;
      scope.keyDownSubscribers.forEach(callback => callback(keyCode, event))
    }
    function keyup(event: KeyboardEvent) {
      const keyCode = event.code;
      scope.keyDownSubscribers.forEach(callback => callback(keyCode, event))
    }
  }
  subscribe(state: KeyState, callback: onKeyAction) {
    if (state = KeyState.down)
      this.keyDownSubscribers.push(callback)
    else
      this.keyUpSubscribers.push(callback)
  }

  onKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;
    this.keyDownSubscribers.forEach(callback => callback(keyCode, event))
  }
  onKeyUp(event: KeyboardEvent) {
    const keyCode = event.code;
    this.keyDownSubscribers.forEach(callback => callback(keyCode, event))
  }
  startListening() {
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
  }
  stopListening() {
    window.removeEventListener('keydown', (e) => this.onKeyDown(e));
    window.removeEventListener('keyup', (e) => this.onKeyUp(e));
  }
}


// let controls: TrackballControls;
let controls: EnhancedTrackball;

let kL: KeyLogger;
export function setupControls(camera: Camera, domElement: HTMLCanvasElement) {
  // controls = new TrackballControls(camera, domElement);
  controls = new EnhancedTrackball(camera, domElement);
  // kL = new KeyLogger();
  // kL.subscribe(kL.states.down, (k, _) => { console.log(k) })
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
