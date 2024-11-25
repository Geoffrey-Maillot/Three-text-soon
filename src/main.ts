import { World } from './world/World';

const container = document.getElementById('canvas-container') as HTMLDivElement;

console.log(container);

const world = new World(container);

world.start();
