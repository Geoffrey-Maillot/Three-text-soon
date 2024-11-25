import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  Intersection,
} from 'three';

import { createRenderer } from './system/renderer';
import { createScene } from './components/scene';
import { createCamera } from './components/camera';
import { loop } from './system/Loop';
import { raycast } from './system/Raycaster';
import { pane } from './system/Tweakpane';
import { initSystem } from '../utils/initSystem';

class World {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;

  constructor(container: HTMLDivElement) {
    this.renderer = createRenderer();
    container.appendChild(this.renderer.domElement);

    this.scene = createScene();
    this.camera = createCamera();

    initSystem({
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      container,
    });

    const params = {
      color: '#ff0000',
    };

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshBasicMaterial({ color: params.color })
    );
    const cubeFolder = pane.addFolder({ title: 'Cube' });

    cubeFolder
      .addBinding(params, 'color', { label: 'color ', view: 'color' })
      .on('change', ({ value }) => {
        console.log(value);
        cube.material.color.set(value);
      });

    loop.add({
      tick: () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      },
    });

    const onHoverCube = (intersection: Intersection | null) => {
      if (intersection) {
        cube.material.color.set('#00ff00');
      } else {
        cube.material.color.set(params.color);
      }
    };

    const onCLickCube = (intersection: Intersection | null) => {
      if (intersection) {
        cube.material.color.set('#0000ff');
      }
    };

    raycast.addObject(cube, onHoverCube, { type: 'hover' });
    raycast.addObject(cube, onCLickCube, { type: 'click' });
    this.scene.add(cube);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
