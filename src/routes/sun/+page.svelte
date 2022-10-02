<script lang="ts">
  import { animate, init, onWindowResize } from './setup';

  let initilized = false;

  $: if (initilized) animate()
  
  function initilize(node: HTMLElement) {
    init(node, () => {
      console.log('inited');
      initilized = true;
    });
  }
</script>

<svelte:window on:resize={onWindowResize} />

<main use:initilize />

<style>
</style>
