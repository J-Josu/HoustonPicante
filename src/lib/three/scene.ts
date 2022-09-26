import { Color, Scene } from 'three';
import { setupHelpers as addHelpers } from './helpers';

function createScene() {
  const scene = new Scene();

  scene.background = new Color('hsl(0, 0%, 8%)');
  
  return scene;
}

export const scene = createScene();

addHelpers(scene);
