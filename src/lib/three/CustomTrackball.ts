import { controlsParameters } from '$lib/stores/controlsStore';
import { MathUtils, Quaternion, Vector3, type Camera } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';


interface RotationKeys {
  rUP: string;
  rDOWN: string;
  rRIGHT: string;
  rLEFT: string;
}
interface ZoomKeys {
  zIN: string;
  zOUT: string;
}


class EnhancedTrackball extends TrackballControls {
  readonly eKeys: RotationKeys & ZoomKeys;
  // _domElementKeyEvents: HTMLCanvasElement | null;
  // listenToKeyEvents: (domElement: HTMLCanvasElement) => void;
  enableRotation: boolean;
  camera: Camera;

  constructor(camera: Camera, domElement: HTMLCanvasElement) {
    super(camera, domElement);

    // override default behaviors
    this.keys = [];
    this.noPan = true;

    this.eKeys = {
      rUP: 'KeyW',
      rDOWN: 'KeyS',
      rRIGHT: 'KeyD',
      rLEFT: 'KeyA',
      zIN: 'KeyQ',
      zOUT: 'KeyE'
    }

    this.camera = camera;

    this.enableRotation = true;
    const scope = this;

    function handleKeyDown(event: KeyboardEvent) {

      let needsUpdate = false;

      switch (event.code) {

        case scope.eKeys.rUP:
          // pan(0, scope.keyPanSpeed);
          // console.log(scope.camera.rotation)
          // const rot = scope.camera.rotation;
          // const pos = scope.camera.position.angleTo(new Vector3(rot.x, rot.y, rot.z))
          // console.log(pos)
          // scope.camera.position.applyAxisAngle(new Vector3(1, 0, 0), 30)
          // scope.camera.position.applyAxisAngle(
          //   new Vector3(rot.x, rot.y, rot.z),
          //   pos * .1
          // )
          // scope.camera.rotateOnWorldAxis(
          //   new Vector3(1,0,0), 1
          // )
          const xDir = new Vector3(1, 0, 0)
          let xVec = new Vector3(1, 0, 0)
          const position = new Vector3();
          scope.camera.getWorldPosition(position)
          console.log(xVec.x, xVec.y, xVec.z)
          const dir = new Vector3();
          xVec = scope.camera.localToWorld(xVec)
          // console.log(xVec.x, xVec.y, xVec.z)
          dir.subVectors(xVec, position).normalize();
          // xVec = xVec.normalize()
          scope.camera.rotateOnWorldAxis(
            xDir, MathUtils.degToRad(10)
          )
          scope.camera.updateMatrixWorld()
          // scope.camera.position.applyEuler()
          // scope.camera.position.setLength(10)
          console.log(dir.x, dir.y, dir.z)
          // scope.camera.updateMatrix()
          console.log('up')
          // needsUpdate = true;
          break;

        case scope.eKeys.rDOWN:
          // pan(0, - scope.keyPanSpeed);
          console.log('down')
          needsUpdate = true;
          break;

        case scope.eKeys.rLEFT:
          // pan(scope.keyPanSpeed, 0);
          console.log('left')
          needsUpdate = true;
          break;

        case scope.eKeys.rRIGHT:
          // pan(- scope.keyPanSpeed, 0);
          console.log('right')
          needsUpdate = true;
          break;
      }

      if (needsUpdate) {
        // prevent the browser from scrolling on cursor keys
        event.preventDefault();
        scope.update();

      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!scope.enableRotation) return;

      handleKeyDown(event);
    }

    function initilizeKeysListening() {
      window.addEventListener('keydown', onKeyDown)
    }

    initilizeKeysListening();
  }
}

export { EnhancedTrackball };
