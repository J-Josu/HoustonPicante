import { Color, Scene } from 'three';
import { setupHelpers as addHelpers } from './helpers';

const BACKGROUND_COLOR = 'hsl(255, 25%, 1%)'

function createScene() {
  const scene = new Scene();

  scene.background = new Color(BACKGROUND_COLOR);
  
  return scene;
}

export const scene = createScene();

addHelpers(scene);
