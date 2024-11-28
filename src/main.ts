import { World } from './world/World';

const container = document.getElementById('canvas-container') as HTMLDivElement;

const world = new World(container);

try {
  await world.init();
  world.start();
} catch (error) {
  console.error(error);
}
