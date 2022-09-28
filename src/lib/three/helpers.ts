import { AxesHelper, CameraHelper, GridHelper, type Scene } from 'three';
import { camera } from './camera';

const axesHelper = new AxesHelper(10);

const GRID_SIZE = 25;
const GRID_DIVISIONS_FACTOR = 1;

const gridHelper = new GridHelper(
  GRID_SIZE,
  GRID_SIZE * GRID_DIVISIONS_FACTOR,
  'hsl(0, 0%, 50%)',
  'hsl(0, 0%, 25%)'
);

const cameraHelper = new CameraHelper(camera);

export function setupHelpers(scene: Scene) {
  // scene.add(gridHelper);
  scene.add(axesHelper);
  // scene.add(cameraHelper);
}
