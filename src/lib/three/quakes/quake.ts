import { RAYCASTER_CHANNEL, UNIT_TO_KM } from '$three/constants';
import { MOON_UNIT_RADIUS } from '$three/moon';
import { BoxGeometry, Color, MathUtils, Mesh, MeshBasicMaterial } from 'three';
import type { QuakeData, MagnitudGrade } from './types';

const SIZE = 20 * UNIT_TO_KM;
const DISTANCE_TO_WORLD_ORIGIN = MOON_UNIT_RADIUS;

const geometry = new BoxGeometry(SIZE, SIZE, SIZE);

// const material = new MeshBasicMaterial({
//   wireframe: false
// })
// let counter = -1;
// // counter += 1;


const MESH_TABLE_BY_COLOR: { [magnitud in MagnitudGrade]: MeshBasicMaterial } = {
  H: new MeshBasicMaterial({
    color: `hsl(${0}, 100%, 50%)`,
    wireframe: false
  }),
  M: new MeshBasicMaterial({
    color: `hsl(${64}, 100%, 50%)`,
    wireframe: false
  }),
  L: new MeshBasicMaterial({
    color: `hsl(${128}, 100%, 50%)`,
    wireframe: false
  })
}

function createLabel(text: string) {
  const elem = document.createElement('div');
  elem.textContent = text;
  elem.style.display = 'none';
  return elem;
}

export function createQuake(radiusToOrigin: number, lat: number, long: number, grade: MagnitudGrade) {
  const newQuake = new Mesh(geometry, MESH_TABLE_BY_COLOR[grade]);
  newQuake.position.setFromSphericalCoords(
    radiusToOrigin,
    MathUtils.degToRad(long),
    MathUtils.degToRad(lat)
  )
  newQuake.visible = false;
  newQuake.name = 'quake'
  newQuake.layers.enable(RAYCASTER_CHANNEL)
  return newQuake;
}

export class Quake {
  mesh: Mesh;
  label: HTMLDivElement;
  labelContainer: HTMLDivElement | undefined;
  time: string;
  grade: string;
  alt: number;
  onShow = (quake: Quake) => { };
  onHide = (quake: Quake) => { };

  constructor(data: QuakeData) {
    this.mesh = createQuake(DISTANCE_TO_WORLD_ORIGIN, data.lat, data.long, data.grade)
    this.mesh.userData.Quake = this;
    this.label = createLabel(data.time)
    this.alt = data.alt
    this.time = data.time
    this.grade = data.grade
  }

  showLabel() {
    this.labelContainer?.appendChild(this.label);
    this.label.style.display = 'block';
    this.onShow(this);
  }
  hideLabel() {
    this.labelContainer?.removeChild(this.label);
    this.label.style.display = 'none';
    this.onHide(this);
  }
}
