import * as THREE from 'three';
import { camera } from '$three/camera';
import { renderer } from '$three/renderer';
import { scene } from '$three/scene';
import { earth } from '$three/celestialbodys/earth';
import { sun } from '$three/celestialbodys/sun';
import { cameraControls, ControlManager, initControls } from '$three/controls';
import { addLights, toNormalMode, toSimulationMode } from '$three/light';
import { QuakesManager } from '$three/quakes/quakesManager';
import quakesSample from '$lib/sample.json';
import { TimeLine } from '$three/timeline';
import { RaycasterManager } from '$three/labels/raycaster';
scene.add(earth);
scene.add(sun);
export let quakesManager;
export let clock;
export let timeline;
export let controlManager;
export let raycasterManager;
export function animate() {
    requestAnimationFrame(animate);
    controlManager.update();
    const delta = clock.getDelta();
    cameraControls.update(delta);
    timeline.update(delta);
    raycasterManager.update(camera);
    renderer.render(scene, camera);
}
export function onWindowResize() {
    // camera adaptation
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // renderer adaptation
    renderer.setSize(window.innerWidth, window.innerHeight);
}
export function init(container) {
    container.appendChild(renderer.domElement);
    initControls(camera, renderer.domElement);
    addLights(scene);
    clock = new THREE.Clock();
    quakesManager = new QuakesManager(scene, quakesSample);
    timeline = new TimeLine(2, Infinity);
    timeline.subscribe(quakesManager.showNextQuake.bind(quakesManager));
    controlManager = new ControlManager(cameraControls);
    raycasterManager = new RaycasterManager(scene, renderer.domElement);
}
export function toggleExternalBodys(enable) {
    if (enable) {
        toSimulationMode();
        earth.visible = true;
        sun.visible = true;
    }
    else {
        toNormalMode();
        earth.visible = false;
        sun.visible = false;
    }
}
export function toggleAllQuakes() {
    quakesManager.toggleQuakesVisualization();
}
//# sourceMappingURL=setup.js.map