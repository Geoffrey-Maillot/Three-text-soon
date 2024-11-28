import { WebGLRenderer, PerspectiveCamera } from 'three';

import { createRenderer } from './system/renderer';
import { scene } from './components/scene';
import { createCamera } from './components/camera';
import { createLoop, loop } from './system/Loop';
import { Text } from './components/text/Text';
import { Donuts } from './components/donuts/Donuts';
import { createResizer } from './system/Resizer';
import { createRaycast } from './system/Raycaster';
import { createControls } from './system/control';

class World {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;

  private Text: Text;
  private Donuts: Donuts;
  constructor(container: HTMLDivElement) {
    /**
     * Init system
     */
    this.renderer = createRenderer();
    container.appendChild(this.renderer.domElement);

    const camera = createCamera();

    this.camera = camera;

    createLoop({ camera: this.camera, scene, renderer: this.renderer });
    createResizer({
      camera: this.camera as PerspectiveCamera,
      renderer: this.renderer,
      container,
    });
    createRaycast({ camera: this.camera });
    createControls({
      camera: this.camera,
      renderer: this.renderer,
    });

    /**
     * Init component
     */
    this.Text = new Text();
    this.Donuts = new Donuts();

    /**
     * Add component to scene
     */
    scene.add(this.Text, this.Donuts);
  }

  async init() {
    await this.Text.init();
    await this.Donuts.init();
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
