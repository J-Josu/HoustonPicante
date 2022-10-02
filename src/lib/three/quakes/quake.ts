import { RAYCASTER_CHANNEL, UNIT_TO_KM } from '$three/constants';
import { MOON_UNIT_RADIUS } from '$three/moon';
import { BoxGeometry, Color, MathUtils, Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from 'three';
import type { QuakeData, MagnitudGrade } from './types';

const SIZE = 1000 * UNIT_TO_KM;
const DISTANCE_TO_WORLD_ORIGIN = MOON_UNIT_RADIUS;

const geometry = new PlaneGeometry(10, 10, 100, 100);

export const globalUniforms = {
  time: { value: 0 }
};

var vertexShader = `
    uniform float time;
    varying vec3 pos;
    void main()	{
      pos = position;
      vec3 p = position;
      //p.y = sin(p.x * .1 - time) * cos(p.z * .1 - time) * 5.;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    }
  `;
var fragmentShader = `
    /* based on http://madebyevan.com/shaders/grid/ */
  
    varying vec3 pos;
    uniform float time;
    
    float line(float width, vec3 step){
      vec3 tempCoord = pos / step;
      
      vec2 coord = tempCoord.xz;

      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * width);
      float line = min(grid.x, grid.y);
      
      return 1. - min(line, 1.0);
    }
    
    void main() {
      float v = line(1., vec3(1.)) + line(1.5, vec3(10.));      
      vec3 c = v * vec3(0., 1., 1.) * (sin(time * 5. - length(pos.xz) * .5) * .5 + .5);
      c = mix(vec3(0.5), c, v);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;
export const uniforms = {
  time: {
    value: 0
  }
};
const MESH_TABLE_BY_COLOR: { [magnitud in MagnitudGrade]: ShaderMaterial } = {
  H: new ShaderMaterial({
    // color: `hsl(${0}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
  M: new ShaderMaterial({
    // color: `hsl(${64}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
  L: new ShaderMaterial({
    // color: `hsl(${128}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
};

// const geometry = new BoxGeometry(SIZE, SIZE, SIZE);
// const MESH_TABLE_BY_COLOR: { [magnitud in MagnitudGrade]: MeshBasicMaterial } = {
//   H: new MeshBasicMaterial({
//     color: `hsl(${0}, 100%, 50%)`,
//     wireframe: false
//   }),
//   M: new MeshBasicMaterial({
//     color: `hsl(${64}, 100%, 50%)`,
//     wireframe: false
//   }),
//   L: new MeshBasicMaterial({
//     color: `hsl(${128}, 100%, 50%)`,
//     wireframe: false
//   })
// };

function createLabel(text: string) {
  const elem = document.createElement('div');
  elem.textContent = text;
  elem.style.display = 'none';
  return elem;
}

export function createMesh(radiusToOrigin: number, lat: number, long: number, grade: MagnitudGrade) {
  const newQuake = new Mesh(geometry, MESH_TABLE_BY_COLOR[grade]);
  newQuake.position.setFromSphericalCoords(
    radiusToOrigin,
    MathUtils.degToRad(long),
    MathUtils.degToRad(lat)
  );
  newQuake.visible = false;
  newQuake.name = 'quake';
  newQuake.layers.enable(RAYCASTER_CHANNEL);
  return newQuake;
}

export class Quake {
  mesh: Mesh;
  label: HTMLDivElement;
  labelContainer: HTMLDivElement | undefined;
  time: string;
  grade: string;
  alt: number;

  constructor(data: QuakeData) {
    this.mesh = createMesh(DISTANCE_TO_WORLD_ORIGIN, data.lat, data.long, data.grade);
    this.mesh.userData.quake = this;
    this.label = createLabel(data.time);
    this.alt = data.alt;
    this.time = data.time;
    this.grade = data.grade;
  }

  showLabel() {
    this.label.style.display = 'block';
  }

  hideLabel() {
    this.label.style.display = 'none';
  }
}
