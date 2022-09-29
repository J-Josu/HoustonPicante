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
    map: textureLoader.load(`moon-tiles/tile_16k_${vIndex}_${hIndex}.jpg`),
  });

  return new THREE.Mesh(geometry, material);
}

const moon = new THREE.Group();

const moonEdges = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.SphereGeometry(
    MOON_UNIT_RADIUS,
    16,
    16
  )),
  new THREE.LineBasicMaterial({ color: 'hsl(0, 0%, 75%)' })
)
moonEdges.visible = false;

for (let i = 0; i < N_FACES; i++) {
  const face = buildSphereFace(i, 0);
  moon.add(face);
}
for (let i = 0; i < N_FACES; i++) {
  const face = buildSphereFace(i, 1);
  moon.add(face);

}

export { moon, moonEdges }

export function toggleMoonWireframe() {
  // moon.children.forEach(child => child.material.wireframe = !child.material.wireframe)
  moon.children.forEach(child => child.visible = !child.visible)
}
export function toggleMoonInterior() {
  moon.children.forEach(child => {
    const material = child.material as Material;
    if (material.transparent) {
      material.transparent = false;
      material.side = THREE.FrontSide
      moonEdges.visible = false
    }
    else {
      material.transparent = true;
      material.side = THREE.BackSide;
      moonEdges.visible = true
    }
  })
}
