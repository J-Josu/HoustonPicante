<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { camera, resizeCamera } from '$lib/three/camera';
  import { renderer, resizeRenderer } from '$lib/three/renderer';
  import { scene } from '$lib/three/scene';
  import { sphere } from '$lib/three/sphere';
  import {
    setupControls,
    resizeControls,
    updateControls,
  } from '$lib/three/controls';
    import { createPoint } from '$three/point';
    import { Vector3 } from 'three';
    import { earth } from '$three/celestialbodys/earth';
    import { sun } from '$three/celestialbodys/sun';

  scene.add(sphere);
  scene.add(earth);
  scene.add(sun);
  const newCube = createPoint(5,new Vector3());
  scene.add(newCube)

  function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
  }

  function init(element: HTMLElement) {
    element.appendChild(renderer.domElement);
    setupControls(camera, renderer.domElement);
  }

  function onWindowResize() {
    resizeCamera();
    resizeRenderer();
    resizeControls();
  }

  onMount(animate);
</script>

<svelte:window on:resize={onWindowResize} />

<main use:init>
  <p>hola</p>
</main>
