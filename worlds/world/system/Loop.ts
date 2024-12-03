import { Camera, Clock, Scene, WebGLRenderer } from 'three';
import { ClassNotInitializedError } from '../../../src/class/ClassNotInitializedError';

/** Interface for objects that can be updated each frame */
type Updatable = (delta: number, elapsedTime: number) => unknown;

/**
 * Manages the animation loop and updates for a Three.js scene
 * @class Loop
 */
class Loop {
  private camera: Camera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private previousTime: number = 0;
  private isRunning: boolean = false;
  private updatables: Set<Updatable> = new Set(); // Utilisation d'un Set pour éviter les doublons

  /**
   * Creates an instance of Loop
   * @param {Object} dependencies - Required dependencies
   * @param {Camera} dependencies.camera - Three.js camera
   * @param {Scene} dependencies.scene - Three.js scene
   * @param {WebGLRenderer} dependencies.renderer - Three.js renderer
   */
  constructor(dependencies: {
    camera: Camera;
    scene: Scene;
    renderer: WebGLRenderer;
  }) {
    this.camera = dependencies.camera;
    this.scene = dependencies.scene;
    this.renderer = dependencies.renderer;
    this.clock = new Clock();
  }

  /**
   * Adds one or multiple update functions to the animation loop
   * @param {Updatable | Updatable[]} updatable - Function(s) to be called each frame
   */
  add = (updatable: Updatable | Updatable[]): void => {
    if (Array.isArray(updatable)) {
      updatable.forEach((fn) => this.updatables.add(fn));
    } else {
      this.updatables.add(updatable);
    }
  };

  /**
   * Removes one or multiple update functions from the animation loop
   * @param {Updatable | Updatable[]} updatable - Function(s) to be removed
   */
  remove = (updatable: Updatable | Updatable[]): void => {
    if (Array.isArray(updatable)) {
      updatable.forEach((fn) => this.updatables.delete(fn));
    } else {
      this.updatables.delete(updatable);
    }
  };

  /**
   * Starts the animation loop
   * @throws {Error} If the loop is already running
   */
  start = (): void => {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.previousTime = this.clock.getElapsedTime();
    this.renderer.setAnimationLoop(() => {
      const elapsedTime = this.clock.getElapsedTime();
      const delta = elapsedTime - this.previousTime;
      this.previousTime = elapsedTime;

      // Exécute toutes les fonctions d'update
      this.updatables.forEach((update) => update(delta, elapsedTime));

      this.renderer.render(this.scene, this.camera);
    });
  };

  /**
   * Stops the animation loop
   * @throws {Error} If the loop is not running
   */
  stop = (): void => {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.clock.stop();
    this.renderer.setAnimationLoop(null);
  };
}

// Singleton
let loopInstance: Loop;

/**
 * Creates a singleton instance of the Loop class
 * @param {Object} dependencies - Required dependencies
 * @param {Camera} dependencies.camera - Three.js camera
 * @param {Scene} dependencies.scene - Three.js scene
 * @param {WebGLRenderer} dependencies.renderer - Three.js renderer
 * @returns {Loop} The singleton Loop instance
 */
const createLoop = (dependencies: {
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
}) => {
  if (!loopInstance) {
    loopInstance = new Loop(dependencies);
  }
  return loopInstance;
};

/**
 * Creates a proxy for the Loop class to ensure it's properly initialized before accessing its properties
 * @type {Loop}
 */
const loop = new Proxy({} as Loop, {
  get: (_, prop) => {
    if (!loopInstance) {
      throw new ClassNotInitializedError('Loop');
    }
    return loopInstance[prop as keyof Loop];
  },
});

export { loop, createLoop };
export type { Updatable, Loop };
