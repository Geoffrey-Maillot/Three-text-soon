import { PerspectiveCamera, Vector3 } from 'three';
import { pane } from '../system/Tweakpane';
import { animationManager } from '../../../src/class/AnimationManager';
import { raycast } from '../system/Raycaster';
import { loop } from '../system/Loop';

/**
 * Camera settings configuration
 * @type {Object}
 */
const settings = {
  fov: 45,
  aspect: 1, // Will be updated based on screen size
  near: 0.1,
  far: 100,
};

/**
 * Parameters for camera position updates and mouse tracking
 * @type {Object}
 */
const params = {
  targetX: 0,
  targetY: 0,
  smoothness: 0.1, // Lerp factor for smooth camera movement
  distance: 12, // Maximum distance for mouse movement effect
  mouseAnimation: true,
};
const target = new Vector3();

// Tweaks
const folder = pane.addFolder({ title: 'Camera' });

/**
 * Creates and configures a perspective camera with mouse tracking capabilities
 * @returns {PerspectiveCamera} Configured THREE.js camera
 */
const createCamera = () => {
  const camera = new PerspectiveCamera(
    settings.fov,
    settings.aspect,
    settings.near,
    settings.far
  );

  camera.position.set(4.5, 0, -16);

  // add tweaks
  const controlPositionX = folder.addBinding(camera.position, 'x', {
    label: 'positionX',
    min: -20,
    max: 20,
    step: 1,
    disabled: true,
  });
  const controlPositionY = folder.addBinding(camera.position, 'y', {
    label: 'positionY',
    min: -20,
    max: 20,
    step: 1,
    disabled: true,
  });
  const controlPositionZ = folder.addBinding(camera.position, 'z', {
    label: 'positionZ',
    min: -20,
    max: 20,
    step: 1,
    disabled: true,
  });
  folder.addBinding(params, 'smoothness', {
    label: 'Lerp factor',
    min: 0,
    max: 1,
    step: 0.01,
  });
  folder.addBinding(params, 'distance', {
    label: 'Distance',
    min: 0,
    max: 20,
    step: 1,
  });

  /**
   * Handles mouse tracking animation for camera
   * Moves camera based on raycast pointer position
   */
  folder
    .addBinding(params, 'mouseAnimation', {
      label: 'Mouse Animation',
    })
    .on('change', ({ value }) => {
      if (value) {
        loop.add(animeTrackMouse);
        controlPositionX.disabled = true;
        controlPositionY.disabled = true;
        controlPositionZ.disabled = true;
      } else {
        loop.remove(animeTrackMouse);
        controlPositionX.disabled = false;
        controlPositionY.disabled = false;
        controlPositionZ.disabled = false;
      }
    });

  /**
   * Handles mouse tracking animation for camera
   * Moves camera based on raycast pointer position
   */
  const animeTrackMouse = () => {
    // Calculate target position based on mouse position
    params.targetX = raycast.pointer.x * params.distance;
    params.targetY = -raycast.pointer.x * params.distance;

    // Update target vector
    target.set(params.targetX, params.targetY, camera.position.z);

    // Smoothly interpolate camera position
    camera.position.lerp(target, params.smoothness);
  };

  // Initialize camera animation timeline
  const timeline = animationManager.createAnimation('cameraAnimation');

  // Setup initial camera animation sequence
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

  // Start mouse tracking after text animation completes
  animationManager.onAnimationCreated('animateSoonText', (textAnimation) => {
    textAnimation.eventCallback('onComplete', () => {
      loop.add(animeTrackMouse);
    });
  });

  return camera;
};

export { createCamera };
