import { Camera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loop } from './Loop';
import { pane } from './Tweakpane';

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

  const folder = pane.addFolder({ title: 'Camera' });
  folder.addBinding(controls, 'enabled', { label: 'Enabled control' });

  const tick = () => {
    controls.update();
  };

  loop.add(tick);

  return controls;
};

export { createControls };
