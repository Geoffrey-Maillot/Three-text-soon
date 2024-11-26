import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { pane } from '../system/Tweakpane';
import gsap from 'gsap';

const settings = {
  fov: 45,
  aspect: 1, //dummy value
  near: 0.1,
  far: 100,
};

//params for camera update position
const params = {
  targetX: 0,
  targetY: 0,
  smoothness: 0.1,
  distance: 12,
};
const target = new Vector3();

// Tweaks
const folder = pane.addFolder({ title: 'Camera' });

const createCamera = () => {
  const camera = new PerspectiveCamera(
    settings.fov,
    settings.aspect,
    settings.near,
    settings.far
  );

  camera.position.set(4.5, 0, -16);

  // add tweaks
  folder.addBinding(camera.position, 'x', {
    min: -20,
    max: 20,
    step: 1,
  });
  folder.addBinding(camera.position, 'y', {
    min: -20,
    max: 20,
    step: 1,
  });
  folder.addBinding(camera.position, 'z', {
    min: -20,
    max: 20,
    step: 1,
  });

  // camera animation

  const animateCamera = () => {
    const timeline = gsap.timeline();

    timeline
      .to(camera.position, {
        z: 0,
        duration: 2,
        ease: 'power1.in',
      })
      .to(camera.position, {
        z: 10,
        x: -4,
        duration: 3,
        ease: 'power2.out',
      });
  };

  const updateCameraPosition = (pointer: Vector2) => {
    params.targetX = pointer.x * params.distance;
    params.targetY = -pointer.x * params.distance;

    target.set(params.targetX, params.targetY, camera.position.z);

    camera.position.lerp(target, params.smoothness);
  };

  return { camera, animateCamera, updateCameraPosition };
};

export { createCamera };
