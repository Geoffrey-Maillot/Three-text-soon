import { Camera, Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { ClassNotInitializedError } from '../../class/ClassNotInitializedError';

interface Updatable {
  tick(delta: number, elapsedTime: number): void;
}

class Loop {
  private camera: Camera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private clock: Clock;
  private previousTime: number = 0;
  private isRunning: boolean = false;
  private updatables: Updatable[] = [];

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

  // Ajoute un ou plusieurs objets à la boucle d'animation
  add = (object: Updatable | Updatable[]): void => {
    if (Array.isArray(object)) {
      object.forEach((obj) => this.addUpdatable(obj));
    } else {
      this.addUpdatable(object);
    }
  };

  // Supprime un ou plusieurs objets de la boucle d'animation
  remove = (object: Updatable | Updatable[]): void => {
    if (Array.isArray(object)) {
      object.forEach((obj) => this.removeUpdatable(obj));
    } else {
      this.removeUpdatable(object);
    }
  };

  private addUpdatable = (object: Updatable): void => {
    this.updatables.push(object);
  };

  private removeUpdatable = (object: Updatable): void => {
    const index = this.updatables.indexOf(object);
    if (index !== -1) {
      this.updatables.splice(index, 1);
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

      for (const object of this.updatables) {
        object.tick(delta, elapsedTime);
      }

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

// Create singleton loop with dependencies
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

// Export le proxy qui vérifie l'initialisation
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
