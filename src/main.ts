import { World } from './world/World';
import gsap from 'gsap';

const container = document.getElementById('canvas-container') as HTMLDivElement;
const waitingContainer = document.getElementById(
  'waiting-container'
) as HTMLDivElement;

const world = new World(container);

try {
  await world.init();
  world.start();
  // Animate waiting container fade out
  gsap.to(waitingContainer, {
    opacity: 0,
    scale: 0,
    duration: 0.7,
    onComplete: () => {
      waitingContainer.style.display = 'none';
    },
  });
  container.style.opacity = '1';
} catch (error) {
  console.error(error);
}
