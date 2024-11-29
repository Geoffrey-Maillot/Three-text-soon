import { World } from './world/World';

const container = document.getElementById('canvas-container') as HTMLDivElement;
const waitingContainer = document.getElementById(
  'waiting-container'
) as HTMLDivElement;

const world = new World(container);

try {
  await world.init();
  waitingContainer.style.display = 'none';
  container.style.opacity = '1';
  world.start();
} catch (error) {
  console.error(error);
}
