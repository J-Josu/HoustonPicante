import * as CONST from '$three/constants';
import { Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader } from 'three'

// from: https://en.wikipedia.org/wiki/Earth_radius
const EARTH_ARITHMETIC_MEAN_RADIUS = 6_371

// Quality 1-8
const QUALITY = 4;

const radius = EARTH_ARITHMETIC_MEAN_RADIUS * CONST.UNIT_TO_KM;
const earhtMoonDistance = - CONST.EARTH_MOON_UNITS;

const geometry = new SphereGeometry(
  radius,
  QUALITY * 8,
  QUALITY * 4
);

// from: https://www.solarsystemscope.com/textures/
const textureLoader = new TextureLoader();

const material = new MeshBasicMaterial({
  // color: `hsl(200, 100%, 50%)`,
  // wireframe: true,
  map: textureLoader.load(`earth.jpg`)
});

const earth = new Mesh(geometry, material);

earth.position.set(
  earhtMoonDistance,
  0,
  0
);

export { earth }
