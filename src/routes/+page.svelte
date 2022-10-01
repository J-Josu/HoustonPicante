<script lang="ts">
  import Orientation from '$lib/components/Orientation.svelte';
  import { toggleMoonInterior, toggleMoonWireframe } from '$three/moon';
  import { onMount } from 'svelte';
  import {
    animate,
    init,
    onWindowResize,
    toggleExternalBodys,
    toggleAllQuakes,
    quakesManager,
  } from './setup';

  let initilized = false;
  let enableContext = false;
  let viewQuakes = false;
  let labels : HTMLDivElement;

  function toggleContext() {
    enableContext = !enableContext;
    toggleExternalBodys(enableContext);
  }
  function toggleQuakes() {
    viewQuakes = !viewQuakes;
    toggleAllQuakes();
  }
  let test: string;
  onMount(() => {
    animate();
    quakesManager.addEventListener(
      'appear',
      (quake) => (test = quake.mesh.position.x.toString())
    );
    quakesManager.labelsContainer = labels
  });
</script>

<svelte:window on:resize={onWindowResize} />

<main use:init>
</main>
<div id="labels" bind:this={labels} />

<ul>
  <li>
    <button on:click={toggleMoonWireframe}>Toggle wireframe</button>
    <button on:click={toggleMoonInterior}>Toggle interior</button>
    <button on:click={toggleContext}>Enable context</button>
    <button on:click={toggleQuakes}>Show quakes</button>
  </li>
  <li>
    <Orientation />
  </li>
</ul>

<style>
  #labels {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    color:hsl(0, 0%, 70%)
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.25rem;
  }
  li {
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.5ch;
    background: none;
    font-weight: 500;
    color: hsl(0, 0%, 70%);
    border: 1px solid hsl(0, 0%, 70%);
    border-radius: 2px;
    cursor: pointer;
  }
</style>
