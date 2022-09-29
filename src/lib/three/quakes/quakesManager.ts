import type { Scene } from 'three'
import { Quake } from './quake';
import type { QuakeData } from './types';

interface EventsMap {
  'appear': (quake: Quake) => void,
  'hidden': () => void
}

class QuakesManager {
  private scene: Scene;
  private baseQuakes: Quake[];
  public quakes: Quake[];
  private quakesVisibles: boolean;
  private currentQuake: number;
  private listeners: {
    [k in keyof EventsMap]: EventsMap[k][]
  };

  constructor(scene: Scene, quakesData: QuakeData[]) {
    this.scene = scene;
    this.baseQuakes = [];
    this.quakes = [];
    this.initilizeQuakes(quakesData)
    this.quakesVisibles = false;
    this.currentQuake = 0;
    this.listeners = { 'appear': [], 'hidden': [] }
  }

  initilizeQuakes(quakes: QuakeData[]) {
    quakes.forEach(quakeData => {
      const quake = new Quake(quakeData);
      this.scene.add(quake.mesh);
      this.baseQuakes.push(quake)
    });
  }

  toggleQuakesVisualization() {
    this.quakesVisibles = !this.quakesVisibles;
    this.baseQuakes.forEach(quake => quake.mesh.visible = this.quakesVisibles)
  }

  showNextQuake() {
    this.notifyQuakeHidden();
    this.baseQuakes[this.currentQuake].mesh.visible = false;
    this.currentQuake += 1;
    if (this.currentQuake > this.baseQuakes.length) this.currentQuake = 0;
    const quake = this.baseQuakes[this.currentQuake]
    quake.mesh.visible = true;
    this.notifyQuakeAppear(quake);
  }

  notifyQuakeHidden() {
    this.listeners['hidden'].forEach(callback => callback());
  }
  notifyQuakeAppear(quake: Quake) {
    this.listeners['appear'].forEach(callback => callback(quake));
  }

  addEventListener<K extends keyof EventsMap>(event: K, callback: EventsMap[K]) {
    this.listeners[event].push(callback)
  }

  filterBy(filter: (quake: Quake) => boolean, allQuakes = false) {
    if (allQuakes)
      this.quakes = this.baseQuakes.filter(filter)
    else
      this.quakes = this.quakes.filter(filter)
    return this
  }
  shortBy(short: (quake1: Quake, quake2: Quake) => number, allQuakes = false) {
    if (allQuakes)
      this.quakes = this.baseQuakes.slice().sort(short)
    else
      this.quakes = this.quakes.sort(short)
    return this
  }
}

export { QuakesManager }