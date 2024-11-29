import { PerspectiveCamera, WebGLRenderer } from 'three';
import { ClassNotInitializedError } from '../../class/ClassNotInitializedError';

interface ResizerDependencies {
  container: HTMLDivElement;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  autoResize?: boolean;
}

class Resizer {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private autoResize: boolean;
  private container: HTMLDivElement;
  constructor({
    container,
    renderer,
    camera,
    autoResize = true,
  }: ResizerDependencies) {
    this.renderer = renderer;
    this.camera = camera;
    this.autoResize = autoResize;
    this.container = container;

    // Initialiser le pixel ratio
    this.updatePixelRatio();

    // Définir la taille initiale du canvas
    this.setSize();

    // Écouteur de redimensionnement si autoResize est activé
    if (this.autoResize) {
      window.addEventListener('resize', () => this.setSize());
    }

    // Écouteur pour les changements de pixel ratio (utile pour les écrans Retina)
    window
      .matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      .addEventListener('change', () => this.updatePixelRatio());
  }

  // Met à jour le pixel ratio du renderer
  private updatePixelRatio() {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
  }

  // Vérifie si un redimensionnement est nécessaire
  private needsResize() {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = (this.container.clientWidth * pixelRatio) | 0;
    const height = (this.container.clientHeight * pixelRatio) | 0;
    return (
      this.renderer.domElement.width !== width ||
      this.renderer.domElement.height !== height
    );
  }

  // Ajuste la taille du renderer et de la caméra
  setSize() {
    if (!this.needsResize()) return;

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = (this.container.clientWidth * pixelRatio) | 0;
    const height = (this.container.clientHeight * pixelRatio) | 0;

    this.renderer.setSize(width, height, false);

    // Met à jour le rapport d'aspect de la caméra et recalculer la matrice de projection
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }
}

// Singleton
let resizerInstance: Resizer;

// Create singleton resizer with dependencies
const createResizer = (dependencies: ResizerDependencies) => {
  if (!resizerInstance) {
    resizerInstance = new Resizer(dependencies);
  }
  return resizerInstance;
};

// Export le proxy qui vérifie l'initialisation
const resizer = new Proxy({} as Resizer, {
  get: (target, prop) => {
    if (!resizerInstance) {
      throw new ClassNotInitializedError('Resizer');
    }
    return resizerInstance[prop as keyof Resizer];
  },
});

export { resizer, createResizer };
export type { ResizerDependencies, Resizer };
