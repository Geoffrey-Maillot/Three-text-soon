import { WebGLRenderer, PerspectiveCamera, Vector2 } from 'three';

import { createRenderer } from './system/renderer';
import { scene } from './components/scene';
import { createCamera } from './components/camera';
import { createLoop, loop } from './system/Loop';
import { Text } from './components/text/Text';
import { Donuts } from './components/donuts/Donuts';
import { createResizer } from './system/Resizer';
import { createRaycast, raycast } from './system/Raycaster';
import { createControls } from './system/control';

class World {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private animateCamera: () => void;
  private updateCameraPosition: (pointer: Vector2) => void;
  private Text: Text;
  private Donuts: Donuts;
  constructor(container: HTMLDivElement) {
    /**
     * Init system
     */
    this.renderer = createRenderer();
    container.appendChild(this.renderer.domElement);

    const { camera, animateCamera, updateCameraPosition } = createCamera();

    this.camera = camera;
    this.animateCamera = animateCamera;
    this.updateCameraPosition = updateCameraPosition;

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

  startAnimation() {
    this.Text.animateSoonText()?.eventCallback('onComplete', () => {
      console.log('onComplete');
      loop.add(() => this.updateCameraPosition(raycast.pointer));
    });
    this.animateCamera();
  }

  stop() {
    loop.stop();
  }
}

export { World };
