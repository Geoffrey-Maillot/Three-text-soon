import { Group, Points } from 'three';
import { createStarGeometry } from './createStarGeometry';
import { createStarMaterial } from './createStarMaterial';
import { pane } from '../../system/Tweakpane';
import { animationManager } from '../../../../src/class/AnimationManager';
import { ANIMATE_SHOOTING_STAR } from '../../../../src/constants/animations';

const starMaterialFolder = pane.addFolder('Stars');

const params = {
  color: 0xffffff,
  size: 0.05,
  count: 20,
};

// Add color control to the Tweakpane
starMaterialFolder.addBinding(params, 'color', {
  view: 'color',
});

// Add size control to the Tweakpane
starMaterialFolder.addBinding(params, 'size', {
  min: 0.01,
  max: 0.1,
  step: 0.01,
});

// Add count control to the Tweakpane
starMaterialFolder.addBinding(params, 'count', {
  min: 1,
  max: 100,
  step: 1,
});

class ShootingStar extends Group {
  constructor() {
    super();
  }

  init() {
    const createStar = () => {
      for (let i = 0; i < params.count; i++) {
        const starGeometry = createStarGeometry();
        const starMaterial = createStarMaterial({
          color: params.color,
          size: params.size,
        });

        const star = new Points(starGeometry, starMaterial);
        this.add(star);

        // Create animation for each star
        const timeline = animationManager.createAnimation(
          ANIMATE_SHOOTING_STAR + '-' + i
        );
        // Animate the shooting star
        timeline.to(star.position, {
          x: star.position.x + (Math.random() * 10 - 5),
          y: star.position.y - 5,
          z: star.position.z + (Math.random() * 10 - 5),
          duration: 1,
          ease: 'power1.in',
          onComplete: () => {
            this.remove(star); // Remove the star after the animation
          },
        });
      }
    };

    // Recursive call to continuously create stars
    const animateStars = () => {
      createStar();
      setTimeout(animateStars, 500); // Create new stars every x seconds
    };

    animateStars();
  }
}

export { ShootingStar };
