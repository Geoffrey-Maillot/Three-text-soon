import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { createLoop } from '../world/system/Loop';
import { createResizer } from '../world/system/Resizer';
import { createRaycast } from '../world/system/Raycaster';
import { createControls } from '../world/system/control';

const initSystem = (dependencies: {
  camera: Camera;
  scene: Scene;
  renderer: WebGLRenderer;
  container: HTMLDivElement;
}) => {
  const { camera, scene, renderer, container } = dependencies;

  createLoop({ camera, scene, renderer });
  createResizer({ camera: camera as PerspectiveCamera, renderer, container });
  createRaycast({ camera });
  createControls({ camera, renderer });
};

export { initSystem };
