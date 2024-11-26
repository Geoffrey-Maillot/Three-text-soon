import { Group, Mesh } from 'three';
import { createMatcapMaterial } from '../createMatCapMaterial';
import { createDonutGeometry } from './createDonutGeometry';
import { loop, Updatable } from '../../system/Loop';
import { pane } from '../../system/Tweakpane';

// Initil params
const params = {
  numberOfDonuts: 600,
  donutLimitPosition: 0.08,
  donutSpeedRotation: 0.65,
};

// Tweaks
const folder = pane.addFolder({ title: 'Donuts' });

const addTweaks = (onFinishChange: () => void) => {
  folder
    .addBinding(params, 'numberOfDonuts', { min: 1, max: 1000 })
    .on('change', (evt) => {
      if (evt.last) {
        onFinishChange();
      }
    });

  folder
    .addBinding(params, 'donutLimitPosition', { min: 0, max: 0.1 })
    .on('change', (evt) => {
      if (evt.last) {
        onFinishChange();
      }
    });
  folder
    .addBinding(params, 'donutSpeedRotation', { min: 0, max: 1 })
    .on('change', (evt) => {
      if (evt.last) {
        onFinishChange();
      }
    });
};

// Calcul offset for each donut
const calculOffset = (index: number) => {
  return (index * Math.PI * 2) / params.numberOfDonuts;
};

/**
 * Donuts
 */
class Donuts extends Group {
  private donuts: Mesh[] = [];
  private ticks: Updatable[] = [];
  constructor() {
    super();

    addTweaks(() => {
      this.removeDonuts();
      this.init();
    });
  }

  async init() {
    const donutMaterial = await createMatcapMaterial();
    const donutGeometry = createDonutGeometry();

    for (let i = 0; i < params.numberOfDonuts; i++) {
      const donut = new Mesh(donutGeometry, donutMaterial);

      const ramdomPosition = () => (Math.random() - 0.5) * 30;

      const scale = Math.random() * 0.8 + 0.2; // Entre 0.2 et 1

      donut.position.set(ramdomPosition(), ramdomPosition(), ramdomPosition());

      donut.scale.set(scale, scale, scale);

      const randomRotation = () => Math.random() * Math.PI * 0.5;

      donut.rotation.set(randomRotation(), randomRotation(), randomRotation());

      const offset = calculOffset(i);

      const tick = (deltaTime: number, elapsedTime: number) => {
        donut.position.x +=
          Math.sin(elapsedTime + offset) *
          deltaTime *
          params.donutLimitPosition;
        donut.position.y +=
          Math.cos(elapsedTime + offset) *
          deltaTime *
          params.donutLimitPosition;
        donut.position.z +=
          Math.sin(elapsedTime + offset) *
          deltaTime *
          params.donutLimitPosition;

        donut.rotation.x +=
          Math.sin(elapsedTime + offset) *
          deltaTime *
          params.donutSpeedRotation;
        donut.rotation.y +=
          Math.cos(elapsedTime + offset) *
          deltaTime *
          params.donutSpeedRotation;
        donut.rotation.z +=
          Math.sin(elapsedTime + offset) *
          deltaTime *
          params.donutSpeedRotation;
      };
      this.donuts.push(donut);
      this.ticks.push(tick);
    }
    this.donuts.forEach((donut) => this.add(donut));
    this.ticks.forEach((tick) => loop.add(tick));
  }

  removeDonuts() {
    this.donuts.forEach((donut) => {
      this.remove(donut);
      donut.geometry.dispose();
      if (Array.isArray(donut.material)) {
        donut.material.forEach((material) => material.dispose());
      } else {
        donut.material.dispose();
      }
    });
    this.donuts = [];
    loop.remove(this.ticks);
  }
}

export { Donuts };
