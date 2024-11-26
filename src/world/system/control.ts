import { Camera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loop } from './Loop';

const createControls = ({
  camera,
  renderer,
}: {
  camera: Camera;
  renderer: WebGLRenderer;
}) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;

  const tick = () => {
    controls.update();
  };

  loop.add(tick);

  return controls;
};

export { createControls };
