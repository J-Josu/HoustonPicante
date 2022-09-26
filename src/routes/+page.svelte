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

  scene.add(sphere);

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

<main use:init />
