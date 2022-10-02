import { BackSide, FrontSide } from 'three';
import { UNIT_TO_KM } from './constants';
import { createBody, createBodyEdges } from './mainbody';
const Y_SECTORS = 2;
const X_SECTORS = 4;
// from: https://en.wikipedia.org/wiki/List_of_natural_satellites
const MOON_ARITHMETIC_MEAN_RADIUS = 1_738;
export const MOON_UNIT_RADIUS = MOON_ARITHMETIC_MEAN_RADIUS * UNIT_TO_KM;
let moon;
export function createMoon(renderer, scene, camera, onComplete) {
    moon = createBody(renderer, scene, camera, MOON_UNIT_RADIUS, Y_SECTORS, X_SECTORS, 'moon-tiles/tile_16k_{y}_{x}.jpg', onComplete);
    return moon;
}
const EDGES_VISIBLES = false;
let moonEdges;
export function createMoonEdges() {
    moonEdges = createBodyEdges(MOON_UNIT_RADIUS, 4, EDGES_VISIBLES);
    return moonEdges;
}
export function toggleMoonWireframe() {
    moonEdges.visible = !moonEdges.visible;
}
export function toggleMoonInterior() {
    moon.children.forEach(child => {
        // @ts-ignore
        const material = child.material;
        material.side = material.side === FrontSide ?
            BackSide :
            FrontSide;
    });
}
//# sourceMappingURL=moon.js.map