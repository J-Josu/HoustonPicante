<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { camera, resizeCamera } from '$lib/three/camera';
  import { renderer, resizeRenderer } from '$lib/three/renderer';
  import { scene } from '$lib/three/scene';
  import { moon } from '$lib/three/moon';
  import {
    setupControls,
    resizeControls,
    updateControls,
  } from 'unused/controls';
  import { MathUtils, Vector3 } from 'three';
  import { earth } from '$three/celestialbodys/earth';
  import { sun } from '$three/celestialbodys/sun';
  import { EARTH_MOON_UNITS } from '$three/constants';
  import CameraControls from 'camera-controls';
  CameraControls.install({ THREE: THREE });

  scene.add(moon);
  scene.add(earth);
  scene.add(sun);

  // setup directional light + helper
  const al = new THREE.AmbientLight('hsl(0, 0%, 100%)', 0.1);
  scene.add(al);
  const dl = new THREE.DirectionalLight(0xffffff, 0.75);
  // use this for YouTube thumbnail
  dl.position.set(-EARTH_MOON_UNITS / 2, 0, 0);
  dl.lookAt(0, 0, 0);
  dl.castShadow = true;
  const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
  scene.add(dl);
  // dl.visible = false;

  const clock = new THREE.Clock();
  let cameraControls: CameraControls;
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    // updateControls();
    cameraControls.update(delta);
    renderer.render(scene, camera);
  }

  function init(element: HTMLElement) {
    element.appendChild(renderer.domElement);
    // setupControls(camera, renderer.domElement);
    cameraControls = new CameraControls(camera, renderer.domElement);
    // cameraControls.maxPolarAngle = Infinity;
    // cameraControls.minPolarAngle = Infinity;wwwwwwwwwwwww
    window.addEventListener('keydown', (e) => {
      if (e.code != 'KeyW') return;
      cameraControls.rotatePolarTo(cameraControls.polarAngle - 0.1);
      console.log('up');
    });
  }

  function onWindowResize() {
    resizeCamera();
    resizeRenderer();
    // resizeControls();
  }

  onMount(animate);
</script>

<svelte:window on:resize={onWindowResize} />

<main use:init />
