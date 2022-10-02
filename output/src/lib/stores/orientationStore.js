import { controlManager } from '../../routes/setup';
import { writable } from 'svelte/store';
const createOrientationStore = () => {
    const { subscribe, set, update } = writable({
        enabled: false,
        wasDisabled: true,
        landscape: false,
        base: {
            alpha: 0,
            beta: 0,
            gamma: 0
        },
        actual: {
            alpha: 0,
            beta: 0,
            gamma: 0
        }
    });
    let onDisableCallback;
    function enable() {
        update(state => {
            state.enabled = true;
            state.wasDisabled = true;
            window.addEventListener('deviceorientation', controlManager.handleDeviceOrientation);
            return state;
        });
    }
    function disable() {
        update(state => {
            state.enabled = false;
            window.removeEventListener('deviceorientation', controlManager.handleDeviceOrientation);
            onDisableCallback();
            return state;
        });
    }
    function toggle() {
        update(state => {
            state.enabled = controlManager.toggleGiroscopic();
            return state;
        });
    }
    function onDisable(callback) {
        onDisableCallback = callback;
    }
    return {
        subscribe,
        set,
        update,
        disable,
        enable,
        toggle,
        onDisable
    };
};
export const orientation = createOrientationStore();
//# sourceMappingURL=orientationStore.js.map