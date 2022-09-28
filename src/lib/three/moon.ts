import * as THREE from 'three'
import { UNIT_TO_KM } from './constants';

const N_FACES = 4;
const HALF_PI = Math.PI / 2;

// from: https://en.wikipedia.org/wiki/List_of_natural_satellites
const MOON_ARITHMETIC_MEAN_RADIUS = 1_738;

export const MOON_UNIT_RADIUS = MOON_ARITHMETIC_MEAN_RADIUS * UNIT_TO_KM;

const textureLoader = new THREE.TextureLoader();

function buildSphereFace(hIndex: number, vIndex: number) {
  const geometry = new THREE.SphereGeometry(
    MOON_UNIT_RADIUS,
    32,
    16,
    hIndex * HALF_PI,
    HALF_PI,
    vIndex * HALF_PI,
    HALF_PI
  );
  const material = new THREE.MeshStandardMaterial({
    // color: `hsl(${(hIndex + 1) * 30 * (vIndex * 2 + 1)}, 100%, 50%)`,
    map: textureLoader.load(`moon-tiles/tile_16k_${vIndex}_${hIndex}.jpg`)
  });

  return new THREE.Mesh(geometry, material);
}

const moon = new THREE.Object3D();

for (let i = 0; i < N_FACES; i++) {
  moon.add(buildSphereFace(i, 0));
}
for (let i = 0; i < N_FACES; i++) {
  moon.add(buildSphereFace(i, 1));
}

export { moon }
