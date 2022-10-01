import { Camera, Group, Texture, WebGLRenderer, type Mesh, type Scene } from 'three';
import * as THREE from 'three'
import { UNIT_TO_KM } from '../../lib/three/constants'

const N_FACES = 4;
const HALF_PI = Math.PI / 2;

// from: https://en.wikipedia.org/wiki/List_of_natural_satellites
const MOON_ARITHMETIC_MEAN_RADIUS = 1_738;

export const MOON_UNIT_RADIUS = MOON_ARITHMETIC_MEAN_RADIUS * UNIT_TO_KM;

const textureLoader = new THREE.TextureLoader();

// async function createFace(group: Group, y: number, x: number) {
//   return textureLoader
//     .loadAsync(`moon-tiles/tile_16k_${y}_${x}.jpg`,
//     (texture) => {
//       const geometry = new THREE.SphereGeometry(
//         MOON_UNIT_RADIUS,
//         32,
//         16,
//         x * HALF_PI,
//         HALF_PI,
//         y * HALF_PI,
//         HALF_PI
//       );
//       const material = new THREE.MeshStandardMaterial({
//         // color: `hsl(${(hIndex + 1) * 30 * (vIndex * 2 + 1)}, 100%, 50%)`,
//         map: texture,
//       });
//       group.add(new THREE.Mesh(geometry, material))
//     })
// }
function createFace(texture: Texture, y: number, x: number) {
  const geometry = new THREE.SphereGeometry(
    MOON_UNIT_RADIUS,
    32,
    16,
    x * HALF_PI,
    HALF_PI,
    y * HALF_PI,
    HALF_PI
  );
  const material = new THREE.MeshStandardMaterial({
    // color: `hsl(${(hIndex + 1) * 30 * (vIndex * 2 + 1)}, 100%, 50%)`,
    map: texture,
  });
  return new THREE.Mesh(geometry, material)
}

export async function createMoon(renderer: WebGLRenderer, camera: Camera, scene: Scene, onComplete: () => void) {


  const moon = new Group();
  scene.add(moon);
  // (async function myLoop(i: number) {
  //   setTimeout(async function () {
  //     const texture = await textureLoader.loadAsync(`moon-tiles/tile_16k_${Math.floor(i / N_FACES)}_${i % N_FACES}.jpg`)

  //     renderer.initTexture(texture)
  //     moon.add(createFace(texture, Math.floor(i / N_FACES), i % N_FACES));
  //     renderer.render(scene, camera)

  //     if (i < N_FACES * 2) myLoop(i++);
  //     else
  //       onComplete();  //  decrement i and call myLoop again if i > 0
  //   }, 100)
  // })(0);
  // let j=0;
  // function myLoop() {         //  create a loop function
  //   setTimeout(async function() {   //  call a 3s setTimeout when the loop is called
  //     if (j %2 === 1) {
  //       renderer.render(scene, camera)  ;
  //       j++;    
  //       console.log(j)
  //       if (j < N_FACES * 2 * 2) {           //  if the counter < 10, call the loop function
  //         myLoop();             //  ..  again which will trigger another 
  //       }    else {
  //         renderer.compile(scene, camera)
  //         onComplete()
  //       } // 
  //     }
  //     else {
  //       const i = j / 2;
  //       const texture = await textureLoader.loadAsync(`moon-tiles/tile_16k_${Math.floor(i / N_FACES)}_${i % N_FACES}.jpg`)
  //       console.log(j)
  //       renderer.initTexture(texture)
  //       moon.add(createFace(texture, Math.floor(i / N_FACES), i % N_FACES));  //  your code here
  //       j++;                    //  increment the counter
  //       if (j < N_FACES * 2 * 2) {           //  if the counter < 10, call the loop function
  //         myLoop();             //  ..  again which will trigger another 
  //       }
  //       else {
  //               renderer.render(scene,camera)
  //               setTimeout(onComplete, 100)
  //       }     
  //     }            //  ..  setTimeout()
  //   }, 50)
  // }

  let i = 0;
  function myLoop() {         //  create a loop function
    setTimeout(async function () {   //  call a 3s setTimeout when the loop is called
      const texture = await textureLoader.loadAsync(`moon-tiles/tile_16k_${Math.floor(i / N_FACES)}_${i % N_FACES}.jpg`)
      renderer.initTexture(texture)
      console.log(i)
      // renderer.render(scene,camera)
      moon.add(createFace(texture, Math.floor(i / N_FACES), i % N_FACES));  //  your code here
      i++;                    //  increment the counter
      if (i < N_FACES * 2) {           //  if the counter < 10, call the loop function
        myLoop();           //  ..  again which will trigger another 
      }
      else {
        renderer.render(scene,camera)
        setTimeout(onComplete,0)
      }
      //  ..  setTimeout()
    }, 0)
  }
  setTimeout(myLoop, 0)
  // myLoop();

  // for (let i = 0; i < N_FACES * 2; i++) {
  //   const texture = await textureLoader.loadAsync(`moon-tiles/tile_16k_${Math.floor(i / N_FACES)}_${i % N_FACES}.jpg`)
  //   console.log(i)
  //   renderer.initTexture(texture)
  //   moon.add(createFace(texture, Math.floor(i / N_FACES), i%N_FACES));
  //   // renderer.render(scene,camera)
  // }
  // onComplete();
}

// async function buildAsync(iV: number) {
//   const textures = await Promise.all(
//     Array(4).fill(null).map((_, i) => textureLoader.loadAsync(`moon-tiles/tile_16k_${iV}_${i}.jpg`))
//   )

//   const meshes: Mesh[] = []
//   for (let i = 0; i < N_FACES; i++) {
//     const geometry = new THREE.SphereGeometry(
//       MOON_UNIT_RADIUS,
//       32,
//       16,
//       i * HALF_PI,
//       HALF_PI,
//       iV * HALF_PI,
//       HALF_PI
//     );
//     const material = new THREE.MeshStandardMaterial({
//       // color: `hsl(${(hIndex + 1) * 30 * (vIndex * 2 + 1)}, 100%, 50%)`,
//       map: textures[i],
//     });
//     meshes.push(new THREE.Mesh(geometry, material))
//   }
//   return meshes
// }

// export async function createMoon(scene: Scene) {
//   const moon = new Group();
//   await Promise.all([
//     buildAsync(0),
//     buildAsync(1)
//   ]).then(result => {
//     result.forEach(face => {
//       face.forEach(f => moon.add(f))
//     });
//     scene.add(moon)
//   })
// }

