import * as THREE from 'three'

const N_FACES = 4;
const RADIUS = 5;
const HALF_PI = Math.PI / 2;

const textureLoader = new THREE.TextureLoader();

function buildSphereFace(hIndex: number, vIndex: number) {
  const geometry = new THREE.SphereGeometry(
    RADIUS,
    32,
    16,
    hIndex * HALF_PI,
    HALF_PI,
    vIndex * HALF_PI,
    HALF_PI
  );
  const material = new THREE.MeshBasicMaterial({
    // color: `hsl(${(hIndex + 1) * 30 * (vIndex * 2 + 1)}, 100%, 50%)`,
    map: textureLoader.load(`moon-tiles/tile_16k_${vIndex}_${hIndex}.jpg`)
  });

  return new THREE.Mesh(geometry, material);
}

export const sphere = new THREE.Object3D();

for (let i = 0; i < N_FACES; i++) {
  sphere.add(buildSphereFace(i, 0));
}
for (let i = 0; i < N_FACES; i++) {
  sphere.add(buildSphereFace(i, 1));
}
