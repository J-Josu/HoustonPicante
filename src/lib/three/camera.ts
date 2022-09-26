import { PerspectiveCamera } from 'three';

const DISTANCE = 7.5;

function createCamera() {
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  // default initialization
  camera.position.x = DISTANCE;
  camera.position.y = DISTANCE;
  camera.position.z = DISTANCE;
  camera.lookAt(0, 0, 0)

  return camera
}

export const camera = createCamera()

export function resizeCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
