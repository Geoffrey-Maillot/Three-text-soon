import { PerspectiveCamera } from 'three';

const settings = {
  fov: 45,
  aspect: 1, //dummy value
  near: 0.1,
  far: 100,
};

const createCamera = () => {
  const camera = new PerspectiveCamera(
    settings.fov,
    settings.aspect,
    settings.near,
    settings.far
  );

  camera.position.set(0, 0, 10);

  return camera;
};

export { createCamera };
