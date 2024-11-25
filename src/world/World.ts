import { WebGLRenderer, PerspectiveCamera } from 'three';

import { createRenderer } from './system/renderer';
import { scene } from './components/scene';
import { createCamera } from './components/camera';
import { loop } from './system/Loop';
import { initSystem } from '../utils/initSystem';
import { Text } from './components/text/Text';
import { Donuts } from './components/donuts/Donuts';

class World {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private Text: Text;
  private Donuts: Donuts;
  constructor(container: HTMLDivElement) {
    this.renderer = createRenderer();
    container.appendChild(this.renderer.domElement);

    this.camera = createCamera();

    initSystem({
      camera: this.camera,
      scene: scene,
      renderer: this.renderer,
      container,
    });

    this.Text = new Text();
    this.Donuts = new Donuts();
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
    this.Text.animateSoonText();
  }

  stop() {
    loop.stop();
  }
}

export { World };
