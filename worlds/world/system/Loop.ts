import { Camera, Clock, Scene, WebGLRenderer } from 'three';
import { ClassNotInitializedError } from '../../../src/class/ClassNotInitializedError';

type Updatable = (delta: number, elapsedTime: number) => unknown;

class Loop {
  private camera: Camera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private previousTime: number = 0;
  private isRunning: boolean = false;
  private updatables: Set<Updatable> = new Set(); // Utilisation d'un Set pour éviter les doublons

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

  // Ajoute une ou plusieurs fonctions d'update
  add = (updatable: Updatable | Updatable[]): void => {
    if (Array.isArray(updatable)) {
      updatable.forEach((fn) => this.updatables.add(fn));
    } else {
      this.updatables.add(updatable);
    }
  };

  // Supprime une ou plusieurs fonctions d'update
  remove = (updatable: Updatable | Updatable[]): void => {
    if (Array.isArray(updatable)) {
      updatable.forEach((fn) => this.updatables.delete(fn));
    } else {
      this.updatables.delete(updatable);
    }
  };

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

  stop = (): void => {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.clock.stop();
    this.renderer.setAnimationLoop(null);
  };
}

// Singleton
let loopInstance: Loop;

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

const loop = new Proxy({} as Loop, {
  get: (target, prop) => {
    if (!loopInstance) {
      throw new ClassNotInitializedError('Loop');
    }
    return loopInstance[prop as keyof Loop];
  },
});

export { loop, createLoop };
export type { Updatable, Loop };
