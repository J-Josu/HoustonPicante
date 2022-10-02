import { RAYCASTER_CHANNEL, UNIT_TO_KM } from '$three/constants';
import { MOON_UNIT_RADIUS } from '$three/moon';
import { BoxGeometry, Color, MathUtils, Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from 'three';
import { Pulse } from './wave/Pulse';
const SIZE = 10 * UNIT_TO_KM;
const DISTANCE_TO_WORLD_ORIGIN = MOON_UNIT_RADIUS;
const geometry = new BoxGeometry(SIZE, SIZE, SIZE);
const MESH_TABLE_BY_TYPE = {
    M: new MeshBasicMaterial({
        color: `hsl(${0}, 100%, 50%)`,
        wireframe: false
    }),
    SH: new MeshBasicMaterial({
        color: `hsl(${64}, 100%, 50%)`,
        wireframe: false
    }),
    A: new MeshBasicMaterial({
        color: `hsl(${128}, 100%, 50%)`,
        wireframe: false
    }),
    _: new MeshBasicMaterial({
        color: `hsl(${192}, 100%, 50%)`,
        wireframe: false
    })
};
function getMesh(type) {
    if (type === 'M' || type === 'SH')
        return MESH_TABLE_BY_TYPE[type];
    if (type.match(/A\d+/))
        return MESH_TABLE_BY_TYPE.A;
    return MESH_TABLE_BY_TYPE._;
}
function createLabel(data) {
    const elem = document.createElement('div');
    elem.textContent = data.type;
    elem.style.display = 'none';
    return elem;
}
export function createMesh(radiusToOrigin, lat, lon, depth, type) {
    const profundity = depth * UNIT_TO_KM;
    const geo = depth > 0.1 ? new BoxGeometry(SIZE, SIZE, profundity) : geometry;
    const newQuake = new Mesh(geo, getMesh(type));
    // newQuake.position.setFromSphericalCoords(
    //   radiusToOrigin,
    //   long,
    //   lat,
    //   // MathUtils.degToRad(lat - 270),
    //   // MathUtils.degToRad(long - 270),
    // );
    // newQuake.position.setFromSphericalCoords(
    //   radiusToOrigin,
    //   (90-lat)*(Math.PI/180),
    //   (lon+180)*(Math.PI/180),
    // );
    const phi = (90 - lon) * (Math.PI / 180), theta = (lat + 180) * (Math.PI / 180);
    newQuake.position.set(-((radiusToOrigin - profundity / 2) * Math.sin(phi) * Math.cos(theta)), -((radiusToOrigin - profundity / 2) * Math.sin(phi) * Math.sin(theta)), -((radiusToOrigin - profundity / 2) * Math.cos(phi)));
    newQuake.visible = false;
    newQuake.name = 'quake';
    newQuake.layers.enable(RAYCASTER_CHANNEL);
    newQuake.lookAt(0, 0, 0);
    return newQuake;
}
export class Quake {
    mesh;
    label;
    labelContainer;
    date;
    depth;
    pulse;
    isVisible;
    constructor(data) {
        this.mesh = createMesh(DISTANCE_TO_WORLD_ORIGIN, data.latitude, data.longitude, data.depth, data.type);
        this.mesh.userData.quake = this;
        this.pulse = new Pulse(SIZE * 4, this.mesh.material.color.getHex());
        this.pulse.position.copy(this.mesh.position);
        this.pulse.lookAt(0, 0, 0);
        this.label = createLabel(data);
        this.depth = data.depth;
        this.date = data.date;
        this.isVisible = false;
    }
    toggleVisivility() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.mesh.visible = true;
            this.pulse.start();
        }
        else {
            this.mesh.visible = false;
            this.pulse.stop();
        }
    }
    setVisibility(visible) {
        this.isVisible = visible;
        if (visible) {
            this.mesh.visible = true;
            this.pulse.start();
        }
        else {
            this.mesh.visible = false;
            this.pulse.stop();
        }
    }
    showLabel() {
        this.label.style.display = 'block';
    }
    hideLabel() {
        this.label.style.display = 'none';
    }
    update() {
        if (!this.isVisible)
            return;
        this.pulse.update();
    }
}
//# sourceMappingURL=quake.js.map