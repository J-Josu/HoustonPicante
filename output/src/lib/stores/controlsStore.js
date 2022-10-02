import { writable } from 'svelte/store';
import cfgDefault from '$default/controlsConfig.json';
export const controlsParameters = writable({
    rotateSpeed: cfgDefault.rotateSpeed,
    zoomSpeed: 1,
    keys: [],
    maxDistance: 50,
    minDistance: 5,
    enablePan: cfgDefault.enablePan
});
//# sourceMappingURL=controlsStore.js.map