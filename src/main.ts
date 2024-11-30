import { World } from '../worlds/world/World';
import gsap from 'gsap';

const container = document.getElementById('canvas-container') as HTMLDivElement;
const waitingContainer = document.getElementById(
  'waiting-container'
) as HTMLDivElement;

const world = new World(container);
//let ui: UI;

try {
  await world.init();
  world.start();
  // Handle tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations and heavy computations when tab is not visible
      world.stop();
    } else {
      // Resume when tab becomes visible again
      world.start();
    }
  });
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
