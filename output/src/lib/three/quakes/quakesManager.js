import { Quake } from './quake';
class QuakesManager {
    scene;
    rcManager;
    baseQuakes;
    quakes;
    quakesVisibles;
    currentQuake;
    listeners;
    labelsContainer;
    labels;
    addLabel;
    initilizeQuakes;
    constructor(scene, raycasterManager, quakesData) {
        this.scene = scene;
        this.rcManager = raycasterManager;
        this.baseQuakes = [];
        this.quakes = [];
        this.quakesVisibles = false;
        this.currentQuake = 0;
        this.listeners = { 'appear': [], 'hidden': [] };
        this.labels = [];
        // this.labelsContainer
        const $ = this;
        this.addLabel = (quake) => {
            quake.showLabel();
            this.labels.push(quake);
            this.labelsContainer.appendChild(quake.label);
        };
        this.initilizeQuakes = (quakes) => {
            quakes.forEach(quakeData => {
                const quake = new Quake(quakeData);
                $.scene.add(quake.mesh);
                $.baseQuakes.push(quake);
            });
        };
        this.initilizeQuakes(quakesData);
        this.rcManager.addClickListener((element) => {
            console.log(element);
            if (!element.userData.quake)
                return;
            console.log(element.userData.quake);
            $.addLabel(element.userData.quake);
        });
    }
    toggleQuakesVisualization() {
        this.quakesVisibles = !this.quakesVisibles;
        this.baseQuakes.forEach(quake => quake.mesh.visible = this.quakesVisibles);
    }
    showNextQuake() {
        this.notifyQuakeHidden();
        this.baseQuakes[this.currentQuake].mesh.visible = false;
        this.currentQuake += 1;
        if (this.currentQuake > this.baseQuakes.length)
            this.currentQuake = 0;
        const quake = this.baseQuakes[this.currentQuake];
        quake.mesh.visible = true;
        this.notifyQuakeAppear(quake);
    }
    notifyQuakeHidden() {
        this.listeners['hidden'].forEach(callback => callback());
    }
    notifyQuakeAppear(quake) {
        this.listeners['appear'].forEach(callback => callback(quake));
    }
    addEventListener(event, callback) {
        this.listeners[event].push(callback);
    }
    filterBy(filter, allQuakes = false) {
        if (allQuakes)
            this.quakes = this.baseQuakes.filter(filter);
        else
            this.quakes = this.quakes.filter(filter);
        return this;
    }
    shortBy(short, allQuakes = false) {
        if (allQuakes)
            this.quakes = this.baseQuakes.slice().sort(short);
        else
            this.quakes = this.quakes.sort(short);
        return this;
    }
    update() {
        // this.labels
    }
}
export { QuakesManager };
//# sourceMappingURL=quakesManager.js.map