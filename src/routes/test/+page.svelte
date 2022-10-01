<script lang="ts">
    import { camera } from '$three/camera';
    import { renderer } from '$three/renderer';
  import { scene } from '$three/scene';
  import { onMount } from 'svelte';
  import { createMoon } from './moon';
  let initialized = false;
  import {
    animate,
    init,
    quakesManager,
  } from './setup';

  let initilized = false;
  let enableContext = false;
  let hola =0;
  let labels: HTMLDivElement;

  let test: string;
  onMount(async () => {
    quakesManager.addEventListener(
      'appear',
      (quake) => (test = quake.mesh.position.x.toString())
    );
    quakesManager.labelsContainer = labels;
    createMoon(renderer ,camera,scene, () => initialized = true);
    loop()
  });
  $: if (initialized) animate()
  function loop() {
  requestAnimationFrame(loop)
  hola += 1;
  }
</script>


{#if initialized}
  {'cargue'}
{:else}
  <div style="display:grid;place-items:center">
    <h1>Cargando {hola}</h1>
  </div>
{/if}
<main use:init />
<style>
  div {
    color: blueviolet;

  }
</style>
