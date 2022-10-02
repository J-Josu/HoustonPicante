import { Camera, Raycaster, Scene, Vector2 } from 'three';
import { RAYCASTER_CHANNEL } from '$three/constants';
class RaycasterManager {
    scene;
    canvas;
    rc;
    cachedClick;
    actualClick;
    lastClick;
    onClickSubscribers;
    onClick;
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.rc = new Raycaster();
        this.rc.layers.set(RAYCASTER_CHANNEL);
        this.cachedClick = new Vector2();
        this.actualClick = null;
        this.lastClick = new Vector2();
        this.onClickSubscribers = [];
        const $ = this;
        this.onClick = (event) => {
            const rect = $.canvas.getBoundingClientRect();
            const relativeX = event.clientX - rect.left;
            const relativeY = event.clientY - rect.top;
            $.cachedClick.x = (relativeX / canvas.clientWidth) * 2 - 1;
            $.cachedClick.y = (relativeY / canvas.clientHeight) * -2 + 1;
            this.actualClick = this.cachedClick;
        };
        window.addEventListener('pointerdown', this.onClick);
    }
    update(camera) {
        if (this.actualClick === null)
            return;
        // TODO: improve this
        if (this.actualClick.equals(this.lastClick))
            return;
        this.rc.setFromCamera(this.actualClick, camera);
        const intersections = this.rc.intersectObjects(this.scene.children, true);
        if (!intersections.length) {
            this.actualClick = null;
            return;
        }
        intersections.forEach(intersection => {
            this.onClickSubscribers.forEach(callback => callback(intersection.object));
        });
        this.lastClick.copy(this.actualClick);
        this.actualClick = null;
    }
    addClickListener(callback) {
        this.onClickSubscribers.push(callback);
    }
}
export { RaycasterManager };
//# sourceMappingURL=raycaster.js.map