import { PerspectiveCamera, WebGLRenderer } from 'three';
import { ClassNotInitializedError } from '../../../src/class/ClassNotInitializedError';

/**
 * Dependencies required for the Resizer class initialization
 * @interface ResizerDependencies
 */
interface ResizerDependencies {
  /** The container element that wraps the canvas */
  container: HTMLDivElement;
  /** The Three.js WebGL renderer instance */
  renderer: WebGLRenderer;
  /** The Three.js perspective camera instance */
  camera: PerspectiveCamera;
  /** Whether the resizer should automatically handle window resize events */
  autoResize?: boolean;
}

/**
 * Handles the resizing of the WebGL renderer and camera aspect ratio
 * Implements a singleton pattern to ensure only one instance exists
 */
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

  /**
   * Updates the pixel ratio of the renderer
   * Limits the pixel ratio to a maximum of 2 for performance
   * @private
   */
  private updatePixelRatio() {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(pixelRatio);
  }

  /**
   * Checks if the renderer needs to be resized based on container dimensions
   * @private
   * @returns {boolean} Whether a resize is needed
   */
  private needsResize() {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const width = (this.container.clientWidth * pixelRatio) | 0;
    const height = (this.container.clientHeight * pixelRatio) | 0;
    return (
      this.renderer.domElement.width !== width ||
      this.renderer.domElement.height !== height
    );
  }

  /**
   * Adjusts the size of the renderer and updates the camera aspect ratio
   * Only resizes if necessary to avoid unnecessary calculations
   */
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

/**
 * Creates a singleton instance of the Resizer
 * @param {ResizerDependencies} dependencies - The required dependencies
 * @returns {Resizer} The singleton Resizer instance
 */
const createResizer = (dependencies: ResizerDependencies) => {
  if (!resizerInstance) {
    resizerInstance = new Resizer(dependencies);
  }
  return resizerInstance;
};

/**
 * Creates a proxy for the Resizer class to ensure it's properly initialized before accessing its properties
 * @type {Resizer}
 */
const resizer = new Proxy({} as Resizer, {
  get: (_, prop) => {
    if (!resizerInstance) {
      throw new ClassNotInitializedError('Resizer');
    }
    return resizerInstance[prop as keyof Resizer];
  },
});

export { resizer, createResizer };
export type { ResizerDependencies, Resizer };
