import { BoxGeometry, MathUtils, Mesh, MeshBasicMaterial, type Vector3 } from 'three';

const geometry = new BoxGeometry(1, 1);
const material = new MeshBasicMaterial({
  color: `hsl(${20}, 100%, 50%)`,
  wireframe: true
})

export function createPoint(radius:number, direction:Vector3) {
  const newCube = new Mesh(geometry, material); 
  newCube.position.x = 9;
  newCube.position.setFromSphericalCoords(radius, MathUtils.degToRad(135), MathUtils.degToRad(45));
  return newCube;
}
