<script lang="ts">
  import { onMount } from 'svelte';
  import { animate, init, onWindowResize, toggleExternalBodys } from './setup';

  let initilized = false;
  let enableContext = false;

  function toggleContext() {
    enableContext = !enableContext;
    toggleExternalBodys(enableContext);
  }

  onMount(() => {
    animate();
  });
</script>

<svelte:window on:resize={onWindowResize} />

<main use:init />

<div>
  <button on:click={toggleContext}>Enable context</button>
</div>

<style>
  div {
    display: flex;
    gap: 0.5rem;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.25rem;
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
